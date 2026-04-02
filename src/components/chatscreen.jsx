// src/components/ChatScreen.jsx
import { useState, useEffect } from 'react';
import { sendMessage, updateRentalStatus } from '../api';

export default function ChatScreen({ conversationId, currentUserId = "landlord-1" }) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [status, setStatus] = useState('Inquiry');

  const handleSendMessage = async () => {
    if (!newText.trim()) return;
    await sendMessage(conversationId, currentUserId, newText);
    setNewText('');
    // In real app, refresh messages here
    console.log('Message sent');
  };

  const handleStatusChange = async (newStatus) => {
    await updateRentalStatus(conversationId, newStatus);
    setStatus(newStatus);
    alert(`Rental status updated to: ${newStatus}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header with Rental Status + Quick Actions */}
      <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Rental Conversation</h2>
          <p className="text-sm text-green-400">Status: {status}</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleStatusChange('Showing Scheduled')}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Schedule Showing
          </button>
          <button 
            onClick={() => handleStatusChange('Approved')}
            className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Mark Approved
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No messages yet. Start the conversation!</p>
        )}
        {/* Messages will appear here */}
      </div>

      {/* Bottom Input Bar (Messenger style) */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 rounded-full px-5 py-3 focus:outline-none"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-600 px-8 rounded-full font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
