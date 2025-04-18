import axios from 'axios';

const API_URL = 'http://localhost:3001/trip/chat';
const SERVER_CHECK_URL = 'http://localhost:3001';

async function testRateLimit() {
  console.log('Testing rate limiting...');
  
  // Make requests until we hit the limit
  for (let i = 1; i <= 12; i++) {
    try {
      const response = await axios.post(API_URL, {
        message: `Test message ${i}`
      });
      console.log(`Request ${i}: Success - Status ${response.status}`);
    } catch (error: any) {
      if (error.response) {
        // Server responded with error
        console.log(`Request ${i}: Error - Status ${error.response.status}`);
        console.log('Error details:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.log(`Request ${i}: No response received - ${error.message}`);
        console.log('Full error:', error);
      } else {
        // Error setting up request
        console.log(`Request ${i}: Setup error - ${error.message}`);
      }
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(SERVER_CHECK_URL);
    console.log('Server is running');
    return true;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure the server is running on port 3001');
      return false;
    }
    
    // If we get any response (even an error), the server is running
    console.log('Server is running (received response)');
    return true;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testRateLimit();
  }
}

main(); 