import React from 'react';
import getCurrentUser from '../hooks/getCurrentUser';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const TestPage = () => {
  const userId = getCurrentUser();

const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId='516075917073-kjqp5cjgsn2jl5a3bgijeh8r0bfefvkv.apps.googleusercontent.com'>
    <div>
      <h1>Dashboard</h1>
      {userId && <p>Welcome, User ID: {userId}</p>}
      <GoogleLogin
        onSuccess={credentialResponse => {
        console.log(credentialResponse);
         navigate("/dashboard");
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
    </div>
    </GoogleOAuthProvider>
  );
};

export default TestPage;