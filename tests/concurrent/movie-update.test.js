const { expect } = require('chai');
const supertest = require('supertest');
const async = require('async');

const api = supertest('http://localhost:5000');
let authToken;
let testMovieId;

describe('Movie Update Concurrency Tests', function() {
  this.timeout(30000); // Increase timeout for concurrent tests
  
  before(async () => {
    // Login and get token
    const res = await api
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });
    
    authToken = res.body.token;
    
    // Create a test movie
    const movieRes = await api
      .post('/api/movies')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Concurrency Test Movie',
        year: 2023,
        watched: false
      });
    
    testMovieId = movieRes.body.data._id;
  });
  
  after(async () => {
    // Delete the test movie
    await api
      .delete(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });
  
  it('should handle 50 concurrent updates atomically', async () => {
    // Initialize an array of functions for concurrent execution
    const updateFunctions = [];
    const results = {
      success: 0,
      notModified: 0,
      conflict: 0,
      error: 0
    };
    
    // Prepare 50 concurrent update requests
    for (let i = 0; i < 50; i++) {
      updateFunctions.push(async (callback) => {
        try {
          const res = await api
            .put(`/api/movies/${testMovieId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              title: `Updated Movie Title ${i}`,
              year: 2023,
              watched: Math.random() > 0.5 // Randomly set to true or false
            });
          
          if (res.status === 200) {
            results.success++;
          } else if (res.status === 304) {
            results.notModified++;
          } else if (res.status === 409) {
            results.conflict++;
          } else {
            results.error++;
          }
          
          callback(null, res.status);
        } catch (error) {
          results.error++;
          callback(null, 'error');
        }
      });
    }
    
    // Execute all updates concurrently
    await new Promise((resolve, reject) => {
      async.parallel(updateFunctions, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    // Verify that all requests were handled (should equal 50)
    expect(results.success + results.notModified + results.conflict + results.error).to.equal(50);
    
    // Check if at least one update was successful
    expect(results.success).to.be.at.least(1);
    
    // Check that the final state is consistent
    const finalMovie = await api
      .get(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(finalMovie.body.success).to.be.true;
    expect(finalMovie.body.data).to.have.property('title').that.includes('Updated Movie Title');
  });
  
  it('should maintain data integrity with rapid sequential updates', async () => {
    // Test rapid sequential updates
    const numUpdates = 20;
    const titles = [];
    
    for (let i = 0; i < numUpdates; i++) {
      const newTitle = `Sequential Update ${i}`;
      titles.push(newTitle);
      
      const res = await api
        .put(`/api/movies/${testMovieId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: newTitle,
          year: 2023,
          watched: i % 2 === 0 // Alternate between true and false
        });
      
      expect(res.status).to.equal(200);
      expect(res.body.data.title).to.equal(newTitle);
    }
    
    // The final state should match the last update
    const finalMovie = await api
      .get(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(finalMovie.body.data.title).to.equal(titles[titles.length - 1]);
    expect(finalMovie.body.data.watched).to.equal((numUpdates - 1) % 2 === 0);
  });
});