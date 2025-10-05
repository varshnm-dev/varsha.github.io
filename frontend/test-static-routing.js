// Simple test script to verify static routing works
const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`\nStatic routing test server running at http://localhost:${port}`);
  console.log('\nTest these routes to verify they work:');
  console.log(`- http://localhost:${port}/`);
  console.log(`- http://localhost:${port}/chores`);
  console.log(`- http://localhost:${port}/dashboard`);
  console.log(`- http://localhost:${port}/completed`);
  console.log(`- http://localhost:${port}/leaderboard`);
  console.log('\nAll should load the React app without 404 errors.');
  console.log('\nPress Ctrl+C to stop the server.');
});