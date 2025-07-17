/*
  # Analytics Database Schema

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event` (text) - event type (page_view, click, etc)
      - `page` (text) - page path
      - `timestamp` (timestamptz) - when event occurred
      - `user_agent` (text) - browser user agent
      - `referrer` (text) - referrer URL
      - `ip_address` (text) - client IP (hashed for privacy)
      - `country` (text) - user country
      - `device` (text) - device type
      - `utm_source` (text) - UTM parameters
      - `utm_medium` (text)
      - `utm_campaign` (text)
      - `utm_term` (text)
      - `utm_content` (text)
      - `session_id` (text) - session identifier
      - `created_at` (timestamptz)

    - `analytics_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `ip_address` (text, hashed)
      - `user_agent` (text)
      - `country` (text)
      - `device` (text)
      - `first_page` (text)
      - `last_page` (text)
      - `page_count` (integer)
      - `duration` (integer) - session duration in seconds
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - No public access (analytics data is sensitive)
    - Only service role can read/write

  3. Indexes
    - Performance indexes for common queries
*/

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event text NOT NULL,
    page text NOT NULL,
    timestamp timestamptz NOT NULL,
    user_agent text,
    referrer text,
    ip_address text,
    country text,
    device text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    utm_content text,
    session_id text,
    created_at timestamptz DEFAULT now()
);

-- Analytics Sessions Table
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text UNIQUE NOT NULL,
    ip_address text,
    user_agent text,
    country text,
    device text,
    first_page text,
    last_page text,
    page_count integer DEFAULT 1,
    duration integer DEFAULT 0,
    started_at timestamptz NOT NULL,
    ended_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can access
-- (RLS policies will deny all public access by default)

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_campaign ON analytics_events(utm_campaign) WHERE utm_campaign IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_country ON analytics_sessions(country) WHERE country IS NOT NULL;