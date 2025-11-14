import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FormField } from '../components/FormField';
import { generateId } from '../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import type { Beneficiary, BeneficiaryDesignation } from '../types';

export function EstatePlanning() {
  const { appData, updateEstatePlan } = useStore();
  const [activeSection, setActiveSection] = useState<string>('will');

  if (!appData) return <div>Loading...</div>;

  const { estatePlan } = appData;

  const sections = [
    { id: 'will', label: 'Last Will & Testament', icon: '📜' },
    { id: 'trust', label: 'Trust', icon: '🏛️' },
    { id: 'poa', label: 'Power of Attorney', icon: '⚖️' },
    { id: 'healthcare', label: 'Healthcare Directives', icon: '🏥' },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: '👥' },
    { id: 'letter', label: 'Letter of Intent', icon: '✉️' },
    { id: 'care', label: 'Personal Care', icon: '🤝' },
    { id: 'legal', label: 'Legal & Advocacy', icon: '⚡' },
    { id: 'quality', label: 'Quality of Life', icon: '🌟' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Estate & Life Planning</h1>
        <p className="text-lg text-gray-600">
          Document your legal documents, healthcare wishes, and life planning needs.
        </p>
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
        {activeSection === 'will' && <WillSection data={estatePlan.will} onUpdate={(updates) => updateEstatePlan({ will: { ...estatePlan.will, ...updates } })} />}
        {activeSection === 'trust' && <TrustSection data={estatePlan.trust} onUpdate={(updates) => updateEstatePlan({ trust: { ...estatePlan.trust, ...updates } })} />}
        {activeSection === 'poa' && <PowerOfAttorneySection data={estatePlan.powerOfAttorney} onUpdate={(updates) => updateEstatePlan({ powerOfAttorney: { ...estatePlan.powerOfAttorney, ...updates } })} />}
        {activeSection === 'healthcare' && <HealthcareDirectivesSection data={estatePlan.healthcareDirectives} onUpdate={(updates) => updateEstatePlan({ healthcareDirectives: { ...estatePlan.healthcareDirectives, ...updates } })} />}
        {activeSection === 'beneficiaries' && <BeneficiariesSection data={estatePlan.beneficiaryDesignations} onUpdate={(updates) => updateEstatePlan({ beneficiaryDesignations: updates })} />}
        {activeSection === 'letter' && <LetterOfIntentSection data={estatePlan.letterOfIntent} onUpdate={(updates) => updateEstatePlan({ letterOfIntent: { ...estatePlan.letterOfIntent, ...updates } })} />}
        {activeSection === 'care' && <PersonalCareSection data={estatePlan.personalCareNeeds} onUpdate={(updates) => updateEstatePlan({ personalCareNeeds: { ...estatePlan.personalCareNeeds, ...updates } })} />}
        {activeSection === 'legal' && <LegalAdvocacySection data={estatePlan.legalAdvocacy} onUpdate={(updates) => updateEstatePlan({ legalAdvocacy: { ...estatePlan.legalAdvocacy, ...updates } })} />}
        {activeSection === 'quality' && <QualityOfLifeSection data={estatePlan.qualityOfLife} onUpdate={(updates) => updateEstatePlan({ qualityOfLife: { ...estatePlan.qualityOfLife, ...updates } })} />}
      </div>
    </div>
  );
}

function WillSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Last Will and Testament</h2>
      <p className="text-gray-600 mb-6">
        Your will specifies how your assets will be distributed, names an executor, and can include guardianship provisions.
      </p>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.exists}
            onChange={(e) => onUpdate({ exists: e.target.checked })}
            className="w-5 h-5"
          />
          <span className="font-medium">I have a Last Will and Testament</span>
        </label>
      </div>

      {data.exists && (
        <div className="space-y-4">
          <FormField
            label="Date Created"
            name="willDateCreated"
            type="date"
            value={data.dateCreated || ''}
            onChange={(value) => onUpdate({ dateCreated: value })}
          />
          <FormField
            label="Location of Will"
            name="willLocation"
            value={data.location || ''}
            onChange={(value) => onUpdate({ location: value })}
            placeholder="e.g., Safe deposit box at First National Bank, with attorney John Smith"
            helpText="Where is the original will stored?"
          />

          <div className="border-t pt-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">Executor Information</h3>
            <p className="text-gray-600 mb-4">
              The executor manages your estate and ensures your wishes are carried out.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Executor Name"
                name="executorName"
                value={data.executor.name}
                onChange={(value) => onUpdate({ executor: { ...data.executor, name: value } })}
                required
              />
              <FormField
                label="Relationship"
                name="executorRelationship"
                value={data.executor.relationship}
                onChange={(value) => onUpdate({ executor: { ...data.executor, relationship: value } })}
                placeholder="e.g., Spouse, Child, Attorney"
              />
              <FormField
                label="Contact Information"
                name="executorContact"
                value={data.executor.contactInfo}
                onChange={(value) => onUpdate({ executor: { ...data.executor, contactInfo: value } })}
                placeholder="Phone and email"
              />
            </div>
          </div>

          {data.guardianForMinors && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-xl font-semibold mb-4">Guardian for Minor Children</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Guardian Name"
                  name="guardianName"
                  value={data.guardianForMinors.name}
                  onChange={(value) => onUpdate({ guardianForMinors: { ...data.guardianForMinors, name: value } })}
                />
                <FormField
                  label="Relationship"
                  name="guardianRelationship"
                  value={data.guardianForMinors.relationship}
                  onChange={(value) => onUpdate({ guardianForMinors: { ...data.guardianForMinors, relationship: value } })}
                />
                <FormField
                  label="Contact Information"
                  name="guardianContact"
                  value={data.guardianForMinors.contactInfo}
                  onChange={(value) => onUpdate({ guardianForMinors: { ...data.guardianForMinors, contactInfo: value } })}
                />
              </div>
            </div>
          )}

          <FormField
            label="Asset Distribution Plan"
            name="assetDistribution"
            type="textarea"
            value={data.assetDistribution}
            onChange={(value) => onUpdate({ assetDistribution: value })}
            placeholder="Describe how your assets should be distributed"
            helpText="Provide a general overview of asset distribution (specific bequests, percentages, etc.)"
          />

          <FormField
            label="Special Instructions"
            name="specialInstructions"
            type="textarea"
            value={data.specialInstructions}
            onChange={(value) => onUpdate({ specialInstructions: value })}
            placeholder="Any special instructions or considerations"
            helpText="Include any specific wishes, conditions, or instructions for your executor"
          />
        </div>
      )}
    </div>
  );
}

function TrustSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Revocable Living Trust</h2>
      <p className="text-gray-600 mb-6">
        A trust allows you to maintain control of assets during your lifetime and specify distribution without probate.
      </p>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.exists}
            onChange={(e) => onUpdate({ exists: e.target.checked })}
            className="w-5 h-5"
          />
          <span className="font-medium">I have a Trust</span>
        </label>
      </div>

      {data.exists && (
        <div className="space-y-4">
          <FormField
            label="Trust Type"
            name="trustType"
            type="select"
            value={data.type || ''}
            onChange={(value) => onUpdate({ type: value })}
            options={[
              { value: 'revocable', label: 'Revocable Living Trust' },
              { value: 'irrevocable', label: 'Irrevocable Trust' },
            ]}
          />
          <FormField
            label="Date Created"
            name="trustDateCreated"
            type="date"
            value={data.dateCreated || ''}
            onChange={(value) => onUpdate({ dateCreated: value })}
          />

          <div className="border-t pt-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">Trustee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Trustee Name"
                name="trusteeName"
                value={data.trustee.name}
                onChange={(value) => onUpdate({ trustee: { ...data.trustee, name: value } })}
                required
              />
              <FormField
                label="Relationship"
                name="trusteeRelationship"
                value={data.trustee.relationship}
                onChange={(value) => onUpdate({ trustee: { ...data.trustee, relationship: value } })}
              />
              <FormField
                label="Contact Information"
                name="trusteeContact"
                value={data.trustee.contactInfo}
                onChange={(value) => onUpdate({ trustee: { ...data.trustee, contactInfo: value } })}
              />
            </div>
          </div>

          <FormField
            label="Assets in Trust"
            name="trustAssets"
            type="textarea"
            value={data.assets}
            onChange={(value) => onUpdate({ assets: value })}
            placeholder="List the assets held in the trust"
          />

          <FormField
            label="Trust Terms and Distribution"
            name="trustTerms"
            type="textarea"
            value={data.terms}
            onChange={(value) => onUpdate({ terms: value })}
            placeholder="Describe the terms of the trust and distribution instructions"
          />
        </div>
      )}
    </div>
  );
}

