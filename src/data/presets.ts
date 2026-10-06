import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'business-proposal',
    label: 'Client Tech Proposal',
    badge: 'Proposal',
    data: {
      docType: 'Business Proposal',
      title: 'Enterprise Mobile App Modernization Proposal',
      recipient: 'Acme Global Ventures (Attn: Marcus Vance, CTO)',
      tone: 'Persuasive',
      requirements:
        'Deliver modern React Native mobile app with cloud sync, offline support, and biometrics. Project scope: 12 weeks. Budget breakdown: Milestone 1 UI/UX ($15k), Milestone 2 Core Engineering ($35k), Milestone 3 QA & Launch ($12k). Includes 90-day SLA support warranty.',
    },
  },
  {
    id: 'contract-agreement',
    label: 'Standard NDA',
    badge: 'Legal',
    data: {
      docType: 'Contract / Agreement',
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      recipient: 'Apex Logistics LLC & Beacon Technologies Inc.',
      tone: 'Legal',
      requirements:
        'Term: 2 years. Protect proprietary source code, client records, and algorithmic models. Include standard exceptions (public domain, prior knowledge). Jurisdiction: State of Delaware. Mutual non-solicitation clause for 12 months.',
    },
  },
  {
    id: 'official-letter',
    label: 'Executive Offer Letter',
    badge: 'Letter',
    data: {
      docType: 'Official Letter',
      title: 'Formal Employment Offer - Senior Staff Engineer',
      recipient: 'Elena Rostova, M.Sc. Computer Science',
      tone: 'Formal & Professional',
      requirements:
        'Position: Senior Staff Engineer reporting to VP Engineering. Base salary: $185,000/year. Equity: 40,000 RSUs over 4-year vesting. Benefits: Health, 401(k) 5% match, unlimited PTO. Start date: November 1st, 2026. Acceptance deadline: 7 business days.',
    },
  },
  {
    id: 'meeting-minutes',
    label: 'Product Sprint Minutes',
    badge: 'Minutes',
    data: {
      docType: 'Meeting Minutes',
      title: 'Executive Product Steering Committee - Q4 Review',
      recipient: 'Product & Engineering Leadership Team',
      tone: 'Formal & Professional',
      requirements:
        'Attendees: Sarah Jenkins (CPO), David Chen (VP Eng), Amanda Cole (Lead PM). Key topics discussed: Mobile v2 release date shifted to Nov 15; Payment gateway migration 80% complete; Cloud latency optimization reduced p99 to 110ms. Action items assigned to David (load testing by Oct 20) and Amanda (client release notes by Oct 25).',
    },
  },
  {
    id: 'invoice-quote',
    label: 'Design & Dev Invoice',
    badge: 'Invoice',
    data: {
      docType: 'Invoice / Quote Overview',
      title: 'Professional Services Invoice #INV-2026-089',
      recipient: 'Horizon Media Partners (Attn: Finance Dept)',
      tone: 'Formal & Professional',
      requirements:
        'Invoice Date: Oct 6, 2026. Due Date: Net 30 (Nov 5, 2026). Line items: UI/UX Redesign System (40 hrs @ $150/hr = $6,000), API Integration (35 hrs @ $160/hr = $5,600), Cloud Deployment & Setup (Fixed $1,800). Total: $13,400. Wire transfer instructions included.',
    },
  },
  {
    id: 'exec-summary',
    label: 'Q3 Financial Summary',
    badge: 'Report',
    data: {
      docType: 'Report & Executive Summary',
      title: 'Q3 Corporate Performance & Growth Executive Summary',
      recipient: 'Board of Directors & Senior Investors',
      tone: 'Formal & Professional',
      requirements:
        'Revenue grew 28% YoY to $4.2M. Gross margins improved from 68% to 74% due to infrastructure optimizations. CAC dropped 14% to $210 while LTV expanded to $1,850. Key risks: EMEA market expansion regulatory compliance. Recommendations: Accelerate hiring in enterprise sales.',
    },
  },
];
