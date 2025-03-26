import React, { useState } from 'react';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReply('');

    try {
      const res = await fetch('http://localhost:3001/user/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.reply || 'No response received.');
    } catch (err) {
      console.error('Error contacting backend:', err);
      setReply('Failed to connect to server.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Ask the AI Travel Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something travel related..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      {reply && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>
          <strong>AI says:</strong> {reply}
        </div>
      )}
    </div>
  );
};

export default Chat;
