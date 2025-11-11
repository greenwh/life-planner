import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FormField } from '../components/FormField';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { generateId } from '../lib/utils';
import type { ActionStep } from '../types';

export function NextOfKinPlan() {
  const { appData, updateNextOfKinPlan } = useStore();

  if (!appData) return <div>Loading...</div>;

  const { nextOfKinPlan } = appData;
  const { actionSteps } = nextOfKinPlan;

  const sortedSteps = [...actionSteps].sort((a, b) => a.order - b.order);

  const addStep = () => {
    const newStep: ActionStep = {
      id: generateId(),
      order: actionSteps.length + 1,
      title: '',
      description: '',
      organization: '',
      contactInfo: {
        phone: '',
        address: '',
        url: '',
        email: '',
      },
      documents: '',
      notes: '',
    };
    updateNextOfKinPlan({ actionSteps: [...actionSteps, newStep] });
  };

  const updateStep = (id: string, updates: Partial<ActionStep>) => {
    updateNextOfKinPlan({
      actionSteps: actionSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    });
  };

  const deleteStep = (id: string) => {
    const filtered = actionSteps.filter((step) => step.id !== id);
    // Reorder remaining steps
    const reordered = filtered.map((step, index) => ({ ...step, order: index + 1 }));
    updateNextOfKinPlan({ actionSteps: reordered });
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedSteps.findIndex((step) => step.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...sortedSteps];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];

    // Update order numbers
    const updated = reordered.map((step, index) => ({ ...step, order: index + 1 }));
    updateNextOfKinPlan({ actionSteps: updated });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Next of Kin Action Plan</h1>
        <p className="text-lg text-gray-600">
          Create a step-by-step guide for your loved ones to follow in the event of your death. Include
          contact information for all relevant organizations and agencies.
        </p>
      </div>

      <div className="section-card mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 What to Include</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Contact retiree services or employer HR department</li>
            <li>Notify Social Security Administration</li>
            <li>Contact life insurance companies</li>
            <li>Notify banks and financial institutions</li>
            <li>Contact mortgage company or landlord</li>
            <li>Notify utilities and service providers</li>
            <li>Contact attorney or executor</li>
            <li>Arrange funeral services</li>
            <li>File death certificate</li>
          </ul>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Action Steps</h2>
          <button onClick={addStep} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add Step
          </button>
        </div>

        {sortedSteps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No action steps added yet.</p>
            <button onClick={addStep} className="btn-primary">
              Add Your First Step
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedSteps.map((step, index) => (
              <div key={step.id} className="bg-white border-2 border-gray-300 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {step.order}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {step.title || `Step ${step.order}`}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp size={20} />
                    </button>
                    <button
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === sortedSteps.length - 1}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown size={20} />
                    </button>
                    <button
                      onClick={() => deleteStep(step.id)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Step Title"
                    name={`step-title-${step.id}`}
                    value={step.title}
                    onChange={(value) => updateStep(step.id, { title: value as string })}
                    placeholder="e.g., Contact Social Security Administration"
                    required
                  />

                  <FormField
                    label="Description"
                    name={`step-description-${step.id}`}
                    type="textarea"
                    value={step.description}
                    onChange={(value) => updateStep(step.id, { description: value as string })}
                    placeholder="What needs to be done in this step?"
                    helpText="Provide clear instructions for your next of kin"
                  />

                  <FormField
                    label="Organization/Agency"
                    name={`step-organization-${step.id}`}
                    value={step.organization}
                    onChange={(value) => updateStep(step.id, { organization: value as string })}
                    placeholder="Name of the organization to contact"
                  />

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Phone Number"
                        name={`step-phone-${step.id}`}
                        type="tel"
                        value={step.contactInfo.phone || ''}
                        onChange={(value) =>
                          updateStep(step.id, {
                            contactInfo: { ...step.contactInfo, phone: value as string },
                          })
                        }
                        placeholder="1-800-555-1234"
                      />
                      <FormField
                        label="Email"
                        name={`step-email-${step.id}`}
                        type="email"
                        value={step.contactInfo.email || ''}
                        onChange={(value) =>
                          updateStep(step.id, {
                            contactInfo: { ...step.contactInfo, email: value as string },
                          })
                        }
                      />
                      <FormField
                        label="Website URL"
                        name={`step-url-${step.id}`}
                        value={step.contactInfo.url || ''}
                        onChange={(value) =>
                          updateStep(step.id, {
                            contactInfo: { ...step.contactInfo, url: value as string },
                          })
                        }
                        placeholder="https://..."
                      />
                      <FormField
                        label="Mailing Address"
                        name={`step-address-${step.id}`}
                        value={step.contactInfo.address || ''}
                        onChange={(value) =>
                          updateStep(step.id, {
                            contactInfo: { ...step.contactInfo, address: value as string },
                          })
                        }
                      />
                    </div>
                  </div>

                  <FormField
                    label="Required Documents"
                    name={`step-documents-${step.id}`}
                    type="textarea"
                    value={step.documents || ''}
                    onChange={(value) => updateStep(step.id, { documents: value as string })}
                    placeholder="List any documents needed for this step (e.g., death certificate, account numbers)"
                  />

                  <FormField
                    label="Additional Notes"
                    name={`step-notes-${step.id}`}
                    type="textarea"
                    value={step.notes || ''}
                    onChange={(value) => updateStep(step.id, { notes: value as string })}
                    placeholder="Any other important information"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-card bg-yellow-50 border-yellow-200">
        <h3 className="text-xl font-semibold mb-3">📌 Important Reminders</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Keep this list updated with current contact information</li>
          <li>Inform your executor or trusted family member where to find this document</li>
          <li>Review and update annually or when circumstances change</li>
          <li>Consider including account numbers (store securely) or where to find them</li>
          <li>Arrange these steps in the order they should be completed</li>
        </ul>
      </div>
    </div>
  );
}
