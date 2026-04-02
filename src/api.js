// src/App.jsx
import { useState } from 'react';
import ChatScreen from './components/chatscreen';

function App() {
  // For demo: using a fixed conversation ID
  const [conversationId] = useState("demo-conversation-001");

  return (
    <div className="min-h-screen bg-gray-950">
      <ChatScreen 
        conversationId={conversationId} 
        currentUserId="landlord-1" 
      />
    </div>
  );
}

export default App;
