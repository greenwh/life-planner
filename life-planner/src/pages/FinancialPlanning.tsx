import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FormField } from '../components/FormField';
import { Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { generateId, formatCurrency } from '../lib/utils';
import type { IncomeSource, Expense, Asset, Liability, SavingsGoal, InsurancePolicy } from '../types';

export function FinancialPlanning() {
  const { appData, updateFinancialPlan } = useStore();
  const [activeSection, setActiveSection] = useState<string>('personal');

  if (!appData) return <div>Loading...</div>;

  const { financialPlan } = appData;
  const { personalInfo, income, expenses, assets, liabilities, savingsGoals, insurance, emergencyFund, retirement, taxInfo } = financialPlan;

  // Calculate totals
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const netCashFlow = totalIncome - totalExpenses;

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: '👤' },
    { id: 'income', label: 'Income & Expenses', icon: '💵' },
    { id: 'assets', label: 'Assets & Liabilities', icon: '🏠' },
    { id: 'savings', label: 'Savings Goals', icon: '🎯' },
    { id: 'risk', label: 'Risk Management', icon: '🛡️' },
    { id: 'retirement', label: 'Retirement Planning', icon: '🏖️' },
    { id: 'tax', label: 'Tax Planning', icon: '📋' },
    { id: 'action', label: 'Action Plan', icon: '✅' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Planning</h1>
        <p className="text-lg text-gray-600">
          Organize your financial information and plan for your future.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-700 mb-1">Net Cash Flow</div>
          <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(netCashFlow)}
          </div>
          <div className="text-xs text-blue-600 mt-1">Monthly</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-sm font-medium text-green-700 mb-1">Total Assets</div>
          <div className="text-2xl font-bold text-green-700">{formatCurrency(totalAssets)}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="text-sm font-medium text-orange-700 mb-1">Total Liabilities</div>
          <div className="text-2xl font-bold text-orange-700">{formatCurrency(totalLiabilities)}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-700 mb-1">Net Worth</div>
          <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
            {formatCurrency(netWorth)}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="section-card">
        {activeSection === 'personal' && (
          <PersonalInfoSection
            data={personalInfo}
            onUpdate={(updates) => updateFinancialPlan({ personalInfo: { ...personalInfo, ...updates } })}
          />
        )}

        {activeSection === 'income' && (
          <IncomeExpensesSection
            income={income}
            expenses={expenses}
            onUpdateIncome={(newIncome) => updateFinancialPlan({ income: newIncome })}
            onUpdateExpenses={(newExpenses) => updateFinancialPlan({ expenses: newExpenses })}
          />
        )}

        {activeSection === 'assets' && (
          <AssetsLiabilitiesSection
            assets={assets}
            liabilities={liabilities}
            onUpdateAssets={(newAssets) => updateFinancialPlan({ assets: newAssets })}
            onUpdateLiabilities={(newLiabilities) => updateFinancialPlan({ liabilities: newLiabilities })}
          />
        )}

        {activeSection === 'savings' && (
          <SavingsSection
            goals={savingsGoals}
            onUpdate={(newGoals) => updateFinancialPlan({ savingsGoals: newGoals })}
          />
        )}

        {activeSection === 'risk' && (
          <RiskManagementSection
            insurance={insurance}
            emergencyFund={emergencyFund}
            onUpdateInsurance={(newInsurance) => updateFinancialPlan({ insurance: newInsurance })}
            onUpdateEmergencyFund={(fund) => updateFinancialPlan({ emergencyFund: fund })}
          />
        )}

        {activeSection === 'retirement' && (
          <RetirementSection
            data={retirement}
            onUpdate={(updates) => updateFinancialPlan({ retirement: { ...retirement, ...updates } })}
          />
        )}

        {activeSection === 'tax' && (
          <TaxSection
            data={taxInfo}
            onUpdate={(updates) => updateFinancialPlan({ taxInfo: { ...taxInfo, ...updates } })}
          />
        )}

        {activeSection === 'action' && (
          <ActionPlanSection
            actionPlan={financialPlan.actionPlan}
            reviewSchedule={financialPlan.reviewSchedule}
            onUpdate={(updates) => updateFinancialPlan(updates)}
          />
        )}
      </div>
    </div>
  );
}

