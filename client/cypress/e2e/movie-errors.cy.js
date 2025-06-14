// client/cypress/e2e/movie-errors.cy.js
describe('Movie API Error Handling', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
    
    // Create fixture to capture the form data
    cy.fixture('errors.json').as('errorMessages');
  });
  
  describe('Add Movie Error Handling', () => {
    beforeEach(() => {
      // Visit the add movie page
      cy.visit('/movies/add');
    });
    
    it('should display validation error when title is empty', function() {
      // Fill the form with invalid data
      cy.get('[data-cy=movie-year-input]').clear().type('2023');
      cy.get('[data-cy=submit-movie]').click();
      
      // Verify error message is displayed
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', 'Movie title is required');
      
      // Verify error is dismissed after clicking the dismiss button
      cy.get('[data-cy=dismiss-error]').click();
      cy.get('[data-cy=error-message]').should('not.exist');
    });
    
    it('should display error when year is invalid', function() {
      // Fill the form with invalid data
      cy.get('[data-cy=movie-title-input]').clear().type('Test Movie');
      cy.get('[data-cy=movie-year-input]').clear().type('1800');
      cy.get('[data-cy=submit-movie]').click();
      
      // Intercept the API request and mock an error response
      cy.intercept('POST', '/api/movies', {
        statusCode: 400,
        body: {
          success: false,
          error: this.errorMessages.validation.yearRange
        }
      }).as('addMovieRequest');
      
      cy.get('[data-cy=submit-movie]').click();
      
      // Verify error message is displayed
      cy.wait('@addMovieRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', this.errorMessages.validation.yearRange);
    });
    
    it('should display server error message when server fails', function() {
      // Fill the form with valid data but mock server error
      cy.get('[data-cy=movie-title-input]').clear().type('Test Movie');
      cy.get('[data-cy=movie-year-input]').clear().type('2023');
      
      // Intercept the API request and mock a server error
      cy.intercept('POST', '/api/movies', {
        statusCode: 500,
        body: {
          success: false,
          error: this.errorMessages.server.generic
        }
      }).as('serverErrorRequest');
      
      cy.get('[data-cy=submit-movie]').click();
      
      // Verify error message is displayed
      cy.wait('@serverErrorRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', this.errorMessages.server.generic);
    });
    
    it('should verify error message appears and disappears after timeout', function() {
      // Fill the form with valid data but mock server error
      cy.get('[data-cy=movie-title-input]').clear().type('Test Movie');
      cy.get('[data-cy=movie-year-input]').clear().type('2023');
      
      // Intercept the API request and mock a server error
      cy.intercept('POST', '/api/movies', {
        statusCode: 500,
        body: {
          success: false,
          error: this.errorMessages.server.generic
        },
        delay: 100 // Add slight delay to simulate network
      }).as('serverErrorRequest');
      
      cy.get('[data-cy=submit-movie]').click();
      
      // Verify error message appears
      cy.wait('@serverErrorRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      
      // Verify it disappears after timeout (default is 5000ms, but we can reduce for testing)
      cy.get('[data-cy=error-message]').should('not.exist', { timeout: 6000 });
    });
  });
  
  describe('Movie List Error Handling', () => {
    it('should display not found error when accessing invalid movie', function() {
      // Intercept the GET request and mock a not found error
      cy.intercept('GET', '/api/movies/*', {
        statusCode: 404,
        body: {
          success: false,
          error: this.errorMessages.notFound.movie
        }
      }).as('getMovieRequest');
      
      // Visit a movie that doesn't exist
      cy.visit('/movies/123456789012345678901234/edit');
      
      // Verify error message is displayed
      cy.wait('@getMovieRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', this.errorMessages.notFound.movie);
    });
    
    it('should display unauthorized error when token is invalid', function() {
      // Clear the token to simulate unauthorized access
      cy.clearLocalStorage('token');
      
      // Intercept the GET request and mock an unauthorized error
      cy.intercept('GET', '/api/movies', {
        statusCode: 401,
        body: {
          success: false,
          error: this.errorMessages.auth.unauthorized
        }
      }).as('unauthorizedRequest');
      
      // Try to access protected route
      cy.visit('/movies');
      
      // Verify error message is displayed
      cy.wait('@unauthorizedRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', this.errorMessages.auth.unauthorized);
      
      // Verify we're redirected to login
      cy.url().should('include', '/login');
    });
    
    it('should handle network errors gracefully', function() {
      // Intercept the GET request and simulate a network error
      cy.intercept('GET', '/api/movies', {
        forceNetworkError: true
      }).as('networkErrorRequest');
      
      // Visit the movies page
      cy.visit('/movies');
      
      // Verify error message about network issues is displayed
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', 'connection');
    });
  });
  
  describe('Edit Movie Error Handling', () => {
    beforeEach(() => {
      // Create a movie to edit
      cy.createMovie('Test Edit Movie', 2023);
      
      // Get the movie ID
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/api/movies`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        // Find our test movie
        const movie = response.body.data.find(m => m.title === 'Test Edit Movie');
        if (movie) {
          cy.wrap(movie._id).as('movieId');
        }
      });
    });
    
    it('should display conflict error when movie was updated by someone else', function() {
      // Visit the edit page
      cy.get('@movieId').then(movieId => {
        cy.visit(`/movies/${movieId}/edit`);
        
        // Fill the form
        cy.get('[data-cy=movie-title-input]').clear().type('Updated Movie');
        
        // Intercept the PUT request and mock a conflict error
        cy.intercept('PUT', `/api/movies/${movieId}`, {
          statusCode: 409,
          body: {
            success: false,
            error: this.errorMessages.server.conflict
          }
        }).as('conflictRequest');
        
        cy.get('[data-cy=submit-movie]').click();
        
        // Verify error message
        cy.wait('@conflictRequest');
        cy.get('[data-cy=error-message]').should('be.visible');
        cy.get('[data-cy=error-message]').should('contain', this.errorMessages.server.conflict);
      });
    });
  });
  
  describe('Delete Movie Error Handling', () => {
    beforeEach(() => {
      // Create a movie to delete
      cy.createMovie('Test Delete Movie', 2023);
      
      // Visit the movies page
      cy.visit('/movies');
    });
    
    it('should display error when delete operation fails', function() {
      // Find the delete button
      cy.contains('Test Delete Movie')
        .parent()
        .find('[data-cy=delete-movie]')
        .as('deleteButton');
      
      // Intercept the DELETE request and mock a server error
      cy.intercept('DELETE', '/api/movies/*', {
        statusCode: 500,
        body: {
          success: false,
          error: this.errorMessages.server.generic
        }
      }).as('deleteRequest');
      
      // Click delete
      cy.get('@deleteButton').click();
      cy.get('[data-cy=confirm-delete]').click();
      
      // Verify error message
      cy.wait('@deleteRequest');
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', this.errorMessages.server.generic);
    });
  });
  
  describe('Error Message UI Testing', () => {
    it('should render error messages with proper styling', function() {
      // Visit any page
      cy.visit('/movies');
      
      // Programmatically trigger an error
      cy.window().then(win => {
        const errorEvent = new win.CustomEvent('api-error', { 
          detail: { message: 'Test styled error message', status: 500 }
        });
        win.dispatchEvent(errorEvent);
      });
      
      // Check that error appears with correct styling
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]')
        .should('have.css', 'position', 'fixed')
        .and('have.css', 'z-index', '1000');
      
      // Check for animation
      cy.get('[data-cy=error-message]').should('have.css', 'animation-name');
    });
    
    it('should dismiss error when clicking the dismiss button', function() {
      // Visit any page
      cy.visit('/movies');
      
      // Trigger an error
      cy.window().then(win => {
        const errorEvent = new win.CustomEvent('api-error', { 
          detail: { message: 'Dismissible error message', status: 400 }
        });
        win.dispatchEvent(errorEvent);
      });
      
      // Error should be visible
      cy.get('[data-cy=error-message]').should('be.visible');
      
      // Click dismiss
      cy.get('[data-cy=dismiss-error]').click();
      
      // Error should be gone
      cy.get('[data-cy=error-message]').should('not.exist');
    });
  });
});


