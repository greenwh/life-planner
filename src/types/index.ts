// Personal Information
export interface PersonalInfo {
  name: string;
  age: number;
  dateOfBirth: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  shortTermGoals: string;
  midTermGoals: string;
  longTermGoals: string;
}

// Financial Planning Types
export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
  frequency: 'monthly' | 'annual';
}

export interface Asset {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'property' | 'retirement' | 'other';
  value: number;
  description?: string;
}

export interface Liability {
  id: string;
  name: string;
  type: 'loan' | 'credit_card' | 'mortgage' | 'other';
  amount: number;
  interestRate?: number;
  monthlyPayment?: number;
  description?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export interface InsurancePolicy {
  id: string;
  type: 'life' | 'health' | 'disability' | 'property' | 'other';
  provider: string;
  policyNumber: string;
  coverage: number;
  premium: number;
  expiryDate: string;
}

export interface RetirementPlan {
  currentSavings: number;
  estimatedRetirementAge: number;
  estimatedMonthlyIncome: number;
  targetSavings: number;
  monthlySavingsGoal: number;
  pensionPlans: string;
  socialSecurityEstimate: number;
}

export interface TaxInfo {
  filingStatus: string;
  currentStrategies: string;
  deductions: string;
  estimatedTaxRate: number;
}

export interface FinancialPlan {
  personalInfo: PersonalInfo;
  income: IncomeSource[];
  expenses: Expense[];
  assets: Asset[];
  liabilities: Liability[];
  savingsGoals: SavingsGoal[];
  insurance: InsurancePolicy[];
  emergencyFund: {
    current: number;
    target: number;
  };
  retirement: RetirementPlan;
  taxInfo: TaxInfo;
  actionPlan: string;
  reviewSchedule: 'monthly' | 'quarterly' | 'annually';
  lastUpdated: string;
}

// Estate Planning Types
export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage?: number;
  contactInfo?: string;
}

export interface Will {
  exists: boolean;
  dateCreated?: string;
  location?: string;
  executor: {
    name: string;
    relationship: string;
    contactInfo: string;
  };
  guardianForMinors?: {
    name: string;
    relationship: string;
    contactInfo: string;
  };
  assetDistribution: string;
  specialInstructions: string;
}

export interface Trust {
  exists: boolean;
  type?: 'revocable' | 'irrevocable';
  dateCreated?: string;
  trustee: {
    name: string;
    relationship: string;
    contactInfo: string;
  };
  beneficiaries: Beneficiary[];
  assets: string;
  terms: string;
}

export interface PowerOfAttorney {
  financial: {
    exists: boolean;
    agent?: {
      name: string;
      relationship: string;
      contactInfo: string;
    };
    dateCreated?: string;
    scope?: string;
  };
  healthcare: {
    exists: boolean;
    agent?: {
      name: string;
      relationship: string;
      contactInfo: string;
    };
    dateCreated?: string;
    scope?: string;
  };
  digitalAssets: {
    exists: boolean;
    instructions?: string;
    accounts?: string;
  };
}

export interface HealthcareDirectives {
  livingWill: {
    exists: boolean;
    dateCreated?: string;
    lifeSustaining: 'yes' | 'no' | 'conditional';
    organDonation: 'yes' | 'no';
    preferences: string;
  };
  dnr: {
    exists: boolean;
    location?: string;
  };
  advanceDirectives: string;
}

export interface BeneficiaryDesignation {
  id: string;
  accountType: 'life_insurance' | 'retirement' | 'investment' | 'bank' | 'other';
  accountName: string;
  institution: string;
  accountNumber: string;
  primaryBeneficiaries: Beneficiary[];
  contingentBeneficiaries: Beneficiary[];
  lastReviewed?: string;
}

export interface LetterOfIntent {
  funeralWishes: string;
  burialPreferences: string;
  personalItemDistribution: string;
  specialInstructions: string;
  messages: string;
}

export interface PersonalCareNeeds {
  dailyLivingAssistance: string;
  medicalEquipment: string;
  homeModifications: string;
  caregiverInfo: string;
}

export interface LegalAdvocacy {
  guardianshipInfo: string;
  disabilityBenefits: string;
  legalProtections: string;
  advocateInfo: string;
}

export interface QualityOfLife {
  transportationNeeds: string;
  mobilityAids: string;
  homeAccessibility: string;
  communityResources: string;
}

export interface EstatePlan {
  will: Will;
  trust: Trust;
  powerOfAttorney: PowerOfAttorney;
  healthcareDirectives: HealthcareDirectives;
  beneficiaryDesignations: BeneficiaryDesignation[];
  letterOfIntent: LetterOfIntent;
  personalCareNeeds: PersonalCareNeeds;
  legalAdvocacy: LegalAdvocacy;
  qualityOfLife: QualityOfLife;
  lastUpdated: string;
}

// Next of Kin Action Plan
export interface ActionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  organization: string;
  contactInfo: {
    phone?: string;
    address?: string;
    url?: string;
    email?: string;
  };
  documents?: string;
  notes?: string;
}

export interface NextOfKinPlan {
  actionSteps: ActionStep[];
  lastUpdated: string;
}

// Application Data
export interface AppData {
  id: string;
  financialPlan: FinancialPlan;
  estatePlan: EstatePlan;
  nextOfKinPlan: NextOfKinPlan;
  createdAt: string;
  updatedAt: string;
}

// AI Configuration
export type AIProvider = 'anthropic' | 'openai' | 'xai' | 'google';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Settings
export interface AppSettings {
  aiConfig?: AIConfig;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
}
