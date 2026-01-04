export type Lang = 'en' | 'te';
export type InputType = 'monthly' | 'lump';

export type SchemeId = 'pli' | 'ssy' | 'ppf' | 'mis' | 'td' | 'rd';

export interface Scheme {
  id: SchemeId;
  icon: string;
  tag: string;
  tagColor: string;
  name: string;
  nameTe: string;
  desc: string;
  descTe: string;
  rate: number;
  min: number;
  max: number;
  step: number;
  inputType: InputType;
  docs: string[];
  docsTe: string[];
}

export interface PliTableData {
  [age: number]: {
    [maturityAge: number]: number; // Bonus per 10 Lakh (implied base unit) logic from original code seems to be raw premium base per 10L sum assured? Actually looking at logic: `base = pliTable[age][matAge]`. `gross = (base/1000000) * sum`. So the table value is Premium for 10L Sum Assured.
  }
}