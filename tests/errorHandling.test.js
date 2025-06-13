// tests/errorHandling.test.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const JWT_TOKEN = 'your-test-jwt-token-here'; // Replace with a valid token

async function testEndpoint(title, url, expectSuccess = false) {
  console.log(`\n--- Testing ${title} ---`);
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`
      }
    });
    
    console.log('Success:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (!expectSuccess) {
      console.log('⚠️ This should have failed but succeeded!');
    }
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
      
      if (expectSuccess) {
        console.log('⚠️ This should have succeeded but failed!');
      }
    } else {
      console.log('Network Error:', error.message);
    }
  }
}

async function runTests() {
  // Test various error scenarios
  await testEndpoint('Sync Error', '/test/sync-error');
  await testEndpoint('Async Error', '/test/async-error');
  await testEndpoint('Database Validation', '/test/db-validation');
  await testEndpoint('Not Found Error', '/test/not-found');
  await testEndpoint('Bad Request Error', '/test/bad-request');
  
  // Test regular endpoints
  await testEndpoint('Get All Movies', '/movies', true);
  
  // Test invalid ID
  await testEndpoint('Invalid Movie ID', '/movies/invalid-id');
  
  // Test non-existent movie
  await testEndpoint('Non-existent Movie', '/movies/60a12345b789c123456789ab');
}

runTests().catch(console.error);