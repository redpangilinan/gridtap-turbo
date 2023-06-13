CREATE DATABASE gridtap_database;
\c gridtap_database

-- Enum
CREATE TYPE user_type_enum AS ENUM ('user', 'admin');
CREATE TYPE user_status_enum AS ENUM ('active', 'restricted');

-- User table
CREATE TABLE tb_users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(64) UNIQUE,
  plays INTEGER DEFAULT 0,
  scores INTEGER DEFAULT 0,
  user_type user_type_enum DEFAULT 'user',
  user_status user_status_enum DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User table automatic update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_trigger
  BEFORE UPDATE ON tb_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