function PowerOfAttorneySection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Power of Attorney</h2>
      <p className="text-gray-600 mb-6">
        Grant trusted individuals authority to make decisions on your behalf if you become incapacitated.
      </p>

      {/* Financial POA */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Financial Power of Attorney</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.financial.exists}
              onChange={(e) => onUpdate({ financial: { ...data.financial, exists: e.target.checked } })}
              className="w-5 h-5"
            />
            <span className="font-medium">I have a Financial Power of Attorney</span>
          </label>
        </div>

        {data.financial.exists && (
          <div className="space-y-4 ml-6">
            <FormField
              label="Date Created"
              name="financialPoaDate"
              type="date"
              value={data.financial.dateCreated || ''}
              onChange={(value) => onUpdate({ financial: { ...data.financial, dateCreated: value } })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Agent Name"
                name="financialAgentName"
                value={data.financial.agent?.name || ''}
                onChange={(value) => onUpdate({ financial: { ...data.financial, agent: { ...data.financial.agent, name: value } } })}
              />
              <FormField
                label="Relationship"
                name="financialAgentRelationship"
                value={data.financial.agent?.relationship || ''}
                onChange={(value) => onUpdate({ financial: { ...data.financial, agent: { ...data.financial.agent, relationship: value } } })}
              />
              <FormField
                label="Contact Information"
                name="financialAgentContact"
                value={data.financial.agent?.contactInfo || ''}
                onChange={(value) => onUpdate({ financial: { ...data.financial, agent: { ...data.financial.agent, contactInfo: value } } })}
              />
            </div>
            <FormField
              label="Scope of Authority"
              name="financialScope"
              type="textarea"
              value={data.financial.scope || ''}
              onChange={(value) => onUpdate({ financial: { ...data.financial, scope: value } })}
              placeholder="Describe the scope of financial decisions your agent can make"
            />
          </div>
        )}
      </div>

      {/* Healthcare POA */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Healthcare Power of Attorney</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.healthcare.exists}
              onChange={(e) => onUpdate({ healthcare: { ...data.healthcare, exists: e.target.checked } })}
              className="w-5 h-5"
            />
            <span className="font-medium">I have a Healthcare Power of Attorney</span>
          </label>
        </div>

        {data.healthcare.exists && (
          <div className="space-y-4 ml-6">
            <FormField
              label="Date Created"
              name="healthcarePoaDate"
              type="date"
              value={data.healthcare.dateCreated || ''}
              onChange={(value) => onUpdate({ healthcare: { ...data.healthcare, dateCreated: value } })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Agent Name"
                name="healthcareAgentName"
                value={data.healthcare.agent?.name || ''}
                onChange={(value) => onUpdate({ healthcare: { ...data.healthcare, agent: { ...data.healthcare.agent, name: value } } })}
              />
              <FormField
                label="Relationship"
                name="healthcareAgentRelationship"
                value={data.healthcare.agent?.relationship || ''}
                onChange={(value) => onUpdate({ healthcare: { ...data.healthcare, agent: { ...data.healthcare.agent, relationship: value } } })}
              />
              <FormField
                label="Contact Information"
                name="healthcareAgentContact"
                value={data.healthcare.agent?.contactInfo || ''}
                onChange={(value) => onUpdate({ healthcare: { ...data.healthcare, agent: { ...data.healthcare.agent, contactInfo: value } } })}
              />
            </div>
            <FormField
              label="Scope of Authority"
              name="healthcareScope"
              type="textarea"
              value={data.healthcare.scope || ''}
              onChange={(value) => onUpdate({ healthcare: { ...data.healthcare, scope: value } })}
              placeholder="Describe the scope of healthcare decisions your agent can make"
            />
          </div>
        )}
      </div>

      {/* Digital Assets */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Digital Asset Management</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.digitalAssets.exists}
              onChange={(e) => onUpdate({ digitalAssets: { ...data.digitalAssets, exists: e.target.checked } })}
              className="w-5 h-5"
            />
            <span className="font-medium">I have instructions for digital asset management</span>
          </label>
        </div>

        {data.digitalAssets.exists && (
          <div className="space-y-4 ml-6">
            <FormField
              label="Digital Assets Instructions"
              name="digitalInstructions"
              type="textarea"
              value={data.digitalAssets.instructions || ''}
              onChange={(value) => onUpdate({ digitalAssets: { ...data.digitalAssets, instructions: value } })}
              placeholder="Instructions for accessing and managing digital assets"
            />
            <FormField
              label="Accounts List"
              name="digitalAccounts"
              type="textarea"
              value={data.digitalAssets.accounts || ''}
              onChange={(value) => onUpdate({ digitalAssets: { ...data.digitalAssets, accounts: value } })}
              placeholder="List of digital accounts (social media, email, cloud storage, crypto, etc.)"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function HealthcareDirectivesSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Healthcare Directives & Living Will</h2>
      <p className="text-gray-600 mb-6">
        Document your medical treatment preferences and end-of-life care wishes.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Living Will</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.livingWill.exists}
              onChange={(e) => onUpdate({ livingWill: { ...data.livingWill, exists: e.target.checked } })}
              className="w-5 h-5"
            />
            <span className="font-medium">I have a Living Will</span>
          </label>
        </div>

        {data.livingWill.exists && (
          <div className="space-y-4 ml-6">
            <FormField
              label="Date Created"
              name="livingWillDate"
              type="date"
              value={data.livingWill.dateCreated || ''}
              onChange={(value) => onUpdate({ livingWill: { ...data.livingWill, dateCreated: value } })}
            />
            <FormField
              label="Life-Sustaining Treatment"
              name="lifeSustaining"
              type="select"
              value={data.livingWill.lifeSustaining}
              onChange={(value) => onUpdate({ livingWill: { ...data.livingWill, lifeSustaining: value } })}
              options={[
                { value: 'yes', label: 'Yes, I want all life-sustaining measures' },
                { value: 'no', label: 'No, I do not want life-sustaining measures' },
                { value: 'conditional', label: 'Conditional (depends on circumstances)' },
              ]}
            />
            <FormField
              label="Organ Donation"
              name="organDonation"
              type="select"
              value={data.livingWill.organDonation}
              onChange={(value) => onUpdate({ livingWill: { ...data.livingWill, organDonation: value } })}
              options={[
                { value: 'yes', label: 'Yes, I wish to donate organs' },
                { value: 'no', label: 'No organ donation' },
              ]}
            />
            <FormField
              label="Healthcare Preferences"
              name="preferences"
              type="textarea"
              value={data.livingWill.preferences}
              onChange={(value) => onUpdate({ livingWill: { ...data.livingWill, preferences: value } })}
              placeholder="Describe your healthcare preferences and end-of-life wishes"
            />
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Do Not Resuscitate (DNR) Order</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.dnr.exists}
              onChange={(e) => onUpdate({ dnr: { ...data.dnr, exists: e.target.checked } })}
              className="w-5 h-5"
            />
            <span className="font-medium">I have a DNR order</span>
          </label>
        </div>

        {data.dnr.exists && (
          <div className="ml-6">
            <FormField
              label="Location of DNR"
              name="dnrLocation"
              value={data.dnr.location || ''}
              onChange={(value) => onUpdate({ dnr: { ...data.dnr, location: value } })}
              placeholder="Where is the DNR document stored?"
            />
          </div>
        )}
      </div>

      <FormField
        label="Additional Advance Directives"
        name="advanceDirectives"
        type="textarea"
        value={data.advanceDirectives}
        onChange={(value) => onUpdate({ advanceDirectives: value })}
        placeholder="Any additional healthcare directives or instructions"
      />
    </div>
  );
}

// Simplified sections for remaining components
function BeneficiariesSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Beneficiary Designations</h2>
      <p className="text-gray-600 mb-6">
        Track beneficiary designations for insurance, retirement, and financial accounts. These override your will.
      </p>
      <div className="text-center py-12 text-gray-500">
        List all accounts with beneficiary designations: life insurance, retirement accounts, investment accounts, bank accounts with POD/TOD.
      </div>
    </div>
  );
}

function LetterOfIntentSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Letter of Intent</h2>
      <p className="text-gray-600 mb-6">
        A non-legal document to guide your family with personal wishes and instructions.
      </p>
      <div className="space-y-4">
        <FormField
          label="Funeral Wishes"
          name="funeralWishes"
          type="textarea"
          value={data.funeralWishes}
          onChange={(value) => onUpdate({ funeralWishes: value })}
          placeholder="Describe your funeral preferences"
        />
        <FormField
          label="Burial/Cremation Preferences"
          name="burialPreferences"
          type="textarea"
          value={data.burialPreferences}
          onChange={(value) => onUpdate({ burialPreferences: value })}
          placeholder="Your wishes for burial or cremation"
        />
        <FormField
          label="Personal Item Distribution"
          name="personalItemDistribution"
          type="textarea"
          value={data.personalItemDistribution}
          onChange={(value) => onUpdate({ personalItemDistribution: value })}
          placeholder="Specific items you want to go to specific people"
        />
        <FormField
          label="Special Instructions"
          name="specialInstructions"
          type="textarea"
          value={data.specialInstructions}
          onChange={(value) => onUpdate({ specialInstructions: value })}
          placeholder="Any other special instructions for your family"
        />
        <FormField
          label="Messages to Loved Ones"
          name="messages"
          type="textarea"
          value={data.messages}
          onChange={(value) => onUpdate({ messages: value })}
          placeholder="Personal messages you want to leave"
        />
      </div>
    </div>
  );
}

function PersonalCareSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Personal Care and Support Needs</h2>
      <p className="text-gray-600 mb-6">
        Plan for assistance with daily living activities and personal care needs.
      </p>
      <div className="space-y-4">
        <FormField
          label="Daily Living Assistance"
          name="dailyLivingAssistance"
          type="textarea"
          value={data.dailyLivingAssistance}
          onChange={(value) => onUpdate({ dailyLivingAssistance: value })}
          placeholder="Assistance needed with daily activities"
        />
        <FormField
          label="Medical Equipment Needs"
          name="medicalEquipment"
          type="textarea"
          value={data.medicalEquipment}
          onChange={(value) => onUpdate({ medicalEquipment: value })}
        />
        <FormField
          label="Home Modifications"
          name="homeModifications"
          type="textarea"
          value={data.homeModifications}
          onChange={(value) => onUpdate({ homeModifications: value })}
        />
        <FormField
          label="Caregiver Information"
          name="caregiverInfo"
          type="textarea"
          value={data.caregiverInfo}
          onChange={(value) => onUpdate({ caregiverInfo: value })}
        />
      </div>
    </div>
  );
}

function LegalAdvocacySection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Legal and Advocacy Considerations</h2>
      <p className="text-gray-600 mb-6">
        Document legal protections, disability benefits, and advocacy arrangements.
      </p>
      <div className="space-y-4">
        <FormField
          label="Guardianship Information"
          name="guardianshipInfo"
          type="textarea"
          value={data.guardianshipInfo}
          onChange={(value) => onUpdate({ guardianshipInfo: value })}
        />
        <FormField
          label="Disability Benefits"
          name="disabilityBenefits"
          type="textarea"
          value={data.disabilityBenefits}
          onChange={(value) => onUpdate({ disabilityBenefits: value })}
        />
        <FormField
          label="Legal Protections"
          name="legalProtections"
          type="textarea"
          value={data.legalProtections}
          onChange={(value) => onUpdate({ legalProtections: value })}
        />
        <FormField
          label="Advocate Information"
          name="advocateInfo"
          type="textarea"
          value={data.advocateInfo}
          onChange={(value) => onUpdate({ advocateInfo: value })}
        />
      </div>
    </div>
  );
}

function QualityOfLifeSection({ data, onUpdate }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Quality of Life and Mobility</h2>
      <p className="text-gray-600 mb-6">
        Plan for transportation, home accessibility, and resources to enhance independence.
      </p>
      <div className="space-y-4">
        <FormField
          label="Transportation Needs"
          name="transportationNeeds"
          type="textarea"
          value={data.transportationNeeds}
          onChange={(value) => onUpdate({ transportationNeeds: value })}
        />
        <FormField
          label="Mobility Aids"
          name="mobilityAids"
          type="textarea"
          value={data.mobilityAids}
          onChange={(value) => onUpdate({ mobilityAids: value })}
        />
        <FormField
          label="Home Accessibility"
          name="homeAccessibility"
          type="textarea"
          value={data.homeAccessibility}
          onChange={(value) => onUpdate({ homeAccessibility: value })}
        />
        <FormField
          label="Community Resources"
          name="communityResources"
          type="textarea"
          value={data.communityResources}
          onChange={(value) => onUpdate({ communityResources: value })}
        />
      </div>
    </div>
  );
}
