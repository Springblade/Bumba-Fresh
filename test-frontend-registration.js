// Test registration from frontend perspective
const testData = {
  email: `testfrontend${Date.now()}@example.com`,
  password: 'TestPass123!',
  firstName: 'Frontend',
  lastName: 'Test'
};

console.log('Testing registration with:', testData.email);

fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  return response.text();
})
.then(text => {
  console.log('Response text:', text);
  try {
    const data = JSON.parse(text);
    console.log('Registration result:', data);
  } catch (e) {
    console.log('Failed to parse as JSON');
  }
})
.catch(error => {
  console.error('Registration error:', error);
});
