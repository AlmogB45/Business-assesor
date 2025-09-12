import React from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportResponse } from '../types';

interface ReportDisplayProps {
  reportData: ReportResponse;
  onBack: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportData, onBack }) => {
  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('דוח-רישוי-עסק.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('שגיאה ביצירת קובץ PDF');
    }
  };

  return (
    <div className="report-container">
      <div className="report-actions">
        <button className="btn-secondary" onClick={onBack}>
          חזור לשאלון
        </button>
        <button className="btn-secondary" onClick={downloadPDF}>
          הורד כ-PDF
        </button>
      </div>
      
      <div id="report-content" className="report-content">
        <ReactMarkdown>{reportData.report}</ReactMarkdown>
        
        {reportData.matched_requirements && reportData.matched_requirements.length > 0 && (
          <div className="source-references">
            <h3>מקורות ודרישות רלוונטיות</h3>
            <div className="requirements-list">
              {reportData.matched_requirements.map((req, index) => (
                <div key={req.id} className="requirement-item">
                  <h4>{req.title} ({req.level === 'mandatory' ? 'חובה' : req.level === 'recommended' ? 'מומלץ' : 'אופציונלי'})</h4>
                  <p><strong>תיאור:</strong> {req.summary}</p>
                  <p><strong>רשות:</strong> {req.authority}</p>
                  <p><strong>מקור:</strong> <code>{req.source_ref}</code></p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="report-actions">
        <button className="btn-secondary" onClick={onBack}>
          חזור לשאלון
        </button>
        <button className="btn-secondary" onClick={downloadPDF}>
          הורד כ-PDF
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;


