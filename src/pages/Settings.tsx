import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FormField } from '../components/FormField';
import { Download, Upload, Save, FileJson, FileText } from 'lucide-react';
import { getAvailableProviders, getAIConfigFromEnv } from '../lib/ai-service';
import { db } from '../lib/database';
import { exportAsPDF, exportAsJSON, importFromJSON, createBackup, generateReport } from '../lib/export';
import type { AIProvider } from '../types';

export function Settings() {
  const { appData, settings, updateSettings, initializeAI } = useStore();
  const [activeTab, setActiveTab] = useState<'ai' | 'backup' | 'general'>('ai');
  const [aiProvider, setAiProvider] = useState<AIProvider>('anthropic');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const availableProviders = getAvailableProviders();

  const handleAISetup = () => {
    if (!apiKey || !model) {
      alert('Please enter both API key and model');
      return;
    }

    initializeAI({
      provider: aiProvider,
      apiKey,
      model,
    });

    updateSettings({
      aiConfig: {
        provider: aiProvider,
        apiKey,
        model,
      },
    });

    setSuccessMessage('AI Assistant configured successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const loadEnvConfig = () => {
    const config = getAIConfigFromEnv(aiProvider);
    if (config) {
      setApiKey(config.apiKey);
      setModel(config.model);
      setSuccessMessage('Loaded configuration from environment');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('No configuration found in environment for this provider');
    }
  };

  const handleExportJSON = () => {
    if (appData) {
      exportAsJSON(appData);
      setSuccessMessage('Data exported as JSON');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleExportPDF = () => {
    if (appData) {
      exportAsPDF(appData);
      setSuccessMessage('Report generated as PDF');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      await db.saveAppData(data);
      window.location.reload();
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleBackup = () => {
    if (appData) {
      createBackup(appData);
      setSuccessMessage('Backup created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'backup', label: 'Backup & Export', icon: '💾' },
    { id: 'general', label: 'General', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-600">
          Configure your application preferences, AI assistant, and manage backups.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="section-card">
        {activeTab === 'ai' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">AI Assistant Configuration</h2>
            <p className="text-gray-600 mb-6">
              Configure your AI assistant to get context-aware help throughout the application.
            </p>

            {availableProviders.length > 0 && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">
                  ✓ Environment Configuration Detected
                </p>
                <p className="text-sm text-green-700">
                  Available providers: {availableProviders.join(', ')}
                </p>
                <button
                  onClick={loadEnvConfig}
                  className="btn-secondary mt-3"
                >
                  Load Configuration from Environment
                </button>
              </div>
            )}

            <div className="space-y-4">
              <FormField
                label="AI Provider"
                name="aiProvider"
                type="select"
                value={aiProvider}
                onChange={(value) => setAiProvider(value as AIProvider)}
                options={[
                  { value: 'anthropic', label: 'Anthropic Claude' },
                  { value: 'openai', label: 'OpenAI GPT' },
                  { value: 'xai', label: 'xAI Grok' },
                  { value: 'google', label: 'Google Gemini' },
                ]}
              />

              <FormField
                label="API Key"
                name="apiKey"
                value={apiKey}
                onChange={(value) => setApiKey(value as string)}
                placeholder="Enter your API key"
                helpText="Your API key is stored locally and never sent to any server except the AI provider"
              />

              <FormField
                label="Model"
                name="model"
                value={model}
                onChange={(value) => setModel(value as string)}
                placeholder={
                  aiProvider === 'anthropic'
                    ? 'claude-sonnet-4-5-20251001'
                    : aiProvider === 'openai'
                    ? 'gpt-4o-mini'
                    : aiProvider === 'google'
                    ? 'gemini-2.0-flash-exp'
                    : 'grok-beta'
                }
                helpText="Enter the model ID you want to use"
              />

              <button onClick={handleAISetup} className="btn-primary">
                <Save size={20} className="inline mr-2" />
                Save AI Configuration
              </button>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-3">Using Environment Variables</h3>
              <p className="text-gray-600 mb-4">
                You can configure AI providers using a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file
                in your project root. See <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> for the format.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <div>VITE_ANTHROPIC_API_KEY="sk-ant-..."</div>
                <div>VITE_ANTHROPIC_API_MODEL="claude-sonnet-4-5-20251001"</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Backup & Export</h2>
            <p className="text-gray-600 mb-6">
              Export your data, create backups, and generate reports.
            </p>

            <div className="space-y-6">
              {/* Export Options */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Export Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportJSON}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <FileJson size={20} />
                    Export as JSON
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <FileText size={20} />
                    Generate PDF Report
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  JSON exports can be imported later. PDF reports are for viewing and printing.
                </p>
              </div>

              {/* Backup */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Create Backup</h3>
                <button
                  onClick={handleBackup}
                  className="btn-success flex items-center gap-2"
                >
                  <Download size={20} />
                  Create Backup
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Creates a timestamped JSON backup of all your data. Keep this file safe!
                </p>
              </div>

              {/* Import */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Import Data</h3>
                <label className="btn-secondary flex items-center gap-2 cursor-pointer inline-flex">
                  <Upload size={20} />
                  Import from JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  Restore data from a previous JSON backup. This will replace your current data.
                </p>
              </div>

              {/* Database Info */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Storage Information</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 mb-2">
                    <strong>Data Storage:</strong> All your data is stored locally in your browser's IndexedDB.
                  </p>
                  <p className="text-blue-800 mb-2">
                    <strong>Privacy:</strong> Your data never leaves your device unless you explicitly export it.
                  </p>
                  <p className="text-blue-800">
                    <strong>Backup Recommendation:</strong> Create regular backups and store them securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
            <p className="text-gray-600 mb-6">
              Configure general application preferences.
            </p>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings?.autoSave ?? true}
                    onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-medium">Auto-save</div>
                    <div className="text-sm text-gray-600">
                      Automatically save changes as you type (2 second delay)
                    </div>
                  </div>
                </label>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Life Planner</strong></p>
                  <p>Version 1.0.0</p>
                  <p>An AI-assisted life planning application for organizing financial and estate planning information.</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 text-red-700">Danger Zone</h3>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all data? This cannot be undone!')) {
                      db.clearAll();
                      window.location.reload();
                    }
                  }}
                  className="btn-danger"
                >
                  Clear All Data
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Permanently delete all data from the database. Create a backup first!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
