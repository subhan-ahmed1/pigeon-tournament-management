-- Seed sample data for High Flyer Pigeon Tournament System
-- Unite Pigeon Club Bewal

-- Insert sample users
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('admin', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'admin@unitepigeonclub.com', 'Club Administrator', 'admin'),
('organizer1', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'organizer@unitepigeonclub.com', 'Muhammad Ahmad', 'organizer'),
('member1', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'member1@unitepigeonclub.com', 'Ali Hassan', 'member');

-- Insert sample tournaments
INSERT INTO tournaments (name, description, start_date, end_date, location, status, created_by) VALUES
('Winter High Flyer Championship 2024', 'Annual winter championship for high flyer pigeons in Bewal region', '2024-01-15', '2024-01-19', 'Unite Pigeon Club Bewal Ground', 'completed', 1),
('Spring Festival Tournament', 'Spring season high flyer competition with special prizes', '2024-03-10', '2024-03-14', 'Bewal Sports Complex', 'active', 1),
('Summer Elite Cup', 'Elite level competition for experienced high flyer pigeons', '2024-06-01', '2024-06-05', 'Central Ground Bewal', 'upcoming', 1);

-- Insert tournament days
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, notes) VALUES
(1, 1, '2024-01-15', 'Clear Sky', 18, 5, 'Perfect conditions for high flying'),
(1, 2, '2024-01-16', 'Partly Cloudy', 20, 8, 'Good visibility, light wind'),
(1, 3, '2024-01-17', 'Clear', 22, 3, 'Excellent flying weather'),
(1, 4, '2024-01-18', 'Sunny', 19, 6, 'Ideal temperature for endurance flights'),
(1, 5, '2024-01-19', 'Clear Sky', 21, 4, 'Championship final day'),
(2, 1, '2024-03-10', 'Sunny', 25, 7, 'Spring season opener'),
(2, 2, '2024-03-11', 'Clear', 27, 5, 'Warm flying conditions'),
(2, 3, '2024-03-12', 'Partly Cloudy', 24, 9, 'Variable wind conditions'),
(2, 4, '2024-03-13', 'Sunny', 26, 6, 'Good flying weather'),
(2, 5, '2024-03-14', 'Clear Sky', 28, 4, 'Festival finale');

-- Insert sample players
INSERT INTO players (name, phone, address, city, registration_date, status) VALUES
('Muhammad Tariq', '+92-300-1234567', 'Street 5, Block A, Bewal', 'Bewal', '2024-01-01', 'active'),
('Ahmad Ali Khan', '+92-301-2345678', 'Main Road, Near Mosque, Bewal', 'Bewal', '2024-01-02', 'active'),
('Shahid Mahmood', '+92-302-3456789', 'Colony Road, House 15, Bewal', 'Bewal', '2024-01-03', 'active'),
('Nasir Hussain', '+92-303-4567890', 'Bazaar Street, Shop 8, Bewal', 'Bewal', '2024-01-04', 'active'),
('Imran Malik', '+92-304-5678901', 'Garden Town, Block B, Bewal', 'Bewal', '2024-01-05', 'active'),
('Rashid Ahmed', '+92-305-6789012', 'New Colony, Street 3, Bewal', 'Bewal', '2024-01-06', 'active'),
('Khalid Saeed', '+92-306-7890123', 'Old City, Mohalla 2, Bewal', 'Bewal', '2024-01-07', 'active'),
('Farooq Hassan', '+92-307-8901234', 'Railway Road, House 22, Bewal', 'Bewal', '2024-01-08', 'active');

