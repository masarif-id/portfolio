// Script untuk generate password hash
// Jalankan dengan: node utils/setup-password.js

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
    const password = process.argv[2];
    
    if (!password) {
        console.log('Usage: node utils/setup-password.js <password>');
        console.log('Example: node utils/setup-password.js mySecurePassword123');
        process.exit(1);
    }
    
    try {
        const hash = await bcrypt.hash(password, 12);
        console.log('\n=== PASSWORD HASH GENERATED ===');
        console.log('Add this to your .env file:');
        console.log(`ANALYTICS_ADMIN_PASSWORD_HASH=${hash}`);
        console.log('\nAlso set these variables:');
        console.log('ANALYTICS_ADMIN_EMAIL=admin@masarif.id');
        console.log('ANALYTICS_JWT_SECRET=your_very_secure_jwt_secret_key_here');
        console.log('\n=== SECURITY REMINDER ===');
        console.log('- Never commit the .env file to version control');
        console.log('- Use a strong, unique password');
        console.log('- Change the JWT secret to a random string');
        console.log('- Delete this script after setup');
    } catch (error) {
        console.error('Error generating hash:', error);
        process.exit(1);
    }
}

generatePasswordHash();