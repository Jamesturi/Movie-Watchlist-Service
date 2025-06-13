import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ApiDiagnostic = () => {
  const [testResults, setTestResults] = useState({
    publicEndpoint: { status: 'pending', message: '' },
    authEndpoint:   { status: 'pending', message: '' },
  });

  const [networkDetails, setNetworkDetails] = useState({
    baseURL: '',
    token:   '',
    headers: {},
  });

  useEffect(() => {
    // Get base URL and token for info display
    setNetworkDetails({
      baseURL: api.defaults.baseURL || 'Using proxy or relative URL',
      token:   localStorage.getItem('token') ? 'Present' : 'Not found',
      headers: {
        'Content-Type':  api.defaults.headers['Content-Type'] || 'Not set',
        Authorization:    localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token').substring(0, 10)}...`
          : 'Not set',
      },
    });
  }, []);

  const testPublicEndpoint = async () => {
    setTestResults(prev => ({
      ...prev,
      publicEndpoint: { status: 'testing', message: 'Testing...' },
    }));

    try {
      const response = await api.get('/api/test/public');
      setTestResults(prev => ({
        ...prev,
        publicEndpoint: {
          status:  'success',
          message: `Success: ${JSON.stringify(response.data)}`,
        },
      }));
    } catch (error) {
      const errorMessage = getErrorDetails(error);
      setTestResults(prev => ({
        ...prev,
        publicEndpoint: {
          status:  'error',
          message: `Error: ${errorMessage}`,
        },
      }));
    }
  };

  const testAuthEndpoint = async () => {
    setTestResults(prev => ({
      ...prev,
      authEndpoint: { status: 'testing', message: 'Testing...' },
    }));

    try {
      const response = await api.get('/api/movies');
      setTestResults(prev => ({
        ...prev,
        authEndpoint: {
          status:  'success',
          message: `Success: ${JSON.stringify(response.data).substring(0, 100)}...`,
        },
      }));
    } catch (error) {
      const errorMessage = getErrorDetails(error);
      setTestResults(prev => ({
        ...prev,
        authEndpoint: {
          status:  'error',
          message: `Error: ${errorMessage}`,
        },
      }));
    }
  };

  const getErrorDetails = error => {
    if (error.response) {
      return `${error.response.status} ${error.response.statusText}: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      return 'No response received. Possible CORS issue or server is down.';
    }
    return error.message;
  };

  const createTestToken = () => {
    localStorage.setItem('token', `test_token_for_debugging_${Date.now()}`);
    window.location.reload();
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div>
      <h2>API Connection Diagnostic</h2>

      <section className="diagnostic-section">
        <h3>Network Configuration</h3>

        <div className="detail-row">
          <strong>Base URL:</strong>
          <span>{networkDetails.baseURL}</span>
        </div>

        <div className="detail-row">
          <strong>Auth Token:</strong>
          <span>{networkDetails.token}</span>
        </div>

        <div className="detail-row">
          <strong>Headers:</strong>
          <pre>{JSON.stringify(networkDetails.headers, null, 2)}</pre>
        </div>

        <div className="button-group">
          <button onClick={createTestToken}>Create Test Token</button>
          <button onClick={clearToken}>Clear Token</button>
        </div>
      </section>

      <section>
        <h3>Test Public Endpoint</h3>
        <div className={`result ${testResults.publicEndpoint.status}`}>
          {testResults.publicEndpoint.message || 'Not tested yet'}
        </div>
        <button onClick={testPublicEndpoint}>Test Public Endpoint</button>
      </section>

      <section>
        <h3>Test Authenticated Endpoint</h3>
        <div className={`result ${testResults.authEndpoint.status}`}>
          {testResults.authEndpoint.message || 'Not tested yet'}
        </div>
        <button onClick={testAuthEndpoint}>Test Auth Endpoint</button>
      </section>
    </div>
  );
};

export default ApiDiagnostic;