-- Insert sample pigeons
INSERT INTO pigeons (player_id, name, band_number, color, breed, birth_year, gender, status) VALUES
(1, 'Shahbaz', 'PK-2023-001', 'Blue Bar', 'High Flyer', 2023, 'male', 'active'),
(1, 'Baaz', 'PK-2023-002', 'Red Bar', 'High Flyer', 2023, 'female', 'active'),
(2, 'Uqab', 'PK-2023-003', 'Black', 'High Flyer', 2023, 'male', 'active'),
(2, 'Simurgh', 'PK-2023-004', 'White', 'High Flyer', 2023, 'female', 'active'),
(3, 'Falcon', 'PK-2023-005', 'Checker', 'High Flyer', 2023, 'male', 'active'),
(3, 'Eagle', 'PK-2023-006', 'Blue', 'High Flyer', 2023, 'female', 'active'),
(4, 'Hawk', 'PK-2023-007', 'Red', 'High Flyer', 2023, 'male', 'active'),
(4, 'Kite', 'PK-2023-008', 'Brown', 'High Flyer', 2023, 'female', 'active'),
(5, 'Thunder', 'PK-2023-009', 'Grey', 'High Flyer', 2023, 'male', 'active'),
(5, 'Lightning', 'PK-2023-010', 'Silver', 'High Flyer', 2023, 'female', 'active'),
(6, 'Storm', 'PK-2023-011', 'Dark Blue', 'High Flyer', 2023, 'male', 'active'),
(6, 'Breeze', 'PK-2023-012', 'Light Blue', 'High Flyer', 2023, 'female', 'active'),
(7, 'Wind', 'PK-2023-013', 'Pied', 'High Flyer', 2023, 'male', 'active'),
(7, 'Cloud', 'PK-2023-014', 'White Bar', 'High Flyer', 2023, 'female', 'active'),
(8, 'Sky', 'PK-2023-015', 'Blue Check', 'High Flyer', 2023, 'male', 'active'),
(8, 'Star', 'PK-2023-016', 'Red Check', 'High Flyer', 2023, 'female', 'active');

-- Insert tournament participants
INSERT INTO tournament_participants (tournament_id, player_id, registration_date, status) VALUES
(1, 1, '2024-01-10', 'confirmed'),
(1, 2, '2024-01-10', 'confirmed'),
(1, 3, '2024-01-11', 'confirmed'),
(1, 4, '2024-01-11', 'confirmed'),
(1, 5, '2024-01-12', 'confirmed'),
(1, 6, '2024-01-12', 'confirmed'),
(1, 7, '2024-01-13', 'confirmed'),
(1, 8, '2024-01-13', 'confirmed'),
(2, 1, '2024-03-05', 'confirmed'),
(2, 2, '2024-03-05', 'confirmed'),
(2, 3, '2024-03-06', 'confirmed'),
(2, 4, '2024-03-06', 'confirmed'),
(2, 5, '2024-03-07', 'confirmed'),
(2, 6, '2024-03-07', 'confirmed');

-- Insert sample race results for Tournament 1
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
-- Day 1 Results
(1, 1, 1, 1, '08:00:00', '10:45:00', 165, 1200, 'none', 'Excellent performance in clear weather'),
(1, 1, 2, 1, '08:00:00', '10:30:00', 150, 1100, 'none', 'Strong flight, good endurance'),
(1, 1, 3, 2, '08:00:00', '11:15:00', 195, 1350, 'none', 'Outstanding high altitude flight'),
(1, 1, 4, 2, '08:00:00', '10:20:00', 140, 1050, 'none', 'Steady performance'),
(1, 1, 5, 3, '08:00:00', '10:55:00', 175, 1250, 'none', 'Good altitude achievement'),
(1, 1, 6, 3, '08:00:00', '10:40:00', 160, 1150, 'none', 'Consistent flight pattern'),
(1, 1, 7, 4, '08:00:00', '11:30:00', 210, 1400, 'none', 'Exceptional endurance flight'),
(1, 1, 8, 4, '08:00:00', '10:25:00', 145, 1080, 'none', 'Reliable performance'),

-- Day 2 Results
(1, 2, 1, 1, '08:30:00', '11:20:00', 170, 1220, 'light_wind', 'Good adaptation to wind conditions'),
(1, 2, 2, 1, '08:30:00', '11:05:00', 155, 1120, 'light_wind', 'Maintained good altitude'),
(1, 2, 3, 2, '08:30:00', '12:00:00', 210, 1380, 'light_wind', 'Excellent endurance despite wind'),
(1, 2, 4, 2, '08:30:00', '10:45:00', 135, 1020, 'light_wind', 'Quick return, moderate altitude'),
(1, 2, 5, 3, '08:30:00', '11:35:00', 185, 1280, 'light_wind', 'Strong performance in windy conditions'),
(1, 2, 6, 3, '08:30:00', '11:10:00', 160, 1160, 'light_wind', 'Steady flight pattern'),
(1, 2, 7, 4, '08:30:00', '12:15:00', 225, 1450, 'light_wind', 'Outstanding endurance flight'),
(1, 2, 8, 4, '08:30:00', '10:55:00', 145, 1090, 'light_wind', 'Consistent performance'),

