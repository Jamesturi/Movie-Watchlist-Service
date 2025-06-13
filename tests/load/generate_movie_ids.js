const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function generateMovieIds() {
  // Get JWT token by logging in
  const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
  "email": "James@example.com",
  "password": "password123"
});
  


  console.log('loginResponse.data =', JSON.stringify(loginResponse.data, null, 2));

//   const token = loginResponse.data.token;
  const { token } = loginResponse.data.data;

  console.log("..................................."+token);
  
  // Get all movies for the authenticated user
  const moviesResponse = await axios.get('http://localhost:5000/api/movies', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const movies = moviesResponse.data.data;
  
  // Create CSV file with movie IDs
  let csvContent = 'id\n'; // Header
  movies.forEach(movie => {
    csvContent += `${movie._id}\n`;
  });
  
  fs.writeFileSync(path.join(__dirname, 'movie_ids.csv'), csvContent);
  console.log(`Generated CSV file with ${movies.length} movie IDs`);
}

generateMovieIds().catch(console.error);