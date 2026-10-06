export type DocumentType =
  | 'Business Proposal'
  | 'Official Letter'
  | 'Contract / Agreement'
  | 'Report & Executive Summary'
  | 'Invoice / Quote Overview'
  | 'Meeting Minutes'
  | 'Custom';

export type DocumentTone =
  | 'Formal & Professional'
  | 'Persuasive'
  | 'Legal'
  | 'Casual';

export interface DocumentFormData {
  docType: DocumentType;
  title: string;
  recipient: string;
  requirements: string;
  tone: DocumentTone;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  docType: DocumentType;
  tone: DocumentTone;
  recipient: string;
  requirements: string;
  content: string;
  createdAt: string;
}

export interface PresetTemplate {
  id: string;
  label: string;
  badge: string;
  data: DocumentFormData;
}
