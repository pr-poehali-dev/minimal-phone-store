CREATE TABLE IF NOT EXISTS t_p32380461_minimal_phone_store.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p32380461_minimal_phone_store.users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON t_p32380461_minimal_phone_store.orders(user_id);
