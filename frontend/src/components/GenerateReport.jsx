// src/components/GenerateReport.jsx (updated)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateReport = ({ user }) => {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ session_id: sessionId }),
    });  
    const data = await response.json();
    console.log("Response is:", data); 

    if (data.success) {
      // Navigate to report result page with the data
      navigate('/report-result', { 
        state: { 
          reportData: data.data,
          sessionId: sessionId
        } 
      });
    } else {
      setError(data.message || 'Failed to generate report');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate Report</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate PDF reports from assessment data using session IDs.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700">
                  Session ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="sessionId"
                    name="sessionId"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Enter session ID (e.g., session_001)"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Available session IDs: session_001 (Health & Fitness), session_002 (Cardiac)
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Generating Report...' : 'Generate Report'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Session Data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-900">session_001</h4>
                <p className="text-sm text-gray-600 mt-1">Health & Fitness Assessment (as_hr_02)</p>
                <ul className="mt-2 text-sm text-gray-500 space-y-1">
                  <li>• Body composition data</li>
                  <li>• Exercise analysis</li>
                  <li>• Vital signs</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-900">session_002</h4>
                <p className="text-sm text-gray-600 mt-1">Cardiac Assessment (as_card_01)</p>
                <ul className="mt-2 text-sm text-gray-500 space-y-1">
                  <li>• Cardiovascular metrics</li>
                  <li>• Heart rate data</li>
                  <li>• Blood pressure readings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;