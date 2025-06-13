// tests/validation.test.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let JWT_TOKEN;

async function testValidation() {
  try {
    console.log('===== Testing Validation =====');
    
    // 1. Test registration validation
    console.log('\n--- Testing Registration Validation ---');
    await testInvalidRegistration();
    
    // 2. Test login and get token
    console.log('\n--- Testing Valid Login ---');
    JWT_TOKEN = await getAuthToken();
    
    // 3. Test movie creation validation
    console.log('\n--- Testing Movie Creation Validation ---');
    await testMovieCreationValidation();
    
    // 4. Test movie update validation
    console.log('\n--- Testing Movie Update Validation ---');
    await testMovieUpdateValidation();
    
    // 5. Test query parameter validation
    console.log('\n--- Testing Query Parameter Validation ---');
    await testQueryValidation();
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

async function testInvalidRegistration() {
  try {
    // Test with invalid email
    const invalidEmailResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'not-an-email',
      password: 'Password123'
    });
    console.log('Invalid email test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with invalid password
    const invalidPasswordResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'short'
    });
    console.log('Invalid password test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
}

async function getAuthToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'Password123'
    });
    console.log('Login successful');
    return response.data.token;
  } catch (error) {
    console.log('Login failed, creating test account');
    try {
      // Create a test account if login fails
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123'
      });
      
      // Now try to login
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'Password123'
      });
      
      console.log('Login successful after creating account');
      return loginResponse.data.token;
    } catch (registerError) {
      console.error('Failed to create test account:', registerError.message);
      throw new Error('Could not get auth token');
    }
  }
}

async function testMovieCreationValidation() {
  try {
    // Test with invalid year
    const invalidYearResponse = await axios.post(`${BASE_URL}/movies`, {
      title: 'Test Movie',
      year: 1800, // Too early
      watched: true
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Invalid year test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with missing title
    const missingTitleResponse = await axios.post(`${BASE_URL}/movies`, {
      year: 2020,
      watched: true
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Missing title test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with invalid watched status
    const invalidWatchedResponse = await axios.post(`${BASE_URL}/movies`, {
      title: 'Test Movie',
      year: 2020,
      watched: 'not-a-boolean'
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Invalid watched test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
}

async function testMovieUpdateValidation() {
  // First create a valid movie to update
  let movieId;
  try {
    const createResponse = await axios.post(`${BASE_URL}/movies`, {
      title: 'Movie to Update',
      year: 2020,
      watched: false
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    
    movieId = createResponse.data.data._id;
    console.log(`Created test movie with ID: ${movieId}`);
  } catch (error) {
    console.error('Failed to create test movie:', error.message);
    return;
  }
  
  try {
    // Test with invalid year
    const invalidYearResponse = await axios.put(`${BASE_URL}/movies/${movieId}`, {
      year: 1800 // Too early
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Invalid year test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with empty update
    const emptyUpdateResponse = await axios.put(`${BASE_URL}/movies/${movieId}`, {}, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Empty update test should have failed but passed!');
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
}

async function testQueryValidation() {
  try {
    // Test with invalid year
    const invalidYearResponse = await axios.get(`${BASE_URL}/movies?year=not-a-number`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Invalid year query should have failed but passed!');
    console.log('Response:', invalidYearResponse.data);
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with invalid limit
    const invalidLimitResponse = await axios.get(`${BASE_URL}/movies?limit=thousand`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Invalid limit query should have failed but passed!');
    console.log('Response:', invalidLimitResponse.data);
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
  
  try {
    // Test with valid query
    const validQueryResponse = await axios.get(`${BASE_URL}/movies?year=2020&watched=false&sort=-year&limit=5&page=1`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log('Valid query test passed!');
    console.log(`Found ${validQueryResponse.data.count} movies matching criteria`);
  } catch (error) {
    console.log('Valid query test should have passed but failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
    }
  }
}

testValidation();