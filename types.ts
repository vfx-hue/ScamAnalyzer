
export type AnalysisTab = 'sms' | 'email' | 'voicemail' | 'phone';
export type Page = 'home' | 'privacy' | 'terms' | 'contact';

export interface AnalysisResult {
  riskScore: number;
  summary: string;
  redFlags: string[];
  advice: string;
}
