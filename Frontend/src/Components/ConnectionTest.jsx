import { useState } from 'react';
import { adminAPI } from '../services/api';

const ConnectionTest = () => {
  const [setStatus] = useState('');
  const [setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.testConnection();
      setStatus(`✅ ${response.data}`);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    }
    setLoading(false);
  };

  // return (
  //   <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
  //     <h3>Backend Connection Test</h3>
  //     <button onClick={testConnection} disabled={loading}>
  //       {loading ? 'Testing...' : 'Test Connection'}
  //     </button>
  //     {status && <p>{status}</p>}
  //   </div>
  // );
};

export default ConnectionTest;