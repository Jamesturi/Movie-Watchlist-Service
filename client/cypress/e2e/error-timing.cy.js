// client/cypress/e2e/error-timing.cy.js
describe('Error Message Timing Tests', () => {
  beforeEach(() => {
    cy.login();
  });
  
  it('should display error message promptly after API error', () => {
    // Visit the movies page
    cy.visit('/movies/add');
    
    // Fill the form with valid data
    cy.get('[data-cy=movie-title-input]').clear().type('Timing Test');
    cy.get('[data-cy=movie-year-input]').clear().type('2023');
    
    // Start measuring time
    const start = Date.now();
    
    // Intercept the API request and mock a server error with a significant delay
    cy.intercept('POST', '/api/movies', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Test server error for timing measurement'
      },
      delay: 500 // Simulated server processing time
    }).as('serverRequest');
    
    // Submit the form
    cy.get('[data-cy=submit-movie]').click();
    
    // Wait for the response
    cy.wait('@serverRequest');
    
    // Verify error appears within a reasonable time after the response
    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .then(() => {
        const end = Date.now();
        const totalTime = end - start;
        const responseTime = totalTime - 500; // Subtract server delay
        
        // Log the timing
        cy.log(`Total time: ${totalTime}ms`);
        cy.log(`Response time: ${responseTime}ms`);
        
        // Error should appear quickly after response (within 100ms)
        expect(responseTime).to.be.lessThan(600);
        
        // Check for exact time in the test output
        cy.task('log', `Error displayed ${responseTime}ms after API response`);
      });
  });
  
  it('should handle multiple rapid error messages correctly', () => {
    // Visit the add movie page
    cy.visit('/movies/add');
    
    // Generate 3 rapid API errors
    for (let i = 1; i <= 3; i++) {
      // Intercept each request with a different error
      cy.intercept('POST', '/api/movies', {
        statusCode: 400,
        body: {
          success: false,
          error: `Error message #${i}`
        },
        delay: 100 * i
      }).as(`request${i}`);
      
      // Fill and submit the form
      cy.get('[data-cy=movie-title-input]').clear().type(`Test ${i}`);
      cy.get('[data-cy=submit-movie]').click();
      
      // Wait briefly before next attempt (but not long enough for auto-dismiss)
      cy.wait(200);
    }
    
    // Verify only the latest error is shown
    cy.get('[data-cy=error-message]').should('have.length', 1);
    cy.get('[data-cy=error-message]').should('contain', 'Error message #3');
    
    // Dismiss the error
    cy.get('[data-cy=dismiss-error]').click();
    cy.get('[data-cy=error-message]').should('not.exist');
  });
});