// Personal Info Section
function PersonalInfoSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Start by entering your basic personal information and financial goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          name="name"
          value={data.name}
          onChange={(value) => onUpdate({ name: value })}
          required
        />
        <FormField
          label="Age"
          name="age"
          type="number"
          value={data.age}
          onChange={(value) => onUpdate({ age: value })}
          required
        />
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(value) => onUpdate({ dateOfBirth: value })}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={data.contactInfo.email}
          onChange={(value) => onUpdate({ contactInfo: { ...data.contactInfo, email: value } })}
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={data.contactInfo.phone}
          onChange={(value) => onUpdate({ contactInfo: { ...data.contactInfo, phone: value } })}
        />
        <FormField
          label="Address"
          name="address"
          value={data.contactInfo.address}
          onChange={(value) => onUpdate({ contactInfo: { ...data.contactInfo, address: value } })}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Financial Goals</h3>
        <FormField
          label="Short-term Goals (1-2 years)"
          name="shortTermGoals"
          type="textarea"
          value={data.shortTermGoals}
          onChange={(value) => onUpdate({ shortTermGoals: value })}
          placeholder="e.g., Build emergency fund, pay off credit card debt"
          helpText="What do you want to achieve in the next 1-2 years?"
        />
        <FormField
          label="Mid-term Goals (3-5 years)"
          name="midTermGoals"
          type="textarea"
          value={data.midTermGoals}
          onChange={(value) => onUpdate({ midTermGoals: value })}
          placeholder="e.g., Save for down payment, start investment portfolio"
          helpText="What do you want to achieve in the next 3-5 years?"
        />
        <FormField
          label="Long-term Goals (5+ years)"
          name="longTermGoals"
          type="textarea"
          value={data.longTermGoals}
          onChange={(value) => onUpdate({ longTermGoals: value })}
          placeholder="e.g., Retire comfortably, leave inheritance"
          helpText="What are your long-term financial aspirations?"
        />
      </div>
    </div>
  );
}

