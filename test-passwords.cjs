const bcrypt = require('bcryptjs');

// Test the password hashes from the database
const testPasswords = [
  {
    email: 'admin@bumba.com',
    password: 'admin123',
    hash: '$2a$12$PPxUm6G6T5GKlDUQe.4vl.8yguwURlmoMaH1eou9KvGfd0zNwKPH2'
  },
  {
    email: 'dietitian@bumba.com',
    password: 'dietitian123',
    hash: '$2a$12$9KO5rqtCDFP/7tfY8IP2QOLDPH.KQgTohcJLvShJPN1mJP60.1TN.'
  },
  {
    email: 'testUser@gmail.com',
    password: 'StrongP@ssw0rd2024!',
    hash: '$2a$12$S2hdmytXbrN8hWuXjTEYNOyv5cPzOxX4EEmCzkGR4.CYK9L8TPSru'
  }
];

async function verifyPasswords() {
  console.log('Testing password hashes from database...\n');
  
  for (const test of testPasswords) {
    try {
      const isValid = await bcrypt.compare(test.password, test.hash);
      console.log(`${test.email}: ${test.password} - ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isValid) {
        // Generate a new correct hash
        const newHash = await bcrypt.hash(test.password, 12);
        console.log(`  New hash: ${newHash}`);
      }
    } catch (error) {
      console.log(`${test.email}: Error - ${error.message}`);
    }
  }
  
  console.log('\n=== Generating new hashes for common passwords ===');
  
  // Generate new hashes for simple passwords
  const simplePasswords = ['admin123', 'dietitian123', 'user123'];
  
  for (const password of simplePasswords) {
    try {
      const hash = await bcrypt.hash(password, 12);
      console.log(`${password}: ${hash}`);
    } catch (error) {
      console.log(`Error hashing ${password}: ${error.message}`);
    }
  }
}

verifyPasswords().catch(console.error);
