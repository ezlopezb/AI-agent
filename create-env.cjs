// scripts/create-env.js
const fs = require('fs');
const path = require('path');

const envContent = `VITE_API_URL=localhost:4200/api VITE_ENCRIPTION_KEY="12345678901234567890123456789012"
VITE_IV="f83d0db75dce1bdfaa5da86398fd7bda"`;

const envPath = path.join(__dirname, './.env');

fs.writeFile(envPath, envContent, (err) => {
  if (err) {
    console.error('Error creating .env file:', err);
    process.exit(1);
  }
  console.log('.env file created successfully!');
});