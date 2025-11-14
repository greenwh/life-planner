import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppData } from '../types';

/**
 * Export data as JSON file
 */
export function exportAsJSON(data: AppData, filename = 'life-planner-backup.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * Export data as PDF
 */
export function exportAsPDF(data: AppData, filename = 'life-planner-report.pdf'): void {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.text('Life Planning Report', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Generated date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPosition, {
    align: 'center',
  });
  yPosition += 15;

  // Personal Information
  doc.setFontSize(16);
  doc.text('Personal Information', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  const personalInfo = data.financialPlan.personalInfo;
  const personalData = [
    ['Name', personalInfo.name],
    ['Age', personalInfo.age.toString()],
    ['Email', personalInfo.contactInfo.email],
    ['Phone', personalInfo.contactInfo.phone],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: personalData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Financial Summary
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text('Financial Summary', 14, yPosition);
  yPosition += 10;

  const totalIncome = data.financialPlan.income.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalExpenses = data.financialPlan.expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalAssets = data.financialPlan.assets.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalLiabilities = data.financialPlan.liabilities.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const financialData = [
    ['Total Monthly Income', `$${totalIncome.toFixed(2)}`],
    ['Total Monthly Expenses', `$${totalExpenses.toFixed(2)}`],
    ['Net Cash Flow', `$${(totalIncome - totalExpenses).toFixed(2)}`],
    ['Total Assets', `$${totalAssets.toFixed(2)}`],
    ['Total Liabilities', `$${totalLiabilities.toFixed(2)}`],
    ['Net Worth', `$${(totalAssets - totalLiabilities).toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: yPosition,
    body: financialData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Assets
  if (data.financialPlan.assets.length > 0) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Assets', 14, yPosition);
    yPosition += 8;

    const assetsData = data.financialPlan.assets.map((asset) => [
      asset.name,
      asset.type,
      `$${asset.value.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Type', 'Value']],
      body: assetsData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Estate Planning
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(16);
  doc.text('Estate Planning', 14, yPosition);
  yPosition += 10;

  const estatePlanData = [
    [
      'Last Will and Testament',
      data.estatePlan.will.exists ? 'Yes' : 'No',
      data.estatePlan.will.executor.name || 'Not specified',
    ],
    [
      'Revocable Trust',
      data.estatePlan.trust.exists ? 'Yes' : 'No',
      data.estatePlan.trust.trustee.name || 'Not specified',
    ],
    [
      'Financial Power of Attorney',
      data.estatePlan.powerOfAttorney.financial.exists ? 'Yes' : 'No',
      data.estatePlan.powerOfAttorney.financial.agent?.name || 'Not specified',
    ],
    [
      'Healthcare Power of Attorney',
      data.estatePlan.powerOfAttorney.healthcare.exists ? 'Yes' : 'No',
      data.estatePlan.powerOfAttorney.healthcare.agent?.name || 'Not specified',
    ],
    [
      'Living Will',
      data.estatePlan.healthcareDirectives.livingWill.exists ? 'Yes' : 'No',
      data.estatePlan.healthcareDirectives.livingWill.lifeSustaining,
    ],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Document', 'Status', 'Details']],
    body: estatePlanData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Next of Kin Action Plan
  if (data.nextOfKinPlan.actionSteps.length > 0) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.text('Next of Kin Action Plan', 14, yPosition);
    yPosition += 10;

    const actionStepsData = data.nextOfKinPlan.actionSteps
      .sort((a, b) => a.order - b.order)
      .map((step) => [
        step.order.toString(),
        step.title,
        step.organization,
        step.contactInfo.phone || step.contactInfo.email || 'See notes',
      ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Step', 'Action', 'Organization', 'Contact']],
      body: actionStepsData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    });
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
}

/**
 * Import data from JSON file
 */
export function importFromJSON(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate data structure
        if (!data.id || !data.financialPlan || !data.estatePlan) {
          throw new Error('Invalid data format');
        }

        resolve(data as AppData);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Helper function to download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create a backup of all data
 */
export function createBackup(data: AppData): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportAsJSON(data, `life-planner-backup-${timestamp}.json`);
}

/**
 * Generate a comprehensive report
 */
export function generateReport(data: AppData): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportAsPDF(data, `life-planner-report-${timestamp}.pdf`);
}
