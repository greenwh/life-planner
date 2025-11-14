
import { NavLink, Outlet } from 'react-router-dom';
import { Home, DollarSign, FileText, Users, Settings as SettingsIcon } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { useStore } from '../store/useStore';

export function Layout() {
  const { appData } = useStore();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/financial', icon: DollarSign, label: 'Financial' },
    { to: '/estate', icon: FileText, label: 'Estate' },
    { to: '/next-of-kin', icon: Users, label: 'Next of Kin' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Life Planner</h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-gray-200">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 px-2 flex-1 ${
                    isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="text-xs">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* AI Assistant */}
      {appData && <AIAssistant context={getCurrentContext()} />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Life Planner - Your Personal Life Planning Assistant</p>
            <p className="mt-1">All data is stored locally and encrypted for your privacy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getCurrentContext(): string {
  const path = window.location.pathname;
  if (path.includes('financial')) {
    return 'User is working on financial planning. Help with income, expenses, assets, liabilities, savings, insurance, retirement, or tax planning.';
  } else if (path.includes('estate')) {
    return 'User is working on estate planning. Help with wills, trusts, powers of attorney, healthcare directives, beneficiaries, or personal care planning.';
  } else if (path.includes('next-of-kin')) {
    return 'User is creating an action plan for their next of kin. Help with organizing steps, contact information, and instructions for after death.';
  } else if (path.includes('settings')) {
    return 'User is in settings. Help with AI configuration, data backup, export, or general application settings.';
  }
  return 'User is on the dashboard. Provide general guidance on life planning, financial planning, and estate planning.';
}
