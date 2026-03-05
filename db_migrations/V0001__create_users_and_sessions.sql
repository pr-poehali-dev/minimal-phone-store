CREATE TABLE IF NOT EXISTS t_p32380461_minimal_phone_store.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p32380461_minimal_phone_store.sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p32380461_minimal_phone_store.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p32380461_minimal_phone_store.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON t_p32380461_minimal_phone_store.sessions(expires_at);
