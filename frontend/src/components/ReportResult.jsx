import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ReportResult = () => {
  const [report, setReport] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.reportData) {
      setReport(location.state.reportData);
      setSessionData(location.state.reportData.sessionData);
      setLoading(false);
    } else {
      window.location.href = '/generate-report';
    }
  }, [location]);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://assessment-management-system-backend.onrender.com/api/download-report?session_id=${sessionData.session_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const fileName = `report_${sessionData.session_id}_${Date.now()}.pdf`;
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const renderValueWithUnit = (value, unit) => {
    if (value === undefined || value === null) return 'N/A';
    return unit ? `${value} ${unit}` : value;
  };

  const renderClassification = (value, classification) => {
    if (!classification || value === undefined || value === null) return null;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    
    const matchedClass = classification.find(range => 
      numValue >= range.range[0] && numValue <= range.range[1]
    );
    
    return matchedClass ? (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
        matchedClass.status === 'Normal' ? 'bg-green-100 text-green-800' :
        matchedClass.status === 'Underweight' ? 'bg-yellow-100 text-yellow-800' :
        matchedClass.status === 'Overweight' ? 'bg-orange-100 text-orange-800' :
        'bg-red-100 text-red-800'
      }`}>
        {matchedClass.status}
      </span>
    ) : null;
  };

  const renderDataCard = (title, data, fields) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-2 h-5 bg-indigo-600 rounded-full mr-3"></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          const value = field.path.split('.').reduce((obj, key) => obj && obj[key], data);
          return value !== undefined && (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{field.label}</span>
                <span className="text-lg font-bold text-gray-900">
                  {renderValueWithUnit(value, field.unit)}
                </span>
              </div>
              {field.classification && renderClassification(value, field.classification)}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!report || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Report not found</h3>
          <p className="mt-2 text-sm text-gray-500">The requested report could not be found.</p>
          <div className="mt-6">
            <Link
              to="/generate-report"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Generate New Report
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900 font-medium"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Report</h1>
            <p className="text-lg text-gray-600">Comprehensive analysis of your assessment results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{sessionData.accuracy}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessionData.assessment_id === 'as_hr_02' ? 'Health & Fitness' : 'Cardiac'}
              </div>
              <div className="text-sm text-gray-600">Assessment Type</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(sessionData.timestamp).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Assessment Date</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <nav className="flex space-x-8 px-6">
            {['overview', 'body', 'vitals', 'exercises', 'raw-data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'body' && 'Body Composition'}
                {tab === 'vitals' && 'Vitals'}
                {tab === 'exercises' && 'Exercises'}
                {tab === 'raw-data' && 'Raw Data'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Overview</h2>
              {sessionData.bodyCompositionData && renderDataCard('Body Composition', sessionData.bodyCompositionData, [
                { label: 'BMI', path: 'BMI', unit: '', classification: [
                  { range: [0, 18.5], status: 'Underweight' },
                  { range: [18.5, 25], status: 'Normal' },
                  { range: [25, 30], status: 'Overweight' },
                  { range: [30, 100], status: 'Obese' }
                ]},
                { label: 'Body Fat %', path: 'BFC', unit: '%' },
                { label: 'Waist-to-Hip Ratio', path: 'WHR' }
              ])}

              {sessionData.vitalsMap?.vitals && renderDataCard('Vital Signs', sessionData.vitalsMap.vitals, [
                { label: 'Heart Rate', path: 'heart_rate', unit: 'bpm' },
                { label: 'Blood Pressure', path: 'bp_sys', unit: 'mmHg' },
                { label: 'Oxygen Saturation', path: 'oxy_sat_prcnt', unit: '%' },
                { label: 'Respiratory Rate', path: 'resp_rate', unit: 'breaths/min' }
              ])}
            </div>
          )}

          {activeTab === 'body' && sessionData.bodyCompositionData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Body Composition Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(sessionData.bodyCompositionData).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vitals' && sessionData.vitalsMap && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vital Signs & Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessionData.vitalsMap.vitals && Object.entries(sessionData.vitalsMap.vitals).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exercises' && sessionData.exercises && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Performance</h2>
              <div className="space-y-6">
                {sessionData.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{exercise.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Score: </span>
                        <span className="font-medium">{exercise.analysisScore || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Reps: </span>
                        <span className="font-medium">{exercise.correctReps}/{exercise.assignReps}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'raw-data' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Raw Data</h2>
              <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
                <pre className="text-sm text-green-400 whitespace-pre-wrap">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/generate-report"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Generate Another Report
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportResult;