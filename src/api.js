// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || '';

export const sendMessage = async (conversationId, senderId, text, imageUrl = null, imageUrls = null) => {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, senderId, text, imageUrl, imageUrls })
  });
  return res.json();
};

export const updateRentalStatus = async (conversationId, status, showingTime = null, notes = null) => {
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, showingTime, notes })
  });
  return res.json();
};
