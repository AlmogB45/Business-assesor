# Requirements Matching Algorithm

## Overview

The Business Licensing Assessor uses a rule-based matching algorithm to filter licensing requirements based on business characteristics. The algorithm takes business input parameters and returns only the requirements that apply to that specific business.

## Algorithm Flow

```
1. Input Validation
   ↓
2. Auto-inference of derived properties
   ↓
3. Requirement Filtering
   ↓
4. Result Return
```

## Input Parameters

The algorithm accepts the following business characteristics:

- `area_m2` (number): Business area in square meters
- `seats` (number): Number of seating places
- `gas` (boolean): Whether the business uses gas
- `serves_meat` (boolean): Whether the business serves meat
- `deliveries` (boolean): Whether the business provides delivery services

## Auto-inference Rules

### serves_food

If `serves_meat` is `true`, then `serves_food` is automatically set to `true`. This logical inference prevents users from having to explicitly state they serve food when they already indicated they serve meat.

```typescript
const input = {
  ...businessInput,
  serves_food: businessInput.serves_meat || businessInput.serves_food || false
};
```

## Matching Criteria

Each requirement has an `applies_if` object that defines when the requirement applies. The algorithm checks each criterion:

### Numeric Range Criteria

For `area_m2` and `seats`:
- `min`: Requirement applies if business value >= minimum
- `max`: Requirement applies if business value <= maximum
- Both can be specified for range requirements

```typescript
// Example: Fire safety required for businesses >= 50 m²
if (criteria.area_m2) {
  if (criteria.area_m2.min && input.area_m2 < criteria.area_m2.min) return false;
  if (criteria.area_m2.max && input.area_m2 > criteria.area_m2.max) return false;
}
```

### Boolean Criteria

For `gas`, `serves_meat`, `serves_food`, `deliveries`:
- Exact match required: business boolean must equal requirement boolean
- `undefined` criteria are ignored (requirement applies regardless)

```typescript
// Example: Gas permit required only if business uses gas
if (criteria.gas !== undefined && input.gas !== criteria.gas) return false;
```

## Filtering Logic

The algorithm uses an **AND** logic for multiple criteria:
- ALL specified criteria must be satisfied for a requirement to match
- If ANY criterion fails, the requirement is excluded

### Example Scenarios

#### Basic Business License
```json
{
  "applies_if": {
    "area_m2": { "min": 1 }
  }
}
```
**Result**: Applies to any business with area >= 1 m² (essentially all businesses)

#### Large Kitchen Approval
```json
{
  "applies_if": {
    "area_m2": { "min": 100 },
    "serves_food": true
  }
}
```
**Result**: Applies only to food-serving businesses with area >= 100 m²

#### Delivery Permit
```json
{
  "applies_if": {
    "deliveries": true
  }
}
```
**Result**: Applies only to businesses that provide delivery services

## Implementation Details

### Function Signature
```typescript
export function matchRequirements(
  businessInput: BusinessInput,
  allRequirements: Requirement[]
): Requirement[]
```

### Processing Steps

1. **Input Enhancement**: Add auto-inferred properties
2. **Requirement Iteration**: Check each requirement against input
3. **Criteria Validation**: Apply all matching rules
4. **Result Collection**: Return array of matching requirements

### Performance Characteristics

- **Time Complexity**: O(n × m) where n = number of requirements, m = average criteria per requirement
- **Space Complexity**: O(k) where k = number of matching requirements
- **Typical Performance**: Sub-millisecond for ~20-50 requirements

## Business Rules

### Requirement Levels

Requirements are categorized by importance:
- **mandatory**: Must be fulfilled to operate legally
- **recommended**: Should be considered for best practices
- **optional**: May provide additional benefits

### Authority Mapping

Each requirement specifies the issuing authority:
- `רשות מקומית` (Local Authority)
- `משרד הבריאות` (Ministry of Health)
- `משרד העבודה והרווחה` (Ministry of Labor and Welfare)
- `רשות כיבוי והצלה` (Fire and Rescue Authority)
- etc.

## Edge Cases and Considerations

### Zero Values
- `area_m2 = 0`: Invalid input, should be > 0
- `seats = 0`: Valid (takeaway-only business)

### Contradictory Inputs
- `serves_meat = true, serves_food = false`: Auto-corrected to `serves_food = true`

### Missing Criteria
- Requirements with empty `applies_if` object apply to all businesses
- Undefined criteria fields are ignored (don't filter)

## Future Enhancements

### Conditional Logic
Add support for OR conditions:
```json
{
  "applies_if": {
    "or": [
      { "area_m2": { "min": 100 } },
      { "seats": { "min": 50 } }
    ]
  }
}
```

### Geographic Filtering
Add location-based requirements:
```json
{
  "applies_if": {
    "city": "תל אביב",
    "area_m2": { "min": 30 }
  }
}
```

### Time-based Requirements
Add seasonal or temporary requirements:
```json
{
  "applies_if": {
    "outdoor_seating": true,
    "valid_from": "2024-04-01",
    "valid_until": "2024-10-31"
  }
}
```

## Testing Strategy

### Unit Tests
- Test each criterion type individually
- Test combination of criteria
- Test edge cases and invalid inputs

### Integration Tests
- Test with real requirement datasets
- Verify auto-inference logic
- Test performance with large datasets

### Example Test Cases
```typescript
// Large restaurant with gas and deliveries
const input = { area_m2: 120, seats: 60, gas: true, serves_meat: true, deliveries: true };
// Should match: basic license, food license, gas permit, fire safety, 
//              large establishment, meat handling, delivery permit, etc.

// Small takeaway
const input = { area_m2: 25, seats: 0, gas: false, serves_meat: false, deliveries: true };
// Should match: basic license, delivery permit, accessibility (if area >= 30)
```

---

*This document describes the core matching algorithm. For API usage, see [API.md](API.md). For data structures, see [DATA_SCHEMA.md](DATA_SCHEMA.md).*
