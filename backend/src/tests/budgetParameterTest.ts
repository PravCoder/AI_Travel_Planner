import axios from 'axios';
import { TripParameters } from '../models/Trip';

const API_URL = 'http://localhost:3001/trip/generate';
const SERVER_CHECK_URL = 'http://localhost:3001';

/**
 * Tests that budget parameter is correctly passed to OpenAI and
 * reflected in the generated trip plan
 */
async function testBudgetParameter() {
  console.log('Testing budget parameter handling in OpenAI trip planning...');
  
  // We'll test with a single test budget value to avoid rate limiting
  const testBudget = 'luxury';
  
  try {
    // Define trip parameters with clear budget setting
    const tripParameters: TripParameters = {
      location: 'Paris',
      tripType: 'vacation',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-05'),
      budget: testBudget,
      travelers: 2
    };
    
    console.log(`Sending trip generation request with budget: ${testBudget}`);
    
    // Send request to generate trip plan with specified budget
    const response = await axios.post(API_URL, {
      tripParameters,
      conversationContext: []
    });
    
    // Verify successful response
    if (response.status === 200) {
      console.log('Trip plan generated successfully');
      
      // Check if budget in response matches the requested budget
      const returnedBudget = response.data.budget;
      console.log(`Requested budget: ${testBudget}, Returned budget: ${returnedBudget}`);
      
      if (returnedBudget.toLowerCase() === testBudget.toLowerCase()) {
        console.log('✅ SUCCESS: Budget parameter was correctly passed and returned');
      } else {
        console.log('❌ FAIL: Budget parameter was not correctly reflected in the response');
      }
      
    } else {
      console.log(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      console.log(`Error - Status ${error.response.status}`);
      console.log('Error details:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.log(`No response received - ${error.message}`);
    } else {
      // Error setting up request
      console.log(`Setup error - ${error.message}`);
    }
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
    await testBudgetParameter();
  }
}

main(); 