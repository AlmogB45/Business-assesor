import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportResponse, Requirement } from '../types';

interface ReportDisplayProps {
  reportData: ReportResponse;
  onBack: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportData, onBack }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

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

  const toggleStepCompleted = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getRequirementsByLevel = (level: 'mandatory' | 'recommended' | 'optional') => {
    return reportData.matched_requirements?.filter(req => req.level === level) || [];
  };

  const mandatoryReqs = getRequirementsByLevel('mandatory');
  const recommendedReqs = getRequirementsByLevel('recommended');
  const optionalReqs = getRequirementsByLevel('optional');

  const getEstimatedTime = (level: string) => {
    switch (level) {
      case 'mandatory': return '2-4 שבועות';
      case 'recommended': return '1-2 שבועות';
      case 'optional': return '1-3 ימים';
      default: return 'לא ידוע';
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'mandatory': return '#e74c3c';
      case 'recommended': return '#f39c12';
      case 'optional': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'mandatory': return '🚨';
      case 'recommended': return '⚠️';
      case 'optional': return '💡';
      default: return '📋';
    }
  };

  const renderRequirementCard = (req: Requirement, index: number) => (
    <div key={req.id} className={`requirement-card ${req.level}`}>
      <div className="requirement-header">
        <div className="requirement-priority">
          <span className="priority-icon">{getPriorityIcon(req.level)}</span>
          <span className={`priority-badge ${req.level}`}>
            {req.level === 'mandatory' ? 'חובה' : req.level === 'recommended' ? 'מומלץ' : 'אופציונלי'}
          </span>
        </div>
        <div className="requirement-meta">
          <span className="estimated-time">⏱️ {getEstimatedTime(req.level)}</span>
          <span className="requirement-number">#{index + 1}</span>
        </div>
      </div>
      
      <h4 className="requirement-title">{req.title}</h4>
      
      <div className="requirement-content">
        <div className="requirement-description">
          <strong>תיאור:</strong> {req.summary}
        </div>
        
        <div className="requirement-details">
          <div className="detail-item">
            <span className="detail-label">🏛️ רשות מוציאה:</span>
            <span className="detail-value">{req.authority}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📄 מקור:</span>
            <span className="detail-value code">{req.source_ref}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const actionSteps = [
    { id: '1', text: 'התחילו בדרישות החובה - אלו נדרשות לפתיחת העסק', priority: 'high' },
    { id: '2', text: 'תכננו מראש - חלק מהרישיונות לוקחים מספר שבועות', priority: 'high' },
    { id: '3', text: 'התייעצו עם יועץ - לבדיקה מקצועית של הדרישות', priority: 'medium' },
    { id: '4', text: 'הכינו תיעוד - אספו את כל המסמכים הנדרשים מראש', priority: 'high' },
    { id: '5', text: 'בדקו דרישות ספציפיות לאזור הגיאוגרפי', priority: 'medium' },
    { id: '6', text: 'התעדכנו על שינויים רגולטוריים אחרונים', priority: 'low' }
  ];

  return (
    <div className="detailed-report-container">
      {/* Header Section */}
      <div className="report-header">
        <div className="report-title-section">
          <h1>📋 דוח רישוי עסק - מפורט ומאורגן</h1>
          <div className="report-meta">
            <span className="generation-date">נוצר ב: {new Date().toLocaleDateString('he-IL')}</span>
            <span className="requirements-count">
              {reportData.matched_requirements?.length || 0} דרישות רלוונטיות
            </span>
          </div>
        </div>
        
        <div className="report-actions">
          <button className="btn-primary" onClick={downloadPDF}>
            📄 הורד PDF
          </button>
          <button className="btn-secondary" onClick={onBack}>
            ← חזור לשאלון
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="report-navigation">
        <button 
          className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📊 סקירה כללית
        </button>
        <button 
          className={`nav-tab ${activeSection === 'requirements' ? 'active' : ''}`}
          onClick={() => setActiveSection('requirements')}
        >
          📋 דרישות מפורטות
        </button>
        <button 
          className={`nav-tab ${activeSection === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveSection('timeline')}
        >
          ⏰ לוח זמנים
        </button>
        <button 
          className={`nav-tab ${activeSection === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveSection('checklist')}
        >
          ✅ רשימת משימות
        </button>
      </div>

      {/* Main Content */}
      <div id="report-content" className="report-content">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="section-content">
            <div className="executive-summary">
              <h2>📈 תקציר מנהלים</h2>
              <div className="summary-cards">
                <div className="summary-card critical">
                  <div className="card-icon">🚨</div>
                  <div className="card-content">
                    <h3>{mandatoryReqs.length}</h3>
                    <p>דרישות חובה</p>
                    <small>נדרשות לפתיחת העסק</small>
                  </div>
                </div>
                <div className="summary-card warning">
                  <div className="card-icon">⚠️</div>
                  <div className="card-content">
                    <h3>{recommendedReqs.length}</h3>
                    <p>דרישות מומלצות</p>
                    <small>שיפור תהליכים</small>
                  </div>
                </div>
                <div className="summary-card info">
                  <div className="card-icon">💡</div>
                  <div className="card-content">
                    <h3>{optionalReqs.length}</h3>
                    <p>דרישות אופציונליות</p>
                    <small>הזדמנויות נוספות</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="business-details">
              <h2>🏢 פרטי העסק</h2>
              <div className="details-grid">
                <div className="detail-card">
                  <span className="detail-label">שטח העסק</span>
                  <span className="detail-value">{reportData.business_input.area_m2} מ"ר</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">מקומות ישיבה</span>
                  <span className="detail-value">{reportData.business_input.seats}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">שימוש בגז</span>
                  <span className="detail-value">{reportData.business_input.gas ? 'כן' : 'לא'}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">הגשת בשר</span>
                  <span className="detail-value">{reportData.business_input.serves_meat ? 'כן' : 'לא'}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">שירותי משלוחים</span>
                  <span className="detail-value">{reportData.business_input.deliveries ? 'כן' : 'לא'}</span>
                </div>
              </div>
            </div>

            <div className="ai-report-section">
              <div className="ai-report-header">
                <h2>🤖 דוח AI מפורט</h2>
                <div className="ai-report-badge">
                  <span className="badge-icon">✨</span>
                  <span className="badge-text">נוצר על ידי AI</span>
                </div>
              </div>
              
              <div className="ai-report-content">
                <div className="report-intro">
                  <div className="intro-card">
                    <div className="intro-icon">📊</div>
                    <div className="intro-text">
                      <h3>תקציר מקצועי</h3>
                      <p>דוח מקיף המותאם אישית לעסק שלכם, כולל המלצות מעשיות וצעדים ברורים</p>
                    </div>
                  </div>
                </div>
                
                <div className="ai-report-body">
                  <div className="report-content-wrapper">
                    <ReactMarkdown>{reportData.report}</ReactMarkdown>
                  </div>
                </div>
                
                <div className="ai-report-footer">
                  <div className="footer-info">
                    <div className="info-item">
                      <span className="info-icon">🎯</span>
                      <span className="info-text">מותאם אישית לעסק שלכם</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📋</span>
                      <span className="info-text">מבוסס על {reportData.matched_requirements?.length || 0} דרישות רלוונטיות</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">⚡</span>
                      <span className="info-text">נוצר בזמן אמת</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <div className="section-content">
            <div className="requirements-overview">
              <h2>📋 דרישות מפורטות לפי עדיפות</h2>
              <div className="requirements-stats">
                <div className="stat-item">
                  <span className="stat-number" style={{color: '#e74c3c'}}>{mandatoryReqs.length}</span>
                  <span className="stat-label">חובה</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" style={{color: '#f39c12'}}>{recommendedReqs.length}</span>
                  <span className="stat-label">מומלץ</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" style={{color: '#95a5a6'}}>{optionalReqs.length}</span>
                  <span className="stat-label">אופציונלי</span>
                </div>
              </div>
            </div>

            {mandatoryReqs.length > 0 && (
              <div className="requirements-group">
                <h3 className="group-title critical">🚨 דרישות חובה ({mandatoryReqs.length})</h3>
                <div className="requirements-grid">
                  {mandatoryReqs.map((req, index) => renderRequirementCard(req, index))}
                </div>
              </div>
            )}

            {recommendedReqs.length > 0 && (
              <div className="requirements-group">
                <h3 className="group-title warning">⚠️ דרישות מומלצות ({recommendedReqs.length})</h3>
                <div className="requirements-grid">
                  {recommendedReqs.map((req, index) => renderRequirementCard(req, mandatoryReqs.length + index))}
                </div>
              </div>
            )}

            {optionalReqs.length > 0 && (
              <div className="requirements-group">
                <h3 className="group-title info">💡 דרישות אופציונליות ({optionalReqs.length})</h3>
                <div className="requirements-grid">
                  {optionalReqs.map((req, index) => renderRequirementCard(req, mandatoryReqs.length + recommendedReqs.length + index))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <div className="section-content">
            <h2>⏰ לוח זמנים מומלץ</h2>
            <div className="timeline-container">
              <div className="timeline-phase">
                <div className="phase-header">
                  <span className="phase-number">1</span>
                  <h3>שלב ההכנה (שבוע 1-2)</h3>
                </div>
                <div className="phase-content">
                  <ul>
                    <li>איסוף מסמכים נדרשים</li>
                    <li>הכנת תוכנית עסקית</li>
                    <li>בחירת מיקום העסק</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-phase">
                <div className="phase-header">
                  <span className="phase-number">2</span>
                  <h3>הגשת בקשות רישוי (שבוע 3-6)</h3>
                </div>
                <div className="phase-content">
                  <ul>
                    <li>הגשת בקשות לרשויות השונות</li>
                    <li>תשלום אגרות</li>
                    <li>מעקב אחר סטטוס הבקשות</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-phase">
                <div className="phase-header">
                  <span className="phase-number">3</span>
                  <h3>בדיקות ואישורים (שבוע 7-10)</h3>
                </div>
                <div className="phase-content">
                  <ul>
                    <li>בדיקות בטיחות</li>
                    <li>בדיקות בריאות</li>
                    <li>אישור פתיחה</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checklist Section */}
        {activeSection === 'checklist' && (
          <div className="section-content">
            <h2>✅ רשימת משימות אינטראקטיבית</h2>
            <div className="checklist-container">
              {actionSteps.map((step) => (
                <div key={step.id} className={`checklist-item ${completedSteps.has(step.id) ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    id={`step-${step.id}`}
                    checked={completedSteps.has(step.id)}
                    onChange={() => toggleStepCompleted(step.id)}
                    className="checklist-checkbox"
                  />
                  <label htmlFor={`step-${step.id}`} className="checklist-label">
                    <span className={`priority-indicator ${step.priority}`}>
                      {step.priority === 'high' ? '🔴' : step.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                    {step.text}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="checklist-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(completedSteps.size / actionSteps.length) * 100}%`}}
                ></div>
              </div>
              <span className="progress-text">
                {completedSteps.size} מתוך {actionSteps.length} משימות הושלמו
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDisplay;


