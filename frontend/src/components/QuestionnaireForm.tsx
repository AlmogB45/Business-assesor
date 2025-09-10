import React, { useState } from 'react';
import { BusinessInput } from '../types';

interface QuestionnaireFormProps {
  onSubmit: (data: BusinessInput) => void;
  loading: boolean;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<BusinessInput>({
    area_m2: 0,
    seats: 0,
    gas: false,
    serves_meat: false,
    deliveries: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof BusinessInput, value: number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="form-container">
      <h2>שאלון הערכת רישוי עסק</h2>
      <p>אנא מלאו את הפרטים הבאים כדי לקבל הערכה מותאמת לצרכי העסק שלכם:</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="area_m2">שטח העסק (מ"ר):</label>
          <input
            type="number"
            id="area_m2"
            min="1"
            value={formData.area_m2 || ''}
            onChange={(e) => handleInputChange('area_m2', parseInt(e.target.value) || 0)}
            required
            placeholder="הכניסו את השטח במטרים רבועים"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seats">מספר מקומות ישיבה:</label>
          <input
            type="number"
            id="seats"
            min="0"
            value={formData.seats || ''}
            onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 0)}
            required
            placeholder="מספר מקומות ישיבה ללקוחות"
          />
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="gas"
              checked={formData.gas}
              onChange={(e) => handleInputChange('gas', e.target.checked)}
            />
            <label htmlFor="gas">האם יש שימוש בגז בעסק?</label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="serves_meat"
              checked={formData.serves_meat}
              onChange={(e) => handleInputChange('serves_meat', e.target.checked)}
            />
            <label htmlFor="serves_meat">האם העסק מגיש בשר?</label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="deliveries"
              checked={formData.deliveries}
              onChange={(e) => handleInputChange('deliveries', e.target.checked)}
            />
            <label htmlFor="deliveries">האם העסק מציע שירותי משלוחים?</label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading || formData.area_m2 <= 0}
        >
          {loading ? 'מכין דוח...' : 'קבל דוח רישוי'}
        </button>
      </form>
    </div>
  );
};

export default QuestionnaireForm;


