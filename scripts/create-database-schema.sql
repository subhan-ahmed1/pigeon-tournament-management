-- Pigeon Racing Tournament Database Schema
-- This script creates all necessary tables for the tournament management system

-- Create database (uncomment if needed)
-- CREATE DATABASE pigeon_racing_tournaments;
-- USE pigeon_racing_tournaments;

-- Users/Admins table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    days INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    start_time TIME NOT NULL,
    start_period VARCHAR(2) NOT NULL,
    end_time TIME NOT NULL,
    end_period VARCHAR(2) NOT NULL,
    return_threshold INTEGER NOT NULL DEFAULT 0,
    pigeons_per_player INTEGER NOT NULL DEFAULT 1,
    helper_pigeons INTEGER NOT NULL DEFAULT 0,
    special_pigeons INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tournament days table (for multi-day tournaments)
CREATE TABLE IF NOT EXISTS tournament_days (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    weather_conditions VARCHAR(100),
    temperature DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    wind_direction VARCHAR(20),
    notes TEXT,
    UNIQUE(tournament_id, day_number)
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tournament participants (many-to-many relationship)
CREATE TABLE IF NOT EXISTS tournament_participants (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    special_pigeon_name VARCHAR(100),
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

-- Pigeons table
CREATE TABLE IF NOT EXISTS pigeons (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    ring_number VARCHAR(50),
    color VARCHAR(50),
    breed VARCHAR(50),
    gender VARCHAR(10),
    is_special BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Race results table (daily pigeon arrivals)
CREATE TABLE IF NOT EXISTS race_results (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    pigeon_id INTEGER NOT NULL REFERENCES pigeons(id) ON DELETE CASCADE,
    arrival_time TIME,
    arrival_period VARCHAR(2),
    race_time TIME,
    race_time_minutes DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, day_number, pigeon_id)
);

-- Daily special titles/awards
CREATE TABLE IF NOT EXISTS daily_titles (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title_type VARCHAR(20) NOT NULL,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    pigeon_id INTEGER NOT NULL REFERENCES pigeons(id) ON DELETE CASCADE,
    time TIME NOT NULL,
    race_time_minutes DECIMAL(10,2) NOT NULL,
    UNIQUE(tournament_id, day_number, title_type)
);

-- Player daily releases (when pigeons were released)
CREATE TABLE IF NOT EXISTS player_daily_releases (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    release_time TIME,
    release_period VARCHAR(2),
    is_late_release BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(tournament_id, day_number, player_id)
);

-- Tournament rankings (calculated and cached)
CREATE TABLE IF NOT EXISTS tournament_rankings (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    total_time DECIMAL(10,2) NOT NULL,
    returned_pigeons INTEGER NOT NULL,
    return_percentage DECIMAL(5,2) NOT NULL,
    best_day_average DECIMAL(10,2),
    best_day INTEGER,
    last_calculated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

-- Daily player summaries (for quick access)
CREATE TABLE IF NOT EXISTS daily_player_summaries (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    total_time DECIMAL(10,2) NOT NULL,
    returned_count INTEGER NOT NULL,
    average_time DECIMAL(10,2) NOT NULL,
    last_calculated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, day_number, player_id)
);

-- Indexes for better performance
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date);
CREATE INDEX idx_race_results_tournament_day ON race_results(tournament_id, day_number);
CREATE INDEX idx_race_results_pigeon ON race_results(pigeon_id);
CREATE INDEX idx_pigeons_player ON pigeons(player_id);
CREATE INDEX idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX idx_tournament_days_tournament ON tournament_days(tournament_id);
CREATE INDEX idx_daily_titles_tournament_day ON daily_titles(tournament_id, day_number);
