import React from 'react';
import getCurrentUser from '../hooks/getCurrentUser';

const TestPage = () => {
  const userId = getCurrentUser();

  return (
    <div>
      <h1>Dashboard</h1>
      {userId && <p>Welcome, User ID: {userId}</p>}
    </div>
  );
};

export default TestPage;