-- Day 3 Results
(1, 3, 1, 1, '09:00:00', '11:50:00', 170, 1240, 'none', 'Excellent clear weather performance'),
(1, 3, 2, 1, '09:00:00', '11:25:00', 145, 1130, 'none', 'Good altitude maintenance'),
(1, 3, 3, 2, '09:00:00', '12:30:00', 210, 1420, 'none', 'Exceptional high altitude flight'),
(1, 3, 4, 2, '09:00:00', '11:15:00', 135, 1040, 'none', 'Quick return flight'),
(1, 3, 5, 3, '09:00:00', '12:05:00', 185, 1300, 'none', 'Strong endurance performance'),
(1, 3, 6, 3, '09:00:00', '11:40:00', 160, 1180, 'none', 'Consistent flight behavior'),
(1, 3, 7, 4, '09:00:00', '12:45:00', 225, 1480, 'none', 'Championship level performance'),
(1, 3, 8, 4, '09:00:00', '11:20:00', 140, 1100, 'none', 'Reliable flight pattern');

-- Insert daily titles for Tournament 1
INSERT INTO daily_titles (tournament_id, day_id, title_type, pigeon_id, player_id, value, notes) VALUES
-- Day 1 Titles
(1, 1, 'akhri_bahadur', 7, 4, 210, 'Longest flight duration of the day'),
(1, 1, 'pehla_bahadur', 4, 2, 140, 'First pigeon to return'),
(1, 1, 'special_champion', 3, 2, 1350, 'Highest altitude achieved'),

-- Day 2 Titles
(1, 2, 'akhri_bahadur', 7, 4, 225, 'Outstanding endurance in windy conditions'),
(1, 2, 'pehla_bahadur', 4, 2, 135, 'Fastest return despite wind'),
(1, 2, 'special_champion', 7, 4, 1450, 'Highest altitude in challenging conditions'),

-- Day 3 Titles
(1, 3, 'akhri_bahadur', 7, 4, 225, 'Consistent championship performance'),
(1, 3, 'pehla_bahadur', 4, 2, 135, 'Quick return specialist'),
(1, 3, 'special_champion', 7, 4, 1480, 'Tournament altitude record');

-- Insert overall rankings for Tournament 1
INSERT INTO rankings (tournament_id, player_id, total_points, average_flight_time, best_altitude, total_flights, rank_position) VALUES
(1, 4, 95, 200, 1480, 6, 1),
(1, 2, 88, 165, 1420, 6, 2),
(1, 3, 82, 172, 1300, 6, 3),
(1, 1, 78, 157, 1240, 6, 4);

-- Insert some results for Tournament 2 (ongoing)
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
-- Day 1 Results for Tournament 2
(2, 6, 1, 1, '07:30:00', '10:15:00', 165, 1180, 'none', 'Spring season opener - excellent start'),
(2, 6, 2, 1, '07:30:00', '10:00:00', 150, 1120, 'none', 'Good performance in warm weather'),
(2, 6, 3, 2, '07:30:00', '10:45:00', 195, 1320, 'none', 'Strong altitude performance'),
(2, 6, 4, 2, '07:30:00', '09:50:00', 140, 1080, 'none', 'Quick return flight'),
(2, 6, 5, 3, '07:30:00', '10:25:00', 175, 1220, 'none', 'Consistent spring performance'),
(2, 6, 6, 3, '07:30:00', '10:10:00', 160, 1140, 'none', 'Steady flight in warm conditions');

-- Insert daily titles for Tournament 2 Day 1
INSERT INTO daily_titles (tournament_id, day_id, title_type, pigeon_id, player_id, value, notes) VALUES
(2, 6, 'akhri_bahadur', 3, 2, 195, 'Longest flight on spring opener'),
(2, 6, 'pehla_bahadur', 4, 2, 140, 'First to return in warm weather'),
(2, 6, 'special_champion', 3, 2, 1320, 'Best altitude on opening day');
