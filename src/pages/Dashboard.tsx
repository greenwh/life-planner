
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FileText, Users, Calendar, TrendingUp, Shield } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

export function Dashboard() {
  const { appData } = useStore();
  const navigate = useNavigate();

  if (!appData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { financialPlan, estatePlan, nextOfKinPlan } = appData;

  // Calculate financial summary
  const totalIncome = financialPlan.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = financialPlan.expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = financialPlan.assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = financialPlan.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const netCashFlow = totalIncome - totalExpenses;

  // Estate planning completeness
  const estateChecklist = [
    estatePlan.will.exists,
    estatePlan.powerOfAttorney.financial.exists,
    estatePlan.powerOfAttorney.healthcare.exists,
    estatePlan.healthcareDirectives.livingWill.exists,
  ];
  const estateCompleteness = (estateChecklist.filter(Boolean).length / estateChecklist.length) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {financialPlan.personalInfo.name || 'User'}
        </h1>
        <p className="text-lg text-gray-600">
          Here's an overview of your life planning progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="section-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/financial')}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Net Worth</p>
              <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(netWorth)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-700" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Assets: {formatCurrency(totalAssets)} | Liabilities: {formatCurrency(totalLiabilities)}
          </p>
        </div>

        <div
          className="section-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/financial')}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Cash Flow</p>
              <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(netCashFlow)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-700" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Income: {formatCurrency(totalIncome)} | Expenses: {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div
          className="section-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/estate')}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Estate Planning</p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round(estateCompleteness)}% Complete
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="text-purple-700" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {estateChecklist.filter(Boolean).length} of {estateChecklist.length} key documents
          </p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuickAccessCard
          icon={<DollarSign size={32} />}
          title="Financial Planning"
          description="Manage income, expenses, assets, and retirement plans"
          onClick={() => navigate('/financial')}
          color="blue"
        />
        <QuickAccessCard
          icon={<FileText size={32} />}
          title="Estate Planning"
          description="Document wills, trusts, powers of attorney, and healthcare directives"
          onClick={() => navigate('/estate')}
          color="purple"
        />
        <QuickAccessCard
          icon={<Users size={32} />}
          title="Next of Kin Plan"
          description="Create step-by-step actions for loved ones"
          onClick={() => navigate('/next-of-kin')}
          color="green"
        />
      </div>

      {/* Recent Activity / Reminders */}
      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-4">Important Reminders</h2>
        <div className="space-y-3">
          <ReminderItem
            icon={<Calendar size={20} />}
            text={`Last updated: ${formatDate(appData.updatedAt)}`}
            type="info"
          />
          {!estatePlan.will.exists && (
            <ReminderItem
              icon={<FileText size={20} />}
              text="Consider creating a Last Will and Testament"
              type="warning"
            />
          )}
          {!estatePlan.powerOfAttorney.healthcare.exists && (
            <ReminderItem
              icon={<FileText size={20} />}
              text="Set up Healthcare Power of Attorney"
              type="warning"
            />
          )}
          {nextOfKinPlan.actionSteps.length === 0 && (
            <ReminderItem
              icon={<Users size={20} />}
              text="Add action steps for your next of kin"
              type="warning"
            />
          )}
          {financialPlan.emergencyFund.current < financialPlan.emergencyFund.target && (
            <ReminderItem
              icon={<DollarSign size={20} />}
              text={`Emergency fund: ${formatCurrency(financialPlan.emergencyFund.current)} of ${formatCurrency(financialPlan.emergencyFund.target)} goal`}
              type="info"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface QuickAccessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: 'blue' | 'purple' | 'green';
}

function QuickAccessCard({ icon, title, description, onClick, color }: QuickAccessCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} border-2 rounded-xl p-6 text-left transition-all hover:shadow-md`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </button>
  );
}

interface ReminderItemProps {
  icon: React.ReactNode;
  text: string;
  type: 'info' | 'warning';
}

function ReminderItem({ icon, text, type }: ReminderItemProps) {
  const colorClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`${colorClasses[type]} border rounded-lg p-3 flex items-center gap-3`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
