-- schema.sql
-- Database schema for rental-chat-manager

-- 1. Users table (landlords and tenants)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK(role IN ('landlord', 'tenant')),
  avatar_url TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Conversations table (each chat = one rental lead or tenant relationship)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  landlord_id TEXT NOT NULL,
  tenant_id TEXT,
  property_name TEXT,
  status TEXT DEFAULT 'Inquiry' 
    CHECK(status IN ('Inquiry', 'Showing Scheduled', 'Approved', 'Rejected', 'Archived')),
  showing_time DATETIME,
  notes TEXT,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Messages table (the actual chat history + photos)
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT,
  image_url TEXT,                    -- For single photo
  image_urls TEXT,                   -- JSON array for multiple photos (grid layout)
  message_type TEXT DEFAULT 'text' 
    CHECK(message_type IN ('text', 'image', 'system')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
  ON messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_landlord 
  ON conversations(landlord_id, status);

CREATE INDEX IF NOT EXISTS idx_conversations_updated 
  ON conversations(updated_at DESC);
