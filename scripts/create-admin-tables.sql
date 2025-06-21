-- Create sub_admins table
CREATE TABLE IF NOT EXISTS sub_admins (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create player_daily_releases table
CREATE TABLE IF NOT EXISTS player_daily_releases (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id BIGINT REFERENCES players(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    release_time TIME,
    release_period VARCHAR(2) CHECK (release_period IN ('AM', 'PM')),
    is_late_release BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, player_id, day)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sub_admins_username ON sub_admins(username);
CREATE INDEX IF NOT EXISTS idx_sub_admins_active ON sub_admins(is_active);
CREATE INDEX IF NOT EXISTS idx_player_daily_releases_tournament ON player_daily_releases(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_daily_releases_player ON player_daily_releases(player_id);

-- Add special_by_day column to pigeons table if it doesn't exist
ALTER TABLE pigeons ADD COLUMN IF NOT EXISTS special_by_day JSONB DEFAULT '{}';

-- Add day_dates column to tournaments table if it doesn't exist
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS day_dates JSONB DEFAULT '[]';

-- Add new columns to tournaments table if they don't exist
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS start_period VARCHAR(2) DEFAULT 'AM';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS end_period VARCHAR(2) DEFAULT 'AM';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS return_threshold INTEGER DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS pigeons_per_player INTEGER DEFAULT 11;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS helper_pigeons INTEGER DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS special_pigeons INTEGER DEFAULT 0;

-- Add special_pigeon_name column to players table if it doesn't exist
ALTER TABLE players ADD COLUMN IF NOT EXISTS special_pigeon_name VARCHAR(255);

-- Add is_cancelled column to race_results table if it doesn't exist
ALTER TABLE race_results ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN DEFAULT false;
