export interface BusinessInput {
  area_m2: number;
  seats: number;
  gas: boolean;
  serves_meat: boolean;
  deliveries: boolean;
}

export interface Requirement {
  id: string;
  name: string;
  description: string;
  type: 'mandatory' | 'recommended' | 'optional';
  applies_if: {
    area_m2?: { min?: number; max?: number };
    seats?: { min?: number; max?: number };
    gas?: boolean;
    serves_meat?: boolean;
    serves_food?: boolean;
    deliveries?: boolean;
  };
  authority: string;
  estimated_time: string;
  cost: string;
}

export interface MatchResponse {
  matched_requirements: Requirement[];
  business_input: BusinessInput;
}

export interface ReportResponse {
  report: string;
  matched_requirements: Requirement[];
  business_input: BusinessInput;
}


