import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FinancialPlanning } from './pages/FinancialPlanning';
import { EstatePlanning } from './pages/EstatePlanning';
import { NextOfKinPlan } from './pages/NextOfKinPlan';
import { Settings } from './pages/Settings';
import { Loader2 } from 'lucide-react';

function App() {
  const { initializeApp, isLoading, error } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setIsInitialized(true);
    };
    init();
  }, [initializeApp]);

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

  if (error) {
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
