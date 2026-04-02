// src/components/chatscreen.jsx
import { useState } from 'react';
import CabinetMenu from './CabinetMenu';
import { sendMessage, updateRentalStatus } from '../api';

export default function ChatScreen({ conversationId = "demo-conv-1", currentUserId = "landlord-1" }) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [status, setStatus] = useState('Inquiry');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSend = async () => {
    if (!newText.trim()) return;
    await sendMessage(conversationId, currentUserId, newText);
    setNewText('');
    // For demo: add message locally
    setMessages([...messages, { text: newText, senderId: currentUserId }]);
  };

  const handleStatusUpdate = async (newStatus) => {
    await updateRentalStatus(conversationId, newStatus);
    setStatus(newStatus);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      {/* Top Bar with Hamburger */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <button 
          onClick={() => setMenuOpen(true)}
          className="text-2xl p-2"
        >
          ☰
        </button>
        <div className="font-semibold">Rental Chat</div>
        <div className="text-sm text-green-400">{status}</div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No messages yet.<br />Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.senderId === currentUserId ? 'bg-blue-600' : 'bg-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons for Rental Workflow */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex gap-2 overflow-x-auto">
        <button 
          onClick={() => handleStatusUpdate('Showing Scheduled')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm whitespace-nowrap"
        >
          Schedule Showing
        </button>
        <button 
          onClick={() => handleStatusUpdate('Approved')}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm whitespace-nowrap"
        >
          Mark Approved
        </button>
      </div>

      {/* Message Input Bar */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 rounded-full px-5 py-3 text-white focus:outline-none"
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 px-7 rounded-full font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Cabinet Menu */}
      <CabinetMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
