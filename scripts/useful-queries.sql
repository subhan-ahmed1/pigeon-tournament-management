-- Useful queries for the pigeon racing tournament system

-- 1. Get tournament overview with participant count
SELECT 
    t.id,
    t.name,
    t.start_date,
    t.end_date,
    t.days_count,
    t.status,
    COUNT(DISTINCT tp.player_id) as total_players,
    COUNT(DISTINCT p.id) as total_pigeons
FROM tournaments t
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
LEFT JOIN pigeons p ON t.id = p.tournament_id
GROUP BY t.id, t.name, t.start_date, t.end_date, t.days_count, t.status
ORDER BY t.start_date DESC;

-- 2. Get daily results for a specific tournament day
SELECT 
    pl.name as player_name,
    pg.name as pigeon_name,
    pg.ring_number,
    rr.arrival_time,
    rr.arrival_period,
    rr.race_time_duration,
    rr.race_time_minutes,
    rr.position_rank
FROM race_results rr
JOIN players pl ON rr.player_id = pl.id
JOIN pigeons pg ON rr.pigeon_id = pg.id
JOIN tournament_days td ON rr.tournament_day_id = td.id
WHERE td.tournament_id = 1 AND td.day_number = 1
ORDER BY rr.race_time_minutes ASC;

-- 3. Calculate player daily totals for a specific day
SELECT 
    pl.id as player_id,
    pl.name as player_name,
    td.day_number,
    COUNT(rr.id) as returned_pigeons,
    SUM(rr.race_time_minutes) as total_time_minutes,
    AVG(rr.race_time_minutes) as average_time_minutes,
    RANK() OVER (ORDER BY SUM(rr.race_time_minutes) DESC) as daily_rank
FROM players pl
JOIN tournament_participants tp ON pl.id = tp.player_id
JOIN tournament_days td ON tp.tournament_id = td.tournament_id
LEFT JOIN race_results rr ON pl.id = rr.player_id AND td.id = rr.tournament_day_id
WHERE td.tournament_id = 1 AND td.day_number = 1
GROUP BY pl.id, pl.name, td.day_number
ORDER BY total_time_minutes DESC;

-- 4. Get tournament rankings (overall)
SELECT 
    pl.id as player_id,
    pl.name as player_name,
    COUNT(DISTINCT rr.pigeon_id) as total_returned_pigeons,
    SUM(rr.race_time_minutes) as total_race_time_minutes,
    AVG(rr.race_time_minutes) as average_time_per_pigeon,
    RANK() OVER (ORDER BY SUM(rr.race_time_minutes) DESC) as tournament_rank
FROM players pl
JOIN tournament_participants tp ON pl.id = tp.player_id
LEFT JOIN race_results rr ON pl.id = rr.player_id
WHERE tp.tournament_id = 1
GROUP BY pl.id, pl.name
ORDER BY total_race_time_minutes DESC;

-- 5. Get daily special titles
SELECT 
    dt.title_type,
    td.day_number,
    pl.name as player_name,
    pg.name as pigeon_name,
    dt.race_time_minutes
FROM daily_titles dt
JOIN tournament_days td ON dt.tournament_day_id = td.id
JOIN players pl ON dt.player_id = pl.id
JOIN pigeons pg ON dt.pigeon_id = pg.id
WHERE dt.tournament_id = 1
ORDER BY td.day_number, dt.title_type;

-- 6. Get helper pigeons for each player
SELECT 
    pl.name as player_name,
    pg.name as pigeon_name,
    pg.ring_number,
    SUM(rr.race_time_minutes) as total_time
FROM players pl
JOIN pigeons pg ON pl.id = pg.player_id
LEFT JOIN race_results rr ON pg.id = rr.pigeon_id
WHERE pg.tournament_id = 1
GROUP BY pl.id, pl.name, pg.id, pg.name, pg.ring_number
HAVING COUNT(rr.id) > 0
ORDER BY pl.id, total_time ASC;

