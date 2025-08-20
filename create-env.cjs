// scripts/create-env.js
const fs = require('fs');
const path = require('path');

const envContent = `VITE_API_URL=https://3fc5-2800-a4-1509-6800-1d2b-401b-a0ca-ceb.ngrok-free.app/api`;

const envPath = path.join(__dirname, './.env');

fs.writeFile(envPath, envContent, (err) => {
  if (err) {
    console.error('Error creating .env file:', err);
    process.exit(1);
  }
  console.log('.env file created successfully!');
});