import { BusinessInput, Requirement } from './types';

export function matchRequirements(
  businessInput: BusinessInput,
  allRequirements: Requirement[]
): Requirement[] {
  // Auto-infer serves_food if serves_meat is true
  const input = {
    ...businessInput,
    serves_food: businessInput.serves_meat || businessInput.serves_food || false
  };

  return allRequirements.filter(req => {
    const criteria = req.applies_if;
    
    // Check area_m2 criteria
    if (criteria.area_m2) {
      if (criteria.area_m2.min && input.area_m2 < criteria.area_m2.min) return false;
      if (criteria.area_m2.max && input.area_m2 > criteria.area_m2.max) return false;
    }
    
    // Check seats criteria
    if (criteria.seats) {
      if (criteria.seats.min && input.seats < criteria.seats.min) return false;
      if (criteria.seats.max && input.seats > criteria.seats.max) return false;
    }
    
    // Check boolean criteria
    if (criteria.gas !== undefined && input.gas !== criteria.gas) return false;
    if (criteria.serves_meat !== undefined && input.serves_meat !== criteria.serves_meat) return false;
    if (criteria.serves_food !== undefined && input.serves_food !== criteria.serves_food) return false;
    if (criteria.deliveries !== undefined && input.deliveries !== criteria.deliveries) return false;
    
    return true;
  });
}