-- 7. Get tournament statistics
SELECT 
    t.name as tournament_name,
    COUNT(DISTINCT tp.player_id) as total_players,
    COUNT(DISTINCT pg.id) as total_pigeons,
    COUNT(DISTINCT CASE WHEN rr.is_returned = TRUE THEN rr.pigeon_id END) as returned_pigeons,
    ROUND(
        (COUNT(DISTINCT CASE WHEN rr.is_returned = TRUE THEN rr.pigeon_id END) * 100.0) / 
        COUNT(DISTINCT pg.id), 2
    ) as return_percentage,
    COUNT(DISTINCT dt.id) as total_titles_awarded
FROM tournaments t
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
LEFT JOIN pigeons pg ON t.id = pg.tournament_id
LEFT JOIN race_results rr ON pg.id = rr.pigeon_id
LEFT JOIN daily_titles dt ON t.id = dt.tournament_id
WHERE t.id = 1
GROUP BY t.id, t.name;

-- 8. Get player performance breakdown by day
SELECT 
    pl.name as player_name,
    td.day_number,
    td.race_date,
    COUNT(rr.id) as pigeons_returned,
    SUM(rr.race_time_minutes) as total_day_time,
    AVG(rr.race_time_minutes) as average_day_time,
    MIN(rr.race_time_minutes) as best_pigeon_time,
    MAX(rr.race_time_minutes) as worst_pigeon_time
FROM players pl
JOIN tournament_participants tp ON pl.id = tp.player_id
JOIN tournament_days td ON tp.tournament_id = td.tournament_id
LEFT JOIN race_results rr ON pl.id = rr.player_id AND td.id = rr.tournament_day_id
WHERE tp.tournament_id = 1
GROUP BY pl.id, pl.name, td.id, td.day_number, td.race_date
ORDER BY pl.name, td.day_number;

-- 9. Find best performing pigeons across all days
SELECT 
    pl.name as player_name,
    pg.name as pigeon_name,
    pg.ring_number,
    COUNT(rr.id) as days_returned,
    SUM(rr.race_time_minutes) as total_time,
    AVG(rr.race_time_minutes) as average_time,
    MIN(rr.race_time_minutes) as best_time,
    MAX(rr.race_time_minutes) as worst_time
FROM pigeons pg
JOIN players pl ON pg.player_id = pl.id
LEFT JOIN race_results rr ON pg.id = rr.pigeon_id
WHERE pg.tournament_id = 1
GROUP BY pg.id, pl.name, pg.name, pg.ring_number
HAVING COUNT(rr.id) > 0
ORDER BY total_time DESC;

-- 10. Get tournament leaderboard with detailed stats
SELECT 
    ROW_NUMBER() OVER (ORDER BY SUM(rr.race_time_minutes) DESC) as rank_position,
    pl.name as player_name,
    COUNT(DISTINCT rr.pigeon_id) as pigeons_returned,
    COUNT(DISTINCT pg.id) as total_pigeons,
    ROUND(
        (COUNT(DISTINCT rr.pigeon_id) * 100.0) / COUNT(DISTINCT pg.id), 2
    ) as return_percentage,
    SUM(rr.race_time_minutes) as total_race_time,
    AVG(rr.race_time_minutes) as average_time_per_returned_pigeon,
    COUNT(DISTINCT dt.id) as special_titles_won
FROM players pl
JOIN tournament_participants tp ON pl.id = tp.player_id
JOIN pigeons pg ON pl.id = pg.player_id AND pg.tournament_id = tp.tournament_id
LEFT JOIN race_results rr ON pg.id = rr.pigeon_id
LEFT JOIN daily_titles dt ON pl.id = dt.player_id AND dt.tournament_id = tp.tournament_id
WHERE tp.tournament_id = 1
GROUP BY pl.id, pl.name
ORDER BY total_race_time DESC;