// Income & Expenses Section (continued in next message due to length)
function IncomeExpensesSection({ income, expenses, onUpdateIncome, onUpdateExpenses }: any) {
  const addIncome = () => {
    const newIncome: IncomeSource = {
      id: generateId(),
      name: '',
      amount: 0,
      frequency: 'monthly',
    };
    onUpdateIncome([...income, newIncome]);
  };

  const updateIncome = (id: string, updates: Partial<IncomeSource>) => {
    onUpdateIncome(income.map((item: IncomeSource) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteIncome = (id: string) => {
    onUpdateIncome(income.filter((item: IncomeSource) => item.id !== id));
  };

  const addExpense = () => {
    const newExpense: Expense = {
      id: generateId(),
      name: '',
      amount: 0,
      type: 'fixed',
      frequency: 'monthly',
    };
    onUpdateExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    onUpdateExpenses(expenses.map((item: Expense) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteExpense = (id: string) => {
    onUpdateExpenses(expenses.filter((item: Expense) => item.id !== id));
  };

  const totalIncome = income.reduce((sum: number, item: IncomeSource) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum: number, item: Expense) => sum + item.amount, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Income & Expenses</h2>
      <p className="text-gray-600 mb-6">
        Track all your income sources and monthly expenses to understand your cash flow.
      </p>

      {/* Income Sources */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Income Sources</h3>
          <button onClick={addIncome} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add Income
          </button>
        </div>

        {income.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No income sources added yet. Click "Add Income" to start.
          </div>
        ) : (
          <div className="space-y-4">
            {income.map((item: IncomeSource) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    label="Source Name"
                    name={`income-name-${item.id}`}
                    value={item.name}
                    onChange={(value) => updateIncome(item.id, { name: value as string })}
                    placeholder="e.g., Salary, Rental Income"
                  />
                  <FormField
                    label="Amount"
                    name={`income-amount-${item.id}`}
                    type="number"
                    value={item.amount}
                    onChange={(value) => updateIncome(item.id, { amount: value as number })}
                  />
                  <FormField
                    label="Frequency"
                    name={`income-frequency-${item.id}`}
                    type="select"
                    value={item.frequency}
                    onChange={(value) => updateIncome(item.id, { frequency: value as any })}
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'annual', label: 'Annual' },
                    ]}
                  />
                  <div className="flex items-end">
                    <button
                      onClick={() => deleteIncome(item.id)}
                      className="btn-danger w-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-right">
          <span className="text-lg font-semibold">Total Monthly Income: </span>
          <span className="text-xl font-bold text-green-700">{formatCurrency(totalIncome)}</span>
        </div>
      </div>

      {/* Expenses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Expenses</h3>
          <button onClick={addExpense} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses added yet. Click "Add Expense" to start.
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((item: Expense) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <FormField
                    label="Expense Name"
                    name={`expense-name-${item.id}`}
                    value={item.name}
                    onChange={(value) => updateExpense(item.id, { name: value as string })}
                    placeholder="e.g., Mortgage, Groceries"
                  />
                  <FormField
                    label="Amount"
                    name={`expense-amount-${item.id}`}
                    type="number"
                    value={item.amount}
                    onChange={(value) => updateExpense(item.id, { amount: value as number })}
                  />
                  <FormField
                    label="Type"
                    name={`expense-type-${item.id}`}
                    type="select"
                    value={item.type}
                    onChange={(value) => updateExpense(item.id, { type: value as any })}
                    options={[
                      { value: 'fixed', label: 'Fixed' },
                      { value: 'variable', label: 'Variable' },
                    ]}
                  />
                  <FormField
                    label="Frequency"
                    name={`expense-frequency-${item.id}`}
                    type="select"
                    value={item.frequency}
                    onChange={(value) => updateExpense(item.id, { frequency: value as any })}
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'annual', label: 'Annual' },
                    ]}
                  />
                  <div className="flex items-end">
                    <button
                      onClick={() => deleteExpense(item.id)}
                      className="btn-danger w-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-right">
          <span className="text-lg font-semibold">Total Monthly Expenses: </span>
          <span className="text-xl font-bold text-red-700">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-lg font-semibold">Net Cash Flow: </div>
        <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-700' : 'text-red-700'}`}>
          {formatCurrency(totalIncome - totalExpenses)}
        </div>
      </div>
    </div>
  );
}

// Simplified placeholder sections for other components
function AssetsLiabilitiesSection({ assets, liabilities, onUpdateAssets, onUpdateLiabilities }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Assets & Liabilities</h2>
      <p className="text-gray-600 mb-6">Track your assets (what you own) and liabilities (what you owe).</p>
      {/* Similar implementation to Income/Expenses - shortened for brevity */}
      <div className="text-center py-12 text-gray-500">
        This section allows you to track assets (savings, investments, property) and liabilities (loans, mortgages, debts).
        Implementation similar to Income & Expenses above.
      </div>
    </div>
  );
}

function SavingsSection({ goals, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Savings & Investment Goals</h2>
      <p className="text-gray-600 mb-6">Set and track your savings goals.</p>
      <div className="text-center py-12 text-gray-500">
        Define specific savings goals with target amounts, dates, and monthly contributions.
      </div>
    </div>
  );
}

function RiskManagementSection({ insurance, emergencyFund, onUpdateInsurance, onUpdateEmergencyFund }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Risk Management</h2>
      <p className="text-gray-600 mb-6">Manage your insurance policies and emergency fund.</p>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Emergency Fund</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Current Emergency Fund"
              name="emergencyFundCurrent"
              type="number"
              value={emergencyFund.current}
              onChange={(value) => onUpdateEmergencyFund({ ...emergencyFund, current: value })}
            />
            <FormField
              label="Target Emergency Fund"
              name="emergencyFundTarget"
              type="number"
              value={emergencyFund.target}
              onChange={(value) => onUpdateEmergencyFund({ ...emergencyFund, target: value })}
              helpText="Recommended: 3-6 months of expenses"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RetirementSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Retirement Planning</h2>
      <p className="text-gray-600 mb-6">Plan for a comfortable retirement.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Current Retirement Savings"
          name="currentSavings"
          type="number"
          value={data.currentSavings}
          onChange={(value) => onUpdate({ currentSavings: value })}
        />
        <FormField
          label="Estimated Retirement Age"
          name="estimatedRetirementAge"
          type="number"
          value={data.estimatedRetirementAge}
          onChange={(value) => onUpdate({ estimatedRetirementAge: value })}
        />
        <FormField
          label="Estimated Monthly Income Needed"
          name="estimatedMonthlyIncome"
          type="number"
          value={data.estimatedMonthlyIncome}
          onChange={(value) => onUpdate({ estimatedMonthlyIncome: value })}
        />
        <FormField
          label="Target Retirement Savings"
          name="targetSavings"
          type="number"
          value={data.targetSavings}
          onChange={(value) => onUpdate({ targetSavings: value })}
        />
        <FormField
          label="Monthly Savings Goal"
          name="monthlySavingsGoal"
          type="number"
          value={data.monthlySavingsGoal}
          onChange={(value) => onUpdate({ monthlySavingsGoal: value })}
        />
        <FormField
          label="Social Security Estimate"
          name="socialSecurityEstimate"
          type="number"
          value={data.socialSecurityEstimate}
          onChange={(value) => onUpdate({ socialSecurityEstimate: value })}
        />
      </div>
      <FormField
        label="Pension Plans & Other Retirement Income"
        name="pensionPlans"
        type="textarea"
        value={data.pensionPlans}
        onChange={(value) => onUpdate({ pensionPlans: value })}
        helpText="Describe any pension plans, annuities, or other retirement income sources"
      />
    </div>
  );
}

function TaxSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tax Planning</h2>
      <p className="text-gray-600 mb-6">Document your tax situation and strategies.</p>
      <div className="space-y-4">
        <FormField
          label="Filing Status"
          name="filingStatus"
          value={data.filingStatus}
          onChange={(value) => onUpdate({ filingStatus: value })}
          placeholder="e.g., Single, Married Filing Jointly"
        />
        <FormField
          label="Estimated Tax Rate (%)"
          name="estimatedTaxRate"
          type="number"
          value={data.estimatedTaxRate}
          onChange={(value) => onUpdate({ estimatedTaxRate: value })}
        />
        <FormField
          label="Current Tax Strategies"
          name="currentStrategies"
          type="textarea"
          value={data.currentStrategies}
          onChange={(value) => onUpdate({ currentStrategies: value })}
          placeholder="e.g., Max out 401(k), HSA contributions"
        />
        <FormField
          label="Deductions & Credits"
          name="deductions"
          type="textarea"
          value={data.deductions}
          onChange={(value) => onUpdate({ deductions: value })}
          placeholder="e.g., Mortgage interest, charitable donations"
        />
      </div>
    </div>
  );
}

function ActionPlanSection({ actionPlan, reviewSchedule, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Action Plan & Review</h2>
      <p className="text-gray-600 mb-6">Set specific actions and review schedule.</p>
      <div className="space-y-4">
        <FormField
          label="Action Plan"
          name="actionPlan"
          type="textarea"
          value={actionPlan}
          onChange={(value) => onUpdate({ actionPlan: value })}
          placeholder="List specific actions to take (e.g., increase 401k contribution by 2%, pay off credit card by December)"
          helpText="What specific steps will you take to achieve your financial goals?"
        />
        <FormField
          label="Review Schedule"
          name="reviewSchedule"
          type="select"
          value={reviewSchedule}
          onChange={(value) => onUpdate({ reviewSchedule: value })}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annually', label: 'Annually' },
          ]}
          helpText="How often will you review and update your financial plan?"
        />
      </div>
    </div>
  );
}
