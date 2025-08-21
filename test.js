import crypto from 'crypto'
function generateRandomString() {
  const randomString = crypto.randomBytes(16).toString('hex');
  console.log("Random string generated:", randomString);
}

generateRandomString();