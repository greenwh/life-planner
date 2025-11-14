import Dexie, { type Table } from 'dexie';
import type { AppData, AppSettings } from '../types';
import { encrypt, decrypt } from './encryption';

export class LifePlannerDatabase extends Dexie {
  appData!: Table<AppData, string>;
  settings!: Table<AppSettings & { id: string }, string>;

  constructor() {
    super('LifePlannerDB');

    this.version(1).stores({
      appData: 'id, updatedAt',
      settings: 'id',
    });
  }

  /**
   * Save app data (with optional encryption)
   */
  async saveAppData(data: AppData, encryptionKey?: string): Promise<void> {
    try {
      if (encryptionKey) {
        // Store encrypted version
        const encryptedData = {
          ...data,
          financialPlan: JSON.parse(encrypt(JSON.stringify(data.financialPlan), encryptionKey)),
          estatePlan: JSON.parse(encrypt(JSON.stringify(data.estatePlan), encryptionKey)),
          nextOfKinPlan: JSON.parse(encrypt(JSON.stringify(data.nextOfKinPlan), encryptionKey)),
        };
        await this.appData.put(encryptedData);
      } else {
        await this.appData.put(data);
      }
    } catch (error) {
      console.error('Failed to save app data:', error);
      throw new Error('Failed to save data to database');
    }
  }

  /**
   * Get app data (with optional decryption)
   */
  async getAppData(id: string, encryptionKey?: string): Promise<AppData | undefined> {
    try {
      const data = await this.appData.get(id);
      if (!data) return undefined;

      if (encryptionKey) {
        // Decrypt the data
        return {
          ...data,
          financialPlan: JSON.parse(decrypt(JSON.stringify(data.financialPlan), encryptionKey)),
          estatePlan: JSON.parse(decrypt(JSON.stringify(data.estatePlan), encryptionKey)),
          nextOfKinPlan: JSON.parse(decrypt(JSON.stringify(data.nextOfKinPlan), encryptionKey)),
        };
      }

      return data;
    } catch (error) {
      console.error('Failed to get app data:', error);
      throw new Error('Failed to retrieve data from database');
    }
  }

  /**
   * Get all app data entries
   */
  async getAllAppData(): Promise<AppData[]> {
    return await this.appData.toArray();
  }

  /**
   * Delete app data
   */
  async deleteAppData(id: string): Promise<void> {
    await this.appData.delete(id);
  }

  /**
   * Save settings
   */
  async saveSettings(settings: AppSettings): Promise<void> {
    await this.settings.put({ ...settings, id: 'default' });
  }

  /**
   * Get settings
   */
  async getSettings(): Promise<AppSettings | undefined> {
    const result = await this.settings.get('default');
    if (!result) return undefined;
    const { id, ...settings } = result;
    return settings;
  }

  /**
   * Export all data as JSON
   */
  async exportData(): Promise<string> {
    const appData = await this.getAllAppData();
    const settings = await this.getSettings();

    return JSON.stringify({
      appData,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }, null, 2);
  }

  /**
   * Import data from JSON
   */
  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);

      if (data.appData && Array.isArray(data.appData)) {
        await this.appData.bulkPut(data.appData);
      }

      if (data.settings) {
        await this.saveSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import data - invalid format');
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    await this.appData.clear();
    await this.settings.clear();
  }
}

// Create singleton instance
export const db = new LifePlannerDatabase();

/**
 * Initialize default data structure
 */
export function createDefaultAppData(): AppData {
  const now = new Date().toISOString();

  return {
    id: 'default',
    financialPlan: {
      personalInfo: {
        name: '',
        age: 0,
        dateOfBirth: '',
        contactInfo: {
          email: '',
          phone: '',
          address: '',
        },
        shortTermGoals: '',
        midTermGoals: '',
        longTermGoals: '',
      },
      income: [],
      expenses: [],
      assets: [],
      liabilities: [],
      savingsGoals: [],
      insurance: [],
      emergencyFund: {
        current: 0,
        target: 0,
      },
      retirement: {
        currentSavings: 0,
        estimatedRetirementAge: 65,
        estimatedMonthlyIncome: 0,
        targetSavings: 0,
        monthlySavingsGoal: 0,
        pensionPlans: '',
        socialSecurityEstimate: 0,
      },
      taxInfo: {
        filingStatus: '',
        currentStrategies: '',
        deductions: '',
        estimatedTaxRate: 0,
      },
      actionPlan: '',
      reviewSchedule: 'quarterly',
      lastUpdated: now,
    },
    estatePlan: {
      will: {
        exists: false,
        executor: {
          name: '',
          relationship: '',
          contactInfo: '',
        },
        assetDistribution: '',
        specialInstructions: '',
      },
      trust: {
        exists: false,
        trustee: {
          name: '',
          relationship: '',
          contactInfo: '',
        },
        beneficiaries: [],
        assets: '',
        terms: '',
      },
      powerOfAttorney: {
        financial: {
          exists: false,
        },
        healthcare: {
          exists: false,
        },
        digitalAssets: {
          exists: false,
        },
      },
      healthcareDirectives: {
        livingWill: {
          exists: false,
          lifeSustaining: 'conditional',
          organDonation: 'no',
          preferences: '',
        },
        dnr: {
          exists: false,
        },
        advanceDirectives: '',
      },
      beneficiaryDesignations: [],
      letterOfIntent: {
        funeralWishes: '',
        burialPreferences: '',
        personalItemDistribution: '',
        specialInstructions: '',
        messages: '',
      },
      personalCareNeeds: {
        dailyLivingAssistance: '',
        medicalEquipment: '',
        homeModifications: '',
        caregiverInfo: '',
      },
      legalAdvocacy: {
        guardianshipInfo: '',
        disabilityBenefits: '',
        legalProtections: '',
        advocateInfo: '',
      },
      qualityOfLife: {
        transportationNeeds: '',
        mobilityAids: '',
        homeAccessibility: '',
        communityResources: '',
      },
      lastUpdated: now,
    },
    nextOfKinPlan: {
      actionSteps: [],
      lastUpdated: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}
