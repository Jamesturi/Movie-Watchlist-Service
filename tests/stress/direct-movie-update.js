const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const NUM_REQUESTS = 1000;
const CONCURRENT_BATCHES = 10;
const REQUESTS_PER_BATCH = NUM_REQUESTS / CONCURRENT_BATCHES;
let JWT_TOKEN;
let TEST_MOVIE_ID;

// Metrics
const metrics = {
  successful: 0,
  failed: 0,
  conflicted: 0,
  notFound: 0,
  serverError: 0,
  startTime: null,
  endTime: null,
  responseTimes: []
};

// Setup and execute tests
async function runTests() {
  console.log(`Starting stress test: ${NUM_REQUESTS} update requests (${CONCURRENT_BATCHES} batches of ${REQUESTS_PER_BATCH})`);
  
  try {
    // Login to get JWT token
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    JWT_TOKEN = loginResponse.data.token;
    
    // Create a test movie
    const createMovieResponse = await axios.post(`${BASE_URL}/api/movies`, {
      title: 'Stress Test Movie',
      year: 2023,
      watched: false
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    
    TEST_MOVIE_ID = createMovieResponse.data.data._id;
    
    // Start timing
    metrics.startTime = Date.now();
    
    // Run batches of concurrent requests
    const batches = [];
    for (let i = 0; i < CONCURRENT_BATCHES; i++) {
      batches.push(runBatch(i));
    }
    
    await Promise.all(batches);
    
    // End timing
    metrics.endTime = Date.now();
    
    // Print results
    printResults();
    
    // Clean up - delete test movie
    await axios.delete(`${BASE_URL}/api/movies/${TEST_MOVIE_ID}`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    
  } catch (error) {
    console.error('Test setup failed:', error.message);
  }
}

async function runBatch(batchId) {
  const requests = [];
  for (let i = 0; i < REQUESTS_PER_BATCH; i++) {
    const requestId = batchId * REQUESTS_PER_BATCH + i;
    requests.push(updateMovie(requestId));
  }
  
  return Promise.all(requests);
}

async function updateMovie(requestId) {
  const startRequestTime = Date.now();
  
  try {
    const response = await axios.put(`${BASE_URL}/api/movies/${TEST_MOVIE_ID}`, {
      title: `Stress Test Update ${requestId}`,
      year: 2023,
      watched: requestId % 2 === 0
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    
    // Calculate response time
    const responseTime = Date.now() - startRequestTime;
    metrics.responseTimes.push(responseTime);
    
    if (response.data.success) {
      metrics.successful++;
    }
    
  } catch (error) {
    const responseTime = Date.now() - startRequestTime;
    metrics.responseTimes.push(responseTime);
    
    if (!error.response) {
      metrics.failed++;
      return;
    }
    
    switch (error.response.status) {
      case 404:
        metrics.notFound++;
        break;
      case 409:
        metrics.conflicted++;
        break;
      case 500:
        metrics.serverError++;
        break;
      default:
        metrics.failed++;
        break;
    }
  }
}

function printResults() {
  const totalTime = metrics.endTime - metrics.startTime;
  const avgResponseTime = metrics.responseTimes.reduce((sum, time) => sum + time, 0) / metrics.responseTimes.length;
  const maxResponseTime = Math.max(...metrics.responseTimes);
  const minResponseTime = Math.min(...metrics.responseTimes);
  
  console.log('\n======= STRESS TEST RESULTS =======');
  console.log(`Total requests: ${NUM_REQUESTS}`);
  console.log(`Concurrent batches: ${CONCURRENT_BATCHES}`);
  console.log(`Requests per batch: ${REQUESTS_PER_BATCH}`);
  console.log(`Total time: ${totalTime}ms`);
  console.log('\nResponse Metrics:');
  console.log(`  Successful: ${metrics.successful} (${(metrics.successful / NUM_REQUESTS * 100).toFixed(2)}%)`);
  console.log(`  Failed: ${metrics.failed} (${(metrics.failed / NUM_REQUESTS * 100).toFixed(2)}%)`);
  console.log(`  Conflicts: ${metrics.conflicted} (${(metrics.conflicted / NUM_REQUESTS * 100).toFixed(2)}%)`);
  console.log(`  Not Found: ${metrics.notFound} (${(metrics.notFound / NUM_REQUESTS * 100).toFixed(2)}%)`);
  console.log(`  Server Errors: ${metrics.serverError} (${(metrics.serverError / NUM_REQUESTS * 100).toFixed(2)}%)`);
  console.log('\nPerformance Metrics:');
  console.log(`  Requests per second: ${(NUM_REQUESTS / (totalTime / 1000)).toFixed(2)}`);
  console.log(`  Average response time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  Min response time: ${minResponseTime}ms`);
  console.log(`  Max response time: ${maxResponseTime}ms`);
  
  // Check for atomicity violations
  if (metrics.conflicted > 0) {
    console.log('\n⚠️ Atomicity Warning:');
    console.log(`  ${metrics.conflicted} update conflicts detected. The endpoint may need optimistic concurrency control.`);
  } else {
    console.log('\n✅ Atomicity Check Passed');
    console.log('  No update conflicts detected.');
  }
  
  console.log('==================================');
}

runTests();