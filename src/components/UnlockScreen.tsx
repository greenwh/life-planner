import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface UnlockScreenProps {
  onUnlock: (password: string) => void;
  error?: string;
}

export function UnlockScreen({ onUnlock, error }: UnlockScreenProps) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    setLocalError('');
    onUnlock(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Life Planner
            </h1>
            <p className="text-gray-600">
              Enter your password to unlock
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                autoFocus
              />
            </div>

            {/* Error Messages */}
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700">
                  {error || localError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Unlock
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your data is encrypted and stored securely on your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
