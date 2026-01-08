// types.ts

export type InsuranceTableData = {
  [age: number]: {
    [term: number]: number;
  };
};

export type InputType = 'monthly' | 'lumpsum' | 'insurance';

/**
 * ONLY schemes supported by the app
 */
export type SchemeId = 'pli' | 'rpli';

/**
 * Language support
 */
export type Lang = 'en' | 'te';

export interface Scheme {
  id: SchemeId;
  name: string;
  nameTe?: string;
  desc: string;
  descTe?: string;
  icon?: string;
  tag?: string;
  tagColor?: string;

  // For display only (PLI/RPLI do NOT use this for calculation)
  rate: number;

  min: number;
  max: number;
  step: number;

  inputType: InputType;

  docs?: string[];
  docsTe?: string[];
}
