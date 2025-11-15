import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FinancialPlanning } from './pages/FinancialPlanning';
import { EstatePlanning } from './pages/EstatePlanning';
import { NextOfKinPlan } from './pages/NextOfKinPlan';
import { Settings } from './pages/Settings';
import { UnlockScreen } from './components/UnlockScreen';
import { SetupPassword } from './components/SetupPassword';
import { Loader2 } from 'lucide-react';

function App() {
  const { initializeApp, isLoading, error, isUnlocked, isPasswordSetup, setupPassword, unlock, clearError } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setIsInitialized(true);
    };
    init();
  }, [initializeApp]);

  const handleSetupPassword = async (password: string) => {
    try {
      setUnlockError(null);
      await setupPassword(password);
    } catch (err) {
      setUnlockError('Failed to setup password. Please try again.');
    }
  };

  const handleUnlock = async (password: string) => {
    try {
      setUnlockError(null);
      clearError();
      const success = await unlock(password);
      if (!success) {
        setUnlockError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setUnlockError('Failed to unlock. Please try again.');
    }
  };

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-xl text-gray-700">Loading Life Planner...</p>
        </div>
      </div>
    );
  }

  // Show fatal error screen
  if (error && !isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show setup screen for first-time users
  if (!isPasswordSetup && !isUnlocked) {
    return <SetupPassword onSetup={handleSetupPassword} />;
  }

  // Show unlock screen if not unlocked
  if (!isUnlocked) {
    return <UnlockScreen onUnlock={handleUnlock} error={unlockError || undefined} />;
  }

  // Show main app when unlocked
  return (
    <BrowserRouter basename="/life-planner">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="financial" element={<FinancialPlanning />} />
          <Route path="estate" element={<EstatePlanning />} />
          <Route path="next-of-kin" element={<NextOfKinPlan />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
