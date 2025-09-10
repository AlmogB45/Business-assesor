import React, { useState } from 'react';
import QuestionnaireForm from './components/QuestionnaireForm';
import ReportDisplay from './components/ReportDisplay';
import { BusinessInput, ReportResponse } from './types';
import { generateReport } from './api';

function App() {
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: BusinessInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateReport(formData);
      setReportData(response);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('שגיאה ביצירת הדוח. אנא בדקו שהשרת פועל ונסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setReportData(null);
    setError(null);
  };

  return (
    <div className="container">
      <h1>מערכת הערכת רישוי עסקים</h1>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <h3>מכין דוח מותאם אישית...</h3>
          <p>אנא המתינו, זה עלול לקחת כמה רגעים.</p>
        </div>
      )}

      {!reportData && !loading && (
        <QuestionnaireForm onSubmit={handleFormSubmit} loading={loading} />
      )}

      {reportData && !loading && (
        <ReportDisplay reportData={reportData} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;


