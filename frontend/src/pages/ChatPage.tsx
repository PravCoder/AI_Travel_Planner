import React from 'react';
import Chat from '../components/Chat';

const ChatPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Travel Assistant</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
