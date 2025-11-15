import { create } from 'zustand';
import type { AppData, AppSettings, AIConfig } from '../types';
import { db, createDefaultAppData } from '../lib/database';
import { AIAssistant } from '../lib/ai-service';
import {
  generateEncryptionKey,
  storeEncryptionKey,
  retrieveEncryptionKey,
  isEncryptionSetup,
} from '../lib/encryption';

interface AppState {
  // Data
  appData: AppData | null;
  settings: AppSettings | null;
  isLoading: boolean;
  error: string | null;

  // AI Assistant
  aiAssistant: AIAssistant | null;
  aiMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isAILoading: boolean;

  // Encryption
  isUnlocked: boolean;
  encryptionKey: string | null;
  isPasswordSetup: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  loadData: () => Promise<void>;
  saveData: (data: AppData) => Promise<void>;
  updateFinancialPlan: (data: Partial<AppData['financialPlan']>) => Promise<void>;
  updateEstatePlan: (data: Partial<AppData['estatePlan']>) => Promise<void>;
  updateNextOfKinPlan: (data: Partial<AppData['nextOfKinPlan']>) => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // AI
  initializeAI: (config: AIConfig) => void;
  sendAIMessage: (message: string, context?: string) => Promise<void>;
  clearAIHistory: () => void;

  // Encryption
  setupPassword: (password: string) => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;

  // Utility
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  appData: null,
  settings: null,
  isLoading: false,
  error: null,
  aiAssistant: null,
  aiMessages: [],
  isAILoading: false,
  isUnlocked: false,
  encryptionKey: null,
  isPasswordSetup: false,

  // Initialize the application
  initializeApp: async () => {
    set({ isLoading: true, error: null });

    try {
      // Check if password is set up
      const passwordSetup = isEncryptionSetup();
      set({ isPasswordSetup: passwordSetup });

      // Load settings
      const settings = await db.getSettings();

      if (!settings) {
        // Create default settings (encryption is now always enabled)
        const defaultSettings: AppSettings = {
          autoSave: true,
          theme: 'light',
        };
        await db.saveSettings(defaultSettings);
        set({ settings: defaultSettings });
      } else {
        set({ settings });
      }

      // Always start locked - user must unlock with password
      set({ isUnlocked: false });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      set({ error: 'Failed to initialize application' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load data
  loadData: async () => {
    set({ isLoading: true, error: null });

    try {
      const { encryptionKey } = get();
      const data = await db.getAppData('default', encryptionKey || undefined);

      if (data) {
        set({ appData: data });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ error: 'Failed to load data' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Save data
  saveData: async (data: AppData) => {
    const { encryptionKey } = get();

    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await db.saveAppData(updatedData, encryptionKey || undefined);
      set({ appData: updatedData, error: null });
    } catch (error) {
      console.error('Failed to save data:', error);
      set({ error: 'Failed to save data' });
      throw error;
    }
  },

  // Update financial plan
  updateFinancialPlan: async (updates: Partial<AppData['financialPlan']>) => {
    const { appData, saveData } = get();

    if (!appData) {
      throw new Error('No data loaded');
    }

    const updatedData = {
      ...appData,
      financialPlan: {
        ...appData.financialPlan,
        ...updates,
        lastUpdated: new Date().toISOString(),
      },
    };

    await saveData(updatedData);
  },

  // Update estate plan
  updateEstatePlan: async (updates: Partial<AppData['estatePlan']>) => {
    const { appData, saveData } = get();

    if (!appData) {
      throw new Error('No data loaded');
    }

    const updatedData = {
      ...appData,
      estatePlan: {
        ...appData.estatePlan,
        ...updates,
        lastUpdated: new Date().toISOString(),
      },
    };

    await saveData(updatedData);
  },

  // Update next of kin plan
  updateNextOfKinPlan: async (updates: Partial<AppData['nextOfKinPlan']>) => {
    const { appData, saveData } = get();

    if (!appData) {
      throw new Error('No data loaded');
    }

    const updatedData = {
      ...appData,
      nextOfKinPlan: {
        ...appData.nextOfKinPlan,
        ...updates,
        lastUpdated: new Date().toISOString(),
      },
    };

    await saveData(updatedData);
  },

  // Update settings
  updateSettings: async (updates: Partial<AppSettings>) => {
    const { settings } = get();

    const updatedSettings = {
      ...settings,
      ...updates,
    } as AppSettings;

    await db.saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  // Initialize AI assistant
  initializeAI: (config: AIConfig) => {
    const assistant = new AIAssistant(config);
    set({ aiAssistant: assistant, aiMessages: [] });
  },

  // Send message to AI
  sendAIMessage: async (message: string, context?: string) => {
    const { aiAssistant, aiMessages } = get();

    if (!aiAssistant) {
      throw new Error('AI assistant not initialized');
    }

    set({ isAILoading: true });

    try {
      // Add user message
      const newMessages = [...aiMessages, { role: 'user' as const, content: message }];
      set({ aiMessages: newMessages });

      // Get AI response
      const response = await aiAssistant.sendMessage(message, context);

      // Add assistant message
      set({
        aiMessages: [...newMessages, { role: 'assistant' as const, content: response }],
        isAILoading: false,
      });
    } catch (error) {
      console.error('AI error:', error);
      set({
        error: 'Failed to get AI response',
        isAILoading: false,
      });
      throw error;
    }
  },

  // Clear AI history
  clearAIHistory: () => {
    const { aiAssistant } = get();
    if (aiAssistant) {
      aiAssistant.clearHistory();
    }
    set({ aiMessages: [] });
  },

  // Setup password for first-time users
  setupPassword: async (password: string) => {
    try {
      // Generate a new encryption key
      const key = generateEncryptionKey();

      // Store the encrypted key
      storeEncryptionKey(key, password);

      // Set the encryption key and unlock
      set({
        encryptionKey: key,
        isUnlocked: true,
        isPasswordSetup: true,
        error: null,
      });

      // Create default data and save it encrypted
      const defaultData = createDefaultAppData();
      await db.saveAppData(defaultData, key);
      set({ appData: defaultData });
    } catch (error) {
      console.error('Failed to setup password:', error);
      set({ error: 'Failed to setup password' });
      throw error;
    }
  },

  // Unlock with password
  unlock: async (password: string): Promise<boolean> => {
    try {
      // Retrieve the encryption key using the password
      const key = retrieveEncryptionKey(password);

      if (!key) {
        set({ error: 'Incorrect password' });
        return false;
      }

      // Load and decrypt data
      const data = await db.getAppData('default', key);

      if (!data) {
        // If no data exists, create default data
        const defaultData = createDefaultAppData();
        await db.saveAppData(defaultData, key);
        set({
          encryptionKey: key,
          isUnlocked: true,
          appData: defaultData,
          error: null,
        });
      } else {
        set({
          encryptionKey: key,
          isUnlocked: true,
          appData: data,
          error: null,
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to unlock:', error);
      set({ error: 'Failed to unlock - incorrect password or corrupted data' });
      return false;
    }
  },

  // Lock the app
  lock: () => {
    set({ encryptionKey: null, isUnlocked: false, appData: null });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
