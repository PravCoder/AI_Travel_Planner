import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useCookies } from "react-cookie";

const TestComponent = () => {
    const [testData, setTestData] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // sends post-request to test endpint to our backend, (not sending any data with the request to backend for now)
      console.log("in handle submit");
      const result = await axios.post("http://localhost:3001/test", {});
      setTestData(result.data.test_data); // access teh data that we recived in the response
      
    } catch (error) {
      console.error(error.response.data.message);  
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>

        
        {/* refresh page to test the button */}
        <button type="submit" style={{ color: 'black',fontWeight: 'bold', }}>Test Button</button>
        <p>Test data returned by /test backend endpoint: {testData}</p>
        
      </form>
         
    </div>
  )
}

export default TestComponent;