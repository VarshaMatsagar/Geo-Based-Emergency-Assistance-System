import React, { useState } from 'react';
import { Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const ConnectionTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      await axios.get('https://localhost:7075/api/Test');
      setStatus('✅ Backend connection successful!');
    } catch (error) {
      console.error('Connection error:', error);
      if (error.code === 'ERR_NETWORK') {
        setStatus('❌ Cannot connect to backend. Make sure backend is running on https://localhost:7075');
      } else {
        setStatus(`❌ Connection error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h6>Backend Connection Test</h6>
        <Button 
          variant="info" 
          size="sm" 
          onClick={testConnection}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </Button>
        {status && (
          <Alert variant={status.includes('✅') ? 'success' : 'danger'} className="mt-2 mb-0">
            {status}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ConnectionTest;