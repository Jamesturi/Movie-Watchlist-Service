// client/cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // Task for logging with timestamps
      on('task', {
        log(message) {
          console.log(`[${new Date().toISOString()}] ${message}`);
          return null;
        }
      });
    },
  },
  env: {
    apiUrl: 'http://localhost:5000',
    loginRoute: '/api/auth/login',
    moviesRoute: '/api/movies'
  }
});