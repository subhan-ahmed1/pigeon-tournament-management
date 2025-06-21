-- HIGH FLYER PIGEON TOURNAMENT DATABASE SETUP GUIDE
-- Unite Pigeon Club Bewal - Database Implementation Guide

-- =====================================================
-- STEP 1: CREATE DATABASE (Choose your database system)
-- =====================================================

-- For MySQL:
CREATE DATABASE unite_pigeon_club_bewal;
USE unite_pigeon_club_bewal;

-- For PostgreSQL:
-- CREATE DATABASE unite_pigeon_club_bewal;
-- \c unite_pigeon_club_bewal;

-- =====================================================
-- STEP 2: UNDERSTANDING THE DATABASE STRUCTURE
-- =====================================================

-- The database consists of these main tables:

-- 1. USERS - Admin and sub-admin accounts
-- 2. TOURNAMENTS - High flyer tournament information
-- 3. TOURNAMENT_DAYS - Individual day details for multi-day tournaments
-- 4. PLAYERS - Pigeon fanciers (participants)
-- 5. TOURNAMENT_PARTICIPANTS - Links players to tournaments
-- 6. PIGEONS - Individual pigeon records
-- 7. RACE_RESULTS - Daily flight results (arrival times, flight duration)
-- 8. DAILY_TITLES - Special awards (Akhri Bahadur, Pehla Bahadur, etc.)
-- 9. PLAYER_DAILY_RELEASES - When pigeons were released each day
-- 10. TOURNAMENT_RANKINGS - Calculated rankings
-- 11. DAILY_PLAYER_SUMMARIES - Daily performance summaries

-- =====================================================
-- STEP 3: SAMPLE DATA INSERTION
-- =====================================================

-- Insert admin users
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('admin', '$2a$12$LQv3c1yqBwlVHpPLFnXOyeEiX16LNyqyBzzdRAVQXBob2t3J.W2Cu', 'admin@unitepigeonclub.pk', 'Club Administrator', 'admin'),
('bewal_admin', '$2a$12$LQv3c1yqBwlVHpPLFnXOyeEiX16LNyqyBzzdRAVQXBob2t3J.W2Cu', 'bewal@unitepigeonclub.pk', 'Bewal Branch Admin', 'admin');

-- Insert a sample tournament
INSERT INTO tournaments (name, start_date, days, status, start_time, start_period, end_time, end_period, return_threshold, pigeons_per_player, helper_pigeons, special_pigeons, created_by) VALUES
('Spring High Flyer Championship 2024', '2024-05-01', 7, 'active', '06:00:00', 'AM', '18:00:00', 'PM', 8, 11, 2, 1, 1);

-- Insert tournament days
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, wind_direction) VALUES
(1, 1, '2024-05-01', 'Clear Sky', 25.5, 5.2, 'North'),
(1, 2, '2024-05-02', 'Partly Cloudy', 27.0, 3.8, 'Northeast'),
(1, 3, '2024-05-03', 'Clear Sky', 26.8, 4.1, 'East'),
(1, 4, '2024-05-04', 'Light Clouds', 24.2, 6.3, 'Southeast'),
(1, 5, '2024-05-05', 'Clear Sky', 28.1, 2.9, 'South'),
(1, 6, '2024-05-06', 'Partly Cloudy', 25.7, 4.7, 'Southwest'),
(1, 7, '2024-05-07', 'Clear Sky', 27.3, 3.5, 'West');

-- Insert sample players (fanciers)
INSERT INTO players (name, contact_number, address) VALUES
('راجہ جاوید محمد آباد', '+92-300-1234567', 'محمد آباد، بیوال، راولپنڈی'),
('چوہدری احمد علی', '+92-301-2345678', 'گلی نمبر 5، بیوال، راولپنڈی'),
('ملک محمد حسن', '+92-302-3456789', 'محلہ شاہین، بیوال، راولپنڈی'),
('استاد فاروق احمد', '+92-303-4567890', 'پرانا بازار، بیوال، راولپنڈی');

-- Link players to tournament
INSERT INTO tournament_participants (tournament_id, player_id, special_pigeon_name) VALUES
(1, 1, 'شاہین اعظم'),
(1, 2, 'بادل شاہ'),
(1, 3, 'آسمانی بادشاہ'),
(1, 4, 'اونچا پرواز');

-- =====================================================
-- STEP 4: HOW TO USE THE DATABASE
-- =====================================================

-- A. VIEWING TOURNAMENTS
SELECT 
    t.name as tournament_name,
    t.start_date,
    t.days,
    t.status,
    COUNT(tp.player_id) as total_participants
FROM tournaments t
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
GROUP BY t.id, t.name, t.start_date, t.days, t.status;

-- B. VIEWING PARTICIPANTS IN A TOURNAMENT
SELECT 
    p.name as player_name,
    p.contact_number,
    tp.special_pigeon_name,
    tp.registration_date
FROM tournament_participants tp
JOIN players p ON tp.player_id = p.id
WHERE tp.tournament_id = 1;

-- C. RECORDING PIGEON FLIGHT RESULTS
-- Example: Recording that a pigeon arrived at 14:30:00 on day 1
INSERT INTO race_results (tournament_id, day_number, pigeon_id, arrival_time, arrival_period, race_time_minutes) VALUES
(1, 1, 1, '14:30:00', 'PM', 510); -- 8.5 hours flight time

