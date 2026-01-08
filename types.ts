export type Lang = 'en' | 'te';

// Fix: Extended SchemeId to include all possible schemes
export type SchemeId = 'pli' | 'rpli' | 'ssy' | 'ppf' | 'rd' | 'td' | 'mis';

export interface InsuranceTableData {
  [age: number]: {
    [maturityAge: number]: number;
  }
}

// Fix: Added missing Scheme interface
export interface Scheme {
  id: SchemeId;
  name: string;
  nameTe: string;
  desc: string;
  descTe: string;
  icon: string;
  tag: string;
  tagColor: string;
  rate: number;
  min: number;
  max: number;
  step: number;
  inputType: 'monthly' | 'lumpsum';
  docs: string[];
  docsTe: string[];
}
