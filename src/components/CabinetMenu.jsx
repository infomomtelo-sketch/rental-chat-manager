// src/components/CabinetMenu.jsx
import { useState } from 'react';

export default function CabinetMenu({ isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({
    inbox: true,
    properties: false,
    showings: false,
  });

  const toggle = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose}>
      <div 
        className="bg-gray-900 w-72 h-full p-5 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-bold">Rental Cabinet</h2>
          <button onClick={onClose} className="text-3xl">×</button>
        </div>

        {/* Section 1: Conversations */}
        <div className="mb-6">
          <button 
            onClick={() => toggle('inbox')}
            className="w-full flex justify-between py-3 text-left font-medium border-b border-gray-700"
          >
            Inbox / Conversations
            <span>{openSections.inbox ? '▼' : '▶'}</span>
          </button>
          {openSections.inbox && (
            <div className="pl-4 py-2 text-sm text-gray-400">
              All leads • Active chats
            </div>
          )}
        </div>

        {/* Section 2: My Properties */}
        <div className="mb-6">
          <button 
            onClick={() => toggle('properties')}
            className="w-full flex justify-between py-3 text-left font-medium border-b border-gray-700"
          >
            My Properties
            <span>{openSections.properties ? '▼' : '▶'}</span>
          </button>
          {openSections.properties && (
            <div className="pl-4 py-2 text-sm text-gray-400">
              List of units • Add new listing
            </div>
          )}
        </div>

        {/* Section 3: Active Showings */}
        <div>
          <button 
            onClick={() => toggle('showings')}
            className="w-full flex justify-between py-3 text-left font-medium border-b border-gray-700"
          >
            Active Showings
            <span>{openSections.showings ? '▼' : '▶'}</span>
          </button>
          {openSections.showings && (
            <div className="pl-4 py-2 text-sm text-gray-400">
              Upcoming scheduled showings
            </div>
          )}
        </div>

        <div className="mt-auto pt-10">
          <button className="w-full py-3 text-left text-gray-400 hover:text-white">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
