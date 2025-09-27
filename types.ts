
export enum View {
  DASHBOARD = 'DASHBOARD',
  EMAIL_SUMMARIZER = 'EMAIL_SUMMARIZER',
  RENEWAL_REMINDER = 'RENEWAL_REMINDER',
  DOCUMENT_ANALYSIS = 'DOCUMENT_ANALYSIS',
}

export interface EmailSummary {
  summary: string[];
  category: string;
}

export interface RenewalItem {
  id: number;
  name: string;
  renewalDate: Date;
  customer: string;
}