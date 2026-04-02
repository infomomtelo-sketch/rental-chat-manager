-- 1. Users table (landlords + tenants)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- UUID or Firebase-like ID
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK(role IN ('landlord', 'tenant')),  -- or just use for permissions
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  avatar_url TEXT
);

-- 2. Conversations table (each chat = one rental lead/tenant relationship)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,                    -- UUID
  landlord_id TEXT NOT NULL,              -- references users
  tenant_id TEXT,                         -- can be NULL for new leads
  property_name TEXT,                     -- e.g. "Trailer on Elm St"
  status TEXT DEFAULT 'Inquiry' 
    CHECK(status IN ('Inquiry', 'Showing Scheduled', 'Approved', 'Rejected', 'Archived')),
  showing_time DATETIME,                  -- when showing is scheduled
  notes TEXT,                             -- simple text notes or JSON for more
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Messages table (the actual chat history)
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,                    -- UUID
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,                -- who sent it (landlord or tenant)
  text TEXT,
  image_url TEXT,                         -- single photo URL from R2
  image_urls TEXT,                        -- JSON array for multiple photos
  message_type TEXT DEFAULT 'text' 
    CHECK(message_type IN ('text', 'image', 'system')),  -- system = status changes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- 4. Optional: Indexes for speed (highly recommended)
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
  ON messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_landlord 
  ON conversations(landlord_id, status);

CREATE INDEX IF NOT EXISTS idx_conversations_updated 
  ON conversations(updated_at DESC);
