import axios from 'axios';

const API_URL = 'http://localhost:3001/trip/chat';
const SERVER_CHECK_URL = 'http://localhost:3001';
const RESET_URL = 'http://localhost:3001/trip/reset-rate-limits';
// Add a TEST_MODE flag to reduce API usage
const TEST_MODE = true; // Set to true to use minimal content for testing
// Generate a unique ID for this test run to prevent overlapping with previous tests
const uniqueTestId = `test-${Date.now()}`;

async function resetRateLimits() {
  try {
    console.log('Resetting rate limits before test...');
    await axios.post(RESET_URL);
    console.log('Rate limits reset successfully');
  } catch (error) {
    console.error('Failed to reset rate limits:', error);
  }
}

async function testRateLimit() {
  console.log('Testing rate limiting...');
  console.log(`Using unique test ID: ${uniqueTestId}`);
  
  // Make requests until we hit the limit
  for (let i = 1; i <= 52; i++) {
    try {
      // Use minimal content to reduce OpenAI API costs during testing
      const response = await axios.post(API_URL, {
        message: TEST_MODE ? "test" : `Test message ${i}`, 
        // Add a test flag to signal this is a test request
        isTestRequest: TEST_MODE,
        // Add unique test ID to avoid interference between test runs
        testId: uniqueTestId
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
    await resetRateLimits();
    await testRateLimit();
  }
}

main(); 