-- D. VIEWING DAILY RESULTS
SELECT 
    p.name as player_name,
    pig.name as pigeon_name,
    rr.arrival_time,
    rr.arrival_period,
    rr.race_time_minutes,
    CONCAT(FLOOR(rr.race_time_minutes/60), ':', LPAD(rr.race_time_minutes%60, 2, '0')) as flight_duration
FROM race_results rr
JOIN pigeons pig ON rr.pigeon_id = pig.id
JOIN players p ON pig.player_id = p.id
WHERE rr.tournament_id = 1 AND rr.day_number = 1
ORDER BY rr.race_time_minutes DESC;

-- E. CALCULATING TOURNAMENT RANKINGS
SELECT 
    p.name as player_name,
    COUNT(rr.id) as pigeons_returned,
    SUM(rr.race_time_minutes) as total_flight_time,
    AVG(rr.race_time_minutes) as average_flight_time,
    CONCAT(FLOOR(SUM(rr.race_time_minutes)/60), ':', LPAD(SUM(rr.race_time_minutes)%60, 2, '0')) as total_duration
FROM players p
JOIN pigeons pig ON p.id = pig.player_id
JOIN race_results rr ON pig.id = rr.pigeon_id
WHERE rr.tournament_id = 1
GROUP BY p.id, p.name
ORDER BY total_flight_time DESC;

-- F. FINDING SPECIAL TITLE HOLDERS
-- Akhri Bahadur (Longest flight time of the day)
SELECT 
    td.day_number,
    td.date,
    p.name as player_name,
    pig.name as pigeon_name,
    rr.race_time_minutes,
    CONCAT(FLOOR(rr.race_time_minutes/60), ':', LPAD(rr.race_time_minutes%60, 2, '0')) as flight_duration
FROM race_results rr
JOIN pigeons pig ON rr.pigeon_id = pig.id
JOIN players p ON pig.player_id = p.id
JOIN tournament_days td ON rr.tournament_id = td.tournament_id AND rr.day_number = td.day_number
WHERE rr.tournament_id = 1
AND rr.race_time_minutes = (
    SELECT MAX(race_time_minutes) 
    FROM race_results 
    WHERE tournament_id = 1 AND day_number = rr.day_number
)
ORDER BY td.day_number;

-- =====================================================
-- STEP 5: COMMON QUERIES FOR HIGH FLYER TOURNAMENTS
-- =====================================================

-- 1. Get tournament overview with weather conditions
SELECT 
    t.name,
    td.day_number,
    td.date,
    td.weather_conditions,
    td.temperature,
    td.wind_speed,
    td.wind_direction,
    COUNT(rr.id) as pigeons_returned
FROM tournaments t
JOIN tournament_days td ON t.id = td.tournament_id
LEFT JOIN race_results rr ON t.id = rr.tournament_id AND td.day_number = rr.day_number
WHERE t.id = 1
GROUP BY t.id, td.day_number
ORDER BY td.day_number;

-- 2. Player performance summary
SELECT 
    p.name as player_name,
    COUNT(DISTINCT rr.day_number) as days_participated,
    COUNT(rr.id) as total_pigeons_returned,
    MAX(rr.race_time_minutes) as best_flight_time,
    AVG(rr.race_time_minutes) as average_flight_time,
    SUM(rr.race_time_minutes) as total_flight_time
FROM players p
JOIN pigeons pig ON p.id = pig.player_id
LEFT JOIN race_results rr ON pig.id = rr.pigeon_id AND rr.tournament_id = 1
GROUP BY p.id, p.name
ORDER BY total_flight_time DESC;

-- 3. Daily champions (Akhri Bahadur for each day)
WITH daily_max AS (
    SELECT day_number, MAX(race_time_minutes) as max_time
    FROM race_results 
    WHERE tournament_id = 1 
    GROUP BY day_number
)
SELECT 
    rr.day_number,
    td.date,
    p.name as champion_name,
    pig.name as pigeon_name,
    rr.race_time_minutes,
    CONCAT(FLOOR(rr.race_time_minutes/60), ':', LPAD(rr.race_time_minutes%60, 2, '0')) as flight_duration
FROM race_results rr
JOIN daily_max dm ON rr.day_number = dm.day_number AND rr.race_time_minutes = dm.max_time
JOIN pigeons pig ON rr.pigeon_id = pig.id
JOIN players p ON pig.player_id = p.id
JOIN tournament_days td ON rr.tournament_id = td.tournament_id AND rr.day_number = td.day_number
WHERE rr.tournament_id = 1
ORDER BY rr.day_number;

-- =====================================================
-- STEP 6: MAINTENANCE QUERIES
-- =====================================================

-- Update tournament status
UPDATE tournaments SET status = 'completed' WHERE id = 1;

-- Add weather information for a specific day
UPDATE tournament_days 
SET weather_conditions = 'Heavy Clouds', temperature = 23.5, wind_speed = 8.2 
WHERE tournament_id = 1 AND day_number = 3;

-- Delete a tournament and all related data (CASCADE will handle related records)
-- DELETE FROM tournaments WHERE id = 1;

-- Backup important data
SELECT 'TOURNAMENTS' as table_name, COUNT(*) as record_count FROM tournaments
UNION ALL
SELECT 'PLAYERS', COUNT(*) FROM players
UNION ALL
SELECT 'PIGEONS', COUNT(*) FROM pigeons
UNION ALL
SELECT 'RACE_RESULTS', COUNT(*) FROM race_results;
