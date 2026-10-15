export type Language = 'en' | 'te';

export type Scheme = {
  id: number;
  slug: string;
  name: string;
  name_te: string;
  summary: string;
  summary_te: string;
  description: string;
  description_te: string;
  category: string;
  level: string;
  states: string[];
  benefits: string[];
  benefits_te: string[];
  eligibility: string[];
  eligibility_te: string[];
  documents: string[];
  documents_te: string[];
  application_steps: string[];
  application_steps_te: string[];
  official_url: string;
  last_verified: string | null;
};

export type Match = { scheme: Scheme; score: number; reasons: string[]; reasons_te: string[] };
export type Profile = { age: number; state: string; gender: string; occupation: string; annual_income: number | null; category: string | null };
