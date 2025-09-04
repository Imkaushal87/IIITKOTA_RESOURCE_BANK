#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 IIIT Kota Resource Bank - Backend Setup');
console.log('==========================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
MONGO_URI=mongodb://localhost:27017/iiitk-resource-bank

# JWT Configuration (for local development)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Auth0 Configuration (optional - for production)
# AUTH0_DOMAIN=your-domain.auth0.com
# AUTH0_AUDIENCE=your-api-identifier

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload Limits
MAX_FILE_SIZE=20971520
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
}

console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Install dependencies: npm install');
console.log('3. Start MongoDB');
console.log('4. Run the server: npm run dev');
console.log('\n🔗 For more info, see README.md');


