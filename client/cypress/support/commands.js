Cypress.Commands.add('login', (email = 'James@example.com', password = 'password123') => {
  // Store the token directly using window.localStorage
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}${Cypress.env('loginRoute')}`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    
    // Store token and user in localStorage
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

// Command to create a test movie
Cypress.Commands.add('createMovie', (title = 'Test Movie', year = 2023, watched = false) => {
  const token = window.localStorage.getItem('token');
  
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}${Cypress.env('moviesRoute')}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { title, year, watched },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body.data;
  });
});

// Command to intercept API requests and mock responses
Cypress.Commands.add('mockApiError', (route, statusCode, errorMessage, method = 'GET') => {
  cy.intercept(
    {
      method,
      url: `${Cypress.env('apiUrl')}${route}*`,
    },
    {
      statusCode,
      body: {
        success: false,
        error: errorMessage,
      },
      delay: 100, // Small delay to simulate network
    }
  ).as(`${method.toLowerCase()}${route.replace(/\//g, '')}`);
});