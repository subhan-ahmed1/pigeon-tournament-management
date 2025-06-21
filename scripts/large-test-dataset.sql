-- Large Test Dataset for High Flyer Pigeon Tournament System
-- This script creates extensive test data to thoroughly test all functionality

-- Clear existing data (be careful in production!)
DELETE FROM daily_titles;
DELETE FROM rankings;
DELETE FROM race_results;
DELETE FROM tournament_participants;
DELETE FROM tournament_days;
DELETE FROM pigeons;
DELETE FROM players;
DELETE FROM tournaments;
DELETE FROM users;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE tournaments AUTO_INCREMENT = 1;
ALTER TABLE players AUTO_INCREMENT = 1;
ALTER TABLE pigeons AUTO_INCREMENT = 1;
ALTER TABLE tournament_days AUTO_INCREMENT = 1;
ALTER TABLE tournament_participants AUTO_INCREMENT = 1;
ALTER TABLE race_results AUTO_INCREMENT = 1;
ALTER TABLE daily_titles AUTO_INCREMENT = 1;
ALTER TABLE rankings AUTO_INCREMENT = 1;

-- Insert comprehensive user data
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('admin', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'admin@unitepigeonclub.com', 'Main Administrator', 'admin'),
('organizer1', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'organizer1@unitepigeonclub.com', 'Muhammad Ahmad Organizer', 'organizer'),
('organizer2', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'organizer2@unitepigeonclub.com', 'Ali Hassan Organizer', 'organizer'),
('subadmin1', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'subadmin1@unitepigeonclub.com', 'Shahid Mahmood SubAdmin', 'sub_admin'),
('subadmin2', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'subadmin2@unitepigeonclub.com', 'Nasir Hussain SubAdmin', 'sub_admin'),
('member1', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'member1@unitepigeonclub.com', 'Imran Malik Member', 'member'),
('member2', '$2a$12$LQv3c1yqBwLVMQwuBsbYCe.xQij0laE/JAdBng9pstm6ZA.neMBvW', 'member2@unitepigeonclub.com', 'Rashid Ahmed Member', 'member');

-- Insert comprehensive tournament data
INSERT INTO tournaments (name, description, start_date, end_date, location, status, created_by, pigeons_per_player, duration_days, early_threshold_minutes, late_threshold_minutes) VALUES
('Winter Championship 2024', 'Annual winter championship for high flyer pigeons in Bewal region with record participation', '2024-01-15', '2024-01-21', 'Unite Pigeon Club Bewal Main Ground', 'completed', 1, 4, 7, 120, 300),
('Spring Festival Tournament', 'Spring season high flyer competition with special prizes and international judges', '2024-03-10', '2024-03-16', 'Bewal Sports Complex Arena', 'completed', 1, 3, 7, 90, 240),
('Summer Elite Cup 2024', 'Elite level competition for experienced high flyer pigeons with cash prizes', '2024-06-01', '2024-06-07', 'Central Ground Bewal Stadium', 'active', 1, 5, 7, 150, 360),
('Monsoon Challenge', 'Special monsoon season tournament testing endurance in challenging weather', '2024-07-15', '2024-07-19', 'Riverside Ground Bewal', 'active', 2, 3, 5, 100, 280),
('Independence Day Special', 'Patriotic tournament celebrating Pakistan Independence Day', '2024-08-14', '2024-08-18', 'National Ground Bewal', 'upcoming', 1, 4, 5, 120, 300),
('Autumn Masters', 'Masters level tournament for veteran pigeons and experienced handlers', '2024-09-20', '2024-09-26', 'Masters Arena Bewal', 'upcoming', 2, 6, 7, 180, 420),
('Winter Preparation Cup', 'Pre-winter training tournament for conditioning pigeons', '2024-11-01', '2024-11-05', 'Training Ground Bewal', 'upcoming', 1, 2, 5, 60, 180),
('Year End Championship', 'Grand finale tournament of the year with biggest prizes', '2024-12-15', '2024-12-22', 'Championship Stadium Bewal', 'upcoming', 1, 8, 8, 200, 480);

-- Insert extensive player data from various cities
INSERT INTO players (name, phone, address, city, registration_date, status) VALUES
-- Bewal Players
('Muhammad Tariq Khan', '+92-300-1234567', 'Street 5, Block A, Model Town', 'Bewal', '2024-01-01', 'active'),
('Ahmad Ali Shah', '+92-301-2345678', 'Main Road, Near Central Mosque', 'Bewal', '2024-01-02', 'active'),
('Shahid Mahmood Butt', '+92-302-3456789', 'Colony Road, House 15, Green Valley', 'Bewal', '2024-01-03', 'active'),
('Nasir Hussain Malik', '+92-303-4567890', 'Bazaar Street, Shop Complex 8', 'Bewal', '2024-01-04', 'active'),
('Imran Malik Chaudhry', '+92-304-5678901', 'Garden Town, Block B, Phase 2', 'Bewal', '2024-01-05', 'active'),
('Rashid Ahmed Qureshi', '+92-305-6789012', 'New Colony, Street 3, Sector 1', 'Bewal', '2024-01-06', 'active'),
('Khalid Saeed Awan', '+92-306-7890123', 'Old City, Mohalla 2, Heritage Area', 'Bewal', '2024-01-07', 'active'),
('Farooq Hassan Bhatti', '+92-307-8901234', 'Railway Road, House 22, Station Area', 'Bewal', '2024-01-08', 'active'),
('Zafar Iqbal Sheikh', '+92-308-9012345', 'University Road, Villa 12', 'Bewal', '2024-01-09', 'active'),
('Asif Mehmood Raja', '+92-309-0123456', 'Commercial Area, Plaza 5', 'Bewal', '2024-01-10', 'active'),

-- Rawalpindi Players
('Sohail Ahmad Khan', '+92-310-1234567', 'Satellite Town, Block C', 'Rawalpindi', '2024-01-11', 'active'),
('Tariq Mehmood Gill', '+92-311-2345678', 'Saddar Bazaar, Shop 45', 'Rawalpindi', '2024-01-12', 'active'),
('Naveed Hassan Butt', '+92-312-3456789', 'Westridge, House 78', 'Rawalpindi', '2024-01-13', 'active'),
('Kamran Ali Shah', '+92-313-4567890', 'Committee Chowk, Building 12', 'Rawalpindi', '2024-01-14', 'active'),
('Waseem Akram Malik', '+92-314-5678901', 'Morgah, Street 15', 'Rawalpindi', '2024-01-15', 'active'),

-- Islamabad Players
('Faisal Ahmed Siddiqui', '+92-315-6789012', 'F-10 Markaz, House 234', 'Islamabad', '2024-01-16', 'active'),
('Bilal Hassan Qureshi', '+92-316-7890123', 'G-9 Sector, Plot 567', 'Islamabad', '2024-01-17', 'active'),
('Usman Ghani Awan', '+92-317-8901234', 'I-8 Area, Villa 89', 'Islamabad', '2024-01-18', 'active'),
('Adnan Malik Sheikh', '+92-318-9012345', 'Blue Area, Office Complex', 'Islamabad', '2024-01-19', 'active'),
('Hamza Ali Bhatti', '+92-319-0123456', 'DHA Phase 2, House 123', 'Islamabad', '2024-01-20', 'active'),

-- Lahore Players
('Omer Farooq Chaudhry', '+92-320-1234567', 'Model Town, Block J', 'Lahore', '2024-01-21', 'active'),
('Saad Ahmed Butt', '+92-321-2345678', 'Gulberg, Main Boulevard', 'Lahore', '2024-01-22', 'active'),
('Hassan Ali Malik', '+92-322-3456789', 'DHA Phase 5, Y Block', 'Lahore', '2024-01-23', 'active'),
('Waqas Ahmad Shah', '+92-323-4567890', 'Johar Town, H Block', 'Lahore', '2024-01-24', 'active'),
('Fahad Hussain Raja', '+92-324-5678901', 'Cantt Area, Mall Road', 'Lahore', '2024-01-25', 'active'),

-- Karachi Players
('Kashif Ali Qureshi', '+92-325-6789012', 'Clifton, Block 8', 'Karachi', '2024-01-26', 'active'),
('Rizwan Ahmed Sheikh', '+92-326-7890123', 'Gulshan-e-Iqbal, Block 13', 'Karachi', '2024-01-27', 'active'),
('Shoaib Hassan Malik', '+92-327-8901234', 'North Nazimabad, Block L', 'Karachi', '2024-01-28', 'active'),
('Junaid Ahmad Bhatti', '+92-328-9012345', 'Defence Phase 6, Street 12', 'Karachi', '2024-01-29', 'active'),
('Mohsin Ali Awan', '+92-329-0123456', 'Korangi, Sector 31', 'Karachi', '2024-01-30', 'active');

-- Insert extensive pigeon data with varied characteristics
INSERT INTO pigeons (player_id, name, band_number, color, breed, birth_year, gender, status) VALUES
-- Player 1 Pigeons (Muhammad Tariq Khan)
(1, 'Shahbaz-e-Azam', 'PK-2023-001', 'Blue Bar', 'High Flyer', 2023, 'male', 'active'),
(1, 'Baaz-e-Kohsar', 'PK-2023-002', 'Red Bar', 'High Flyer', 2023, 'female', 'active'),
(1, 'Simurgh-e-Pak', 'PK-2023-003', 'Checker Blue', 'High Flyer', 2023, 'male', 'active'),
(1, 'Uqab-e-Mashriq', 'PK-2023-004', 'White Bar', 'High Flyer', 2023, 'female', 'active'),
(1, 'Falcon-e-Hind', 'PK-2023-005', 'Black', 'High Flyer', 2022, 'male', 'active'),
(1, 'Eagle-e-Punjab', 'PK-2023-006', 'Silver', 'High Flyer', 2022, 'female', 'active'),

-- Player 2 Pigeons (Ahmad Ali Shah)
(2, 'Thunder-Storm', 'PK-2023-007', 'Dark Blue', 'High Flyer', 2023, 'male', 'active'),
(2, 'Lightning-Strike', 'PK-2023-008', 'Light Blue', 'High Flyer', 2023, 'female', 'active'),
(2, 'Wind-Rider', 'PK-2023-009', 'Pied', 'High Flyer', 2023, 'male', 'active'),
(2, 'Cloud-Walker', 'PK-2023-010', 'White Check', 'High Flyer', 2023, 'female', 'active'),
(2, 'Sky-Master', 'PK-2023-011', 'Blue Check', 'High Flyer', 2022, 'male', 'active'),

-- Player 3 Pigeons (Shahid Mahmood Butt)
(3, 'Star-Gazer', 'PK-2023-012', 'Red Check', 'High Flyer', 2023, 'female', 'active'),
(3, 'Moon-Light', 'PK-2023-013', 'Yellow', 'High Flyer', 2023, 'male', 'active'),
(3, 'Sun-Shine', 'PK-2023-014', 'Cream', 'High Flyer', 2023, 'female', 'active'),
(3, 'Night-Hawk', 'PK-2023-015', 'Black Bar', 'High Flyer', 2022, 'male', 'active'),
(3, 'Dawn-Breaker', 'PK-2023-016', 'Grey Bar', 'High Flyer', 2022, 'female', 'active'),

-- Player 4 Pigeons (Nasir Hussain Malik)
(4, 'Fire-Bird', 'PK-2023-017', 'Red', 'High Flyer', 2023, 'male', 'active'),
(4, 'Ice-Wing', 'PK-2023-018', 'White', 'High Flyer', 2023, 'female', 'active'),
(4, 'Storm-Chaser', 'PK-2023-019', 'Grey', 'High Flyer', 2023, 'male', 'active'),
(4, 'Rain-Dancer', 'PK-2023-020', 'Blue', 'High Flyer', 2023, 'female', 'active'),

-- Player 5 Pigeons (Imran Malik Chaudhry)
(5, 'Golden-Eagle', 'PK-2023-021', 'Gold', 'High Flyer', 2023, 'male', 'active'),
(5, 'Silver-Hawk', 'PK-2023-022', 'Silver', 'High Flyer', 2023, 'female', 'active'),
(5, 'Bronze-Wing', 'PK-2023-023', 'Bronze', 'High Flyer', 2023, 'male', 'active'),
(5, 'Diamond-Flyer', 'PK-2023-024', 'White Diamond', 'High Flyer', 2022, 'female', 'active'),
(5, 'Ruby-Soarer', 'PK-2023-025', 'Red Ruby', 'High Flyer', 2022, 'male', 'active'),

-- Continue with more players and pigeons...
-- Player 6 Pigeons (Rashid Ahmed Qureshi)
(6, 'Mountain-King', 'PK-2023-026', 'Brown', 'High Flyer', 2023, 'male', 'active'),
(6, 'Valley-Queen', 'PK-2023-027', 'Light Brown', 'High Flyer', 2023, 'female', 'active'),
(6, 'River-Runner', 'PK-2023-028', 'Blue Grey', 'High Flyer', 2023, 'male', 'active'),
(6, 'Forest-Flyer', 'PK-2023-029', 'Green Tint', 'High Flyer', 2022, 'female', 'active'),

-- Player 7 Pigeons (Khalid Saeed Awan)
(7, 'Desert-Storm', 'PK-2023-030', 'Sand', 'High Flyer', 2023, 'male', 'active'),
(7, 'Ocean-Wave', 'PK-2023-031', 'Sea Blue', 'High Flyer', 2023, 'female', 'active'),
(7, 'Prairie-Wind', 'PK-2023-032', 'Wheat', 'High Flyer', 2023, 'male', 'active'),
(7, 'Meadow-Lark', 'PK-2023-033', 'Green', 'High Flyer', 2022, 'female', 'active'),

-- Player 8 Pigeons (Farooq Hassan Bhatti)
(8, 'Comet-Tail', 'PK-2023-034', 'Streaked', 'High Flyer', 2023, 'male', 'active'),
(8, 'Meteor-Shower', 'PK-2023-035', 'Spotted', 'High Flyer', 2023, 'female', 'active'),
(8, 'Galaxy-Rider', 'PK-2023-036', 'Multi-Color', 'High Flyer', 2023, 'male', 'active'),
(8, 'Nebula-Dancer', 'PK-2023-037', 'Purple Tint', 'High Flyer', 2022, 'female', 'active'),

-- Add pigeons for remaining players (9-25)
(9, 'Alpha-Leader', 'PK-2023-038', 'Dominant Blue', 'High Flyer', 2023, 'male', 'active'),
(9, 'Beta-Follower', 'PK-2023-039', 'Soft Blue', 'High Flyer', 2023, 'female', 'active'),
(9, 'Gamma-Warrior', 'PK-2023-040', 'Steel Blue', 'High Flyer', 2022, 'male', 'active'),

(10, 'Delta-Force', 'PK-2023-041', 'Military Green', 'High Flyer', 2023, 'male', 'active'),
(10, 'Echo-Sound', 'PK-2023-042', 'Sound Wave', 'High Flyer', 2023, 'female', 'active'),
(10, 'Foxtrot-Dance', 'PK-2023-043', 'Dancing Pattern', 'High Flyer', 2022, 'male', 'active'),

-- Continue for players 11-25 with 2-3 pigeons each
(11, 'Rawalpindi-Pride', 'PK-2023-044', 'City Blue', 'High Flyer', 2023, 'male', 'active'),
(11, 'Pindi-Beauty', 'PK-2023-045', 'Urban Grey', 'High Flyer', 2023, 'female', 'active'),

(12, 'Saddar-Champion', 'PK-2023-046', 'Market Brown', 'High Flyer', 2023, 'male', 'active'),
(12, 'Bazaar-Queen', 'PK-2023-047', 'Trade Gold', 'High Flyer', 2023, 'female', 'active'),

(13, 'Westridge-King', 'PK-2023-048', 'Hill Green', 'High Flyer', 2023, 'male', 'active'),
(13, 'Ridge-Runner', 'PK-2023-049', 'Mountain Blue', 'High Flyer', 2022, 'female', 'active'),

(14, 'Committee-Chief', 'PK-2023-050', 'Official Blue', 'High Flyer', 2023, 'male', 'active'),
(14, 'Chowk-Princess', 'PK-2023-051', 'Royal Purple', 'High Flyer', 2023, 'female', 'active'),

(15, 'Morgah-Master', 'PK-2023-052', 'Suburb Green', 'High Flyer', 2023, 'male', 'active'),
(15, 'Area-Angel', 'PK-2023-053', 'Peaceful White', 'High Flyer', 2022, 'female', 'active'),

-- Islamabad Players (16-20)
(16, 'Capital-Crown', 'PK-2023-054', 'Federal Blue', 'High Flyer', 2023, 'male', 'active'),
(16, 'F10-Flyer', 'PK-2023-055', 'Sector Silver', 'High Flyer', 2023, 'female', 'active'),

(17, 'G9-Guardian', 'PK-2023-056', 'Zone Gold', 'High Flyer', 2023, 'male', 'active'),
(17, 'Sector-Star', 'PK-2023-057', 'Plot Platinum', 'High Flyer', 2022, 'female', 'active'),

(18, 'I8-Icon', 'PK-2023-058', 'Area Azure', 'High Flyer', 2023, 'male', 'active'),
(18, 'Villa-Victor', 'PK-2023-059', 'Residential Red', 'High Flyer', 2023, 'female', 'active'),

(19, 'Blue-Area-Boss', 'PK-2023-060', 'Business Blue', 'High Flyer', 2023, 'male', 'active'),
(19, 'Office-Olympian', 'PK-2023-061', 'Corporate Grey', 'High Flyer', 2022, 'female', 'active'),

(20, 'DHA-Defender', 'PK-2023-062', 'Defense Green', 'High Flyer', 2023, 'male', 'active'),
(20, 'Phase-Phoenix', 'PK-2023-063', 'Premium Purple', 'High Flyer', 2023, 'female', 'active'),

-- Lahore Players (21-25)
(21, 'Model-Monarch', 'PK-2023-064', 'Town Teal', 'High Flyer', 2023, 'male', 'active'),
(21, 'Block-Beauty', 'PK-2023-065', 'J-Block Jade', 'High Flyer', 2023, 'female', 'active'),

(22, 'Gulberg-Giant', 'PK-2023-066', 'Boulevard Blue', 'High Flyer', 2023, 'male', 'active'),
(22, 'Main-Majesty', 'PK-2023-067', 'Central Crimson', 'High Flyer', 2022, 'female', 'active'),

(23, 'DHA-Dynasty', 'PK-2023-068', 'Phase-5 Pink', 'High Flyer', 2023, 'male', 'active'),
(23, 'Y-Block-Yacht', 'PK-2023-069', 'Elite Emerald', 'High Flyer', 2023, 'female', 'active'),

(24, 'Johar-Jewel', 'PK-2023-070', 'Town Turquoise', 'High Flyer', 2023, 'male', 'active'),
(24, 'H-Block-Hero', 'PK-2023-071', 'Residential Ruby', 'High Flyer', 2022, 'female', 'active'),

(25, 'Cantt-Captain', 'PK-2023-072', 'Mall Maroon', 'High Flyer', 2023, 'male', 'active'),
(25, 'Road-Royalty', 'PK-2023-073', 'Military Mint', 'High Flyer', 2023, 'female', 'active');

-- Insert tournament days for all tournaments
-- Tournament 1: Winter Championship 2024 (7 days)
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, notes) VALUES
(1, 1, '2024-01-15', 'Clear Sky', 18, 5, 'Perfect opening day conditions'),
(1, 2, '2024-01-16', 'Partly Cloudy', 20, 8, 'Good visibility with light breeze'),
(1, 3, '2024-01-17', 'Clear', 22, 3, 'Excellent flying weather continues'),
(1, 4, '2024-01-18', 'Sunny', 19, 6, 'Ideal temperature for endurance'),
(1, 5, '2024-01-19', 'Clear Sky', 21, 4, 'Championship momentum building'),
(1, 6, '2024-01-20', 'Bright', 23, 7, 'Warm conditions favor high altitude'),
(1, 7, '2024-01-21', 'Perfect', 20, 5, 'Grand finale weather');

-- Tournament 2: Spring Festival Tournament (7 days)
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, notes) VALUES
(2, 1, '2024-03-10', 'Sunny', 25, 7, 'Spring season opener with warmth'),
(2, 2, '2024-03-11', 'Clear', 27, 5, 'Rising temperatures ideal for flight'),
(2, 3, '2024-03-12', 'Partly Cloudy', 24, 9, 'Variable conditions test adaptability'),
(2, 4, '2024-03-13', 'Sunny', 26, 6, 'Consistent spring weather'),
(2, 5, '2024-03-14', 'Clear Sky', 28, 4, 'Festival atmosphere with perfect sky'),
(2, 6, '2024-03-15', 'Bright', 29, 8, 'Peak spring conditions'),
(2, 7, '2024-03-16', 'Excellent', 27, 6, 'Festival finale celebration');

-- Tournament 3: Summer Elite Cup 2024 (7 days) - ACTIVE
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, notes) VALUES
(3, 1, '2024-06-01', 'Hot & Clear', 32, 6, 'Summer heat challenges begin'),
(3, 2, '2024-06-02', 'Very Sunny', 34, 4, 'Intense heat tests endurance'),
(3, 3, '2024-06-03', 'Clear & Hot', 33, 8, 'Elite level heat management'),
(3, 4, '2024-06-04', 'Scorching', 35, 5, 'Peak summer conditions'),
(3, 5, '2024-06-05', 'Hot', 32, 7, 'Sustained high temperatures'),
(3, 6, '2024-06-06', 'Clear', 31, 6, 'Slightly cooler but still challenging'),
(3, 7, '2024-06-07', 'Sunny', 33, 5, 'Elite cup finale heat');

-- Tournament 4: Monsoon Challenge (5 days) - ACTIVE
INSERT INTO tournament_days (tournament_id, day_number, date, weather_conditions, temperature, wind_speed, notes) VALUES
(4, 1, '2024-07-15', 'Humid', 28, 12, 'Monsoon season humidity begins'),
(4, 2, '2024-07-16', 'Light Rain', 26, 15, 'Challenging wet conditions'),
(4, 3, '2024-07-17', 'Overcast', 27, 10, 'Cloud cover affects visibility'),
(4, 4, '2024-07-18', 'Drizzle', 25, 18, 'Persistent light precipitation'),
(4, 5, '2024-07-19', 'Clearing', 29, 8, 'Weather improving for finale');

-- Insert tournament participants for completed and active tournaments
-- Tournament 1 participants (Winter Championship) - 15 players
INSERT INTO tournament_participants (tournament_id, player_id, registration_date, status) VALUES
(1, 1, '2024-01-10', 'confirmed'), (1, 2, '2024-01-10', 'confirmed'), (1, 3, '2024-01-11', 'confirmed'),
(1, 4, '2024-01-11', 'confirmed'), (1, 5, '2024-01-12', 'confirmed'), (1, 6, '2024-01-12', 'confirmed'),
(1, 7, '2024-01-13', 'confirmed'), (1, 8, '2024-01-13', 'confirmed'), (1, 9, '2024-01-14', 'confirmed'),
(1, 10, '2024-01-14', 'confirmed'), (1, 11, '2024-01-15', 'confirmed'), (1, 12, '2024-01-15', 'confirmed'),
(1, 13, '2024-01-16', 'confirmed'), (1, 14, '2024-01-16', 'confirmed'), (1, 15, '2024-01-17', 'confirmed');

-- Tournament 2 participants (Spring Festival) - 12 players
INSERT INTO tournament_participants (tournament_id, player_id, registration_date, status) VALUES
(2, 1, '2024-03-05', 'confirmed'), (2, 2, '2024-03-05', 'confirmed'), (2, 3, '2024-03-06', 'confirmed'),
(2, 4, '2024-03-06', 'confirmed'), (2, 5, '2024-03-07', 'confirmed'), (2, 6, '2024-03-07', 'confirmed'),
(2, 16, '2024-03-08', 'confirmed'), (2, 17, '2024-03-08', 'confirmed'), (2, 18, '2024-03-09', 'confirmed'),
(2, 19, '2024-03-09', 'confirmed'), (2, 20, '2024-03-10', 'confirmed'), (2, 21, '2024-03-10', 'confirmed');

-- Tournament 3 participants (Summer Elite Cup) - 10 players
INSERT INTO tournament_participants (tournament_id, player_id, registration_date, status) VALUES
(3, 7, '2024-05-25', 'confirmed'), (3, 8, '2024-05-25', 'confirmed'), (3, 9, '2024-05-26', 'confirmed'),
(3, 10, '2024-05-26', 'confirmed'), (3, 22, '2024-05-27', 'confirmed'), (3, 23, '2024-05-27', 'confirmed'),
(3, 24, '2024-05-28', 'confirmed'), (3, 25, '2024-05-28', 'confirmed'), (3, 11, '2024-05-29', 'confirmed'),
(3, 12, '2024-05-29', 'confirmed');

-- Tournament 4 participants (Monsoon Challenge) - 8 players
INSERT INTO tournament_participants (tournament_id, player_id, registration_date, status) VALUES
(4, 13, '2024-07-10', 'confirmed'), (4, 14, '2024-07-10', 'confirmed'), (4, 15, '2024-07-11', 'confirmed'),
(4, 16, '2024-07-11', 'confirmed'), (4, 17, '2024-07-12', 'confirmed'), (4, 18, '2024-07-12', 'confirmed'),
(4, 19, '2024-07-13', 'confirmed'), (4, 20, '2024-07-13', 'confirmed');

-- Insert comprehensive race results for Tournament 1 (Winter Championship) - COMPLETED
-- This will be extensive with all 7 days and 15 players with multiple pigeons each

-- Day 1 Results (Tournament 1)
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
-- Player 1 pigeons
(1, 1, 1, 1, '08:00:00', '10:45:00', 165, 1200, 'none', 'Excellent opening performance'),
(1, 1, 2, 1, '08:00:00', '10:30:00', 150, 1100, 'none', 'Strong consistent flight'),
(1, 1, 3, 1, '08:00:00', '11:15:00', 195, 1350, 'none', 'Outstanding altitude achievement'),
(1, 1, 4, 1, '08:00:00', '10:20:00', 140, 1050, 'none', 'Quick return specialist'),
-- Player 2 pigeons
(1, 1, 7, 2, '08:00:00', '11:30:00', 210, 1400, 'none', 'Exceptional endurance display'),
(1, 1, 8, 2, '08:00:00', '10:25:00', 145, 1080, 'none', 'Reliable performance'),
(1, 1, 9, 2, '08:00:00', '10:55:00', 175, 1250, 'none', 'Good altitude maintenance'),
-- Player 3 pigeons
(1, 1, 12, 3, '08:00:00', '10:40:00', 160, 1150, 'none', 'Steady flight pattern'),
(1, 1, 13, 3, '08:00:00', '11:20:00', 200, 1380, 'none', 'Impressive endurance'),
(1, 1, 14, 3, '08:00:00', '10:35:00', 155, 1120, 'none', 'Consistent performer'),
-- Continue with more players...
(1, 1, 17, 4, '08:00:00', '11:45:00', 225, 1450, 'none', 'Day 1 endurance champion'),
(1, 1, 18, 4, '08:00:00', '10:15:00', 135, 1020, 'none', 'Fastest return of the day'),
(1, 1, 21, 5, '08:00:00', '11:10:00', 190, 1320, 'none', 'Golden performance'),
(1, 1, 22, 5, '08:00:00', '10:50:00', 170, 1180, 'none', 'Silver standard flight'),
(1, 1, 26, 6, '08:00:00', '11:25:00', 205, 1360, 'none', 'Mountain king soars high'),
(1, 1, 27, 6, '08:00:00', '10:45:00', 165, 1140, 'none', 'Valley queen graceful'),
(1, 1, 30, 7, '08:00:00', '11:35:00', 215, 1420, 'none', 'Desert storm power'),
(1, 1, 31, 7, '08:00:00', '10:55:00', 175, 1200, 'none', 'Ocean wave smooth'),
(1, 1, 34, 8, '08:00:00', '11:50:00', 230, 1480, 'none', 'Comet tail spectacular'),
(1, 1, 35, 8, '08:00:00', '10:40:00', 160, 1160, 'none', 'Meteor shower steady');

-- Continue with Day 2-7 results for Tournament 1 (abbreviated for space)
-- Day 2 Results
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
(1, 2, 1, 1, '08:30:00', '11:20:00', 170, 1220, 'light_wind', 'Adapting well to conditions'),
(1, 2, 2, 1, '08:30:00', '11:05:00', 155, 1120, 'light_wind', 'Maintaining consistency'),
(1, 2, 7, 2, '08:30:00', '12:00:00', 210, 1380, 'light_wind', 'Endurance in wind'),
(1, 2, 8, 2, '08:30:00', '10:45:00', 135, 1020, 'light_wind', 'Quick return despite wind'),
(1, 2, 17, 4, '08:30:00', '12:15:00', 225, 1450, 'light_wind', 'Consistent champion'),
(1, 2, 34, 8, '08:30:00', '12:30:00', 240, 1500, 'light_wind', 'New altitude record');

-- Insert daily titles for Tournament 1
INSERT INTO daily_titles (tournament_id, day_id, title_type, pigeon_id, player_id, value, notes) VALUES
-- Day 1 titles
(1, 1, 'akhri_bahadur', 34, 8, 230, 'Longest flight duration day 1'),
(1, 1, 'pehla_bahadur', 18, 4, 135, 'First pigeon to return day 1'),
(1, 1, 'special_champion', 34, 8, 1480, 'Highest altitude day 1'),
-- Day 2 titles
(1, 2, 'akhri_bahadur', 34, 8, 240, 'Consistent endurance leader'),
(1, 2, 'pehla_bahadur', 8, 2, 135, 'Speed champion day 2'),
(1, 2, 'special_champion', 34, 8, 1500, 'New tournament altitude record');

-- Insert comprehensive results for Tournament 2 (Spring Festival) - COMPLETED
-- Day 1 Results for Tournament 2
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
(2, 8, 1, 1, '07:30:00', '10:15:00', 165, 1180, 'none', 'Spring opener excellence'),
(2, 8, 2, 1, '07:30:00', '10:00:00', 150, 1120, 'none', 'Warm weather adaptation'),
(2, 8, 7, 2, '07:30:00', '10:45:00', 195, 1320, 'none', 'Strong spring performance'),
(2, 8, 8, 2, '07:30:00', '09:50:00', 140, 1080, 'none', 'Quick spring return'),
(2, 8, 54, 16, '07:30:00', '10:25:00', 175, 1220, 'none', 'Capital performance'),
(2, 8, 55, 16, '07:30:00', '10:10:00', 160, 1140, 'none', 'Federal consistency'),
(2, 8, 64, 21, '07:30:00', '10:35:00', 185, 1280, 'none', 'Lahore excellence');

-- Insert some results for Tournament 3 (Summer Elite Cup) - ACTIVE
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
(3, 15, 30, 7, '06:30:00', '09:45:00', 195, 1150, 'heat_stress', 'Excellent heat management'),
(3, 15, 31, 7, '06:30:00', '09:20:00', 170, 1080, 'heat_stress', 'Quick return in heat'),
(3, 15, 34, 8, '06:30:00', '10:15:00', 225, 1280, 'heat_stress', 'Elite endurance in summer'),
(3, 15, 66, 22, '06:30:00', '09:35:00', 185, 1120, 'heat_stress', 'Lahore heat specialist'),
(3, 15, 68, 23, '06:30:00', '09:50:00', 200, 1200, 'heat_stress', 'DHA elite performance');

-- Insert overall rankings for completed tournaments
INSERT INTO rankings (tournament_id, player_id, total_points, average_flight_time, best_altitude, total_flights, rank_position) VALUES
-- Tournament 1 Rankings (Winter Championship)
(1, 8, 98, 235, 1500, 14, 1),
(1, 4, 95, 200, 1450, 14, 2),
(1, 2, 88, 175, 1380, 21, 3),
(1, 3, 85, 172, 1380, 21, 4),
(1, 1, 82, 165, 1350, 28, 5),
(1, 7, 80, 195, 1420, 14, 6),
(1, 6, 78, 185, 1360, 14, 7),
(1, 5, 75, 180, 1320, 14, 8),
(1, 9, 72, 170, 1280, 21, 9),
(1, 10, 70, 165, 1260, 21, 10),

-- Tournament 2 Rankings (Spring Festival)
(2, 21, 92, 185, 1280, 21, 1),
(2, 16, 88, 167, 1220, 14, 2),
(2, 2, 85, 167, 1320, 21, 3),
(2, 1, 82, 157, 1180, 14, 4),
(2, 17, 80, 175, 1240, 14, 5),
(2, 18, 78, 170, 1200, 14, 6);

-- Insert daily titles for more tournaments
INSERT INTO daily_titles (tournament_id, day_id, title_type, pigeon_id, player_id, value, notes) VALUES
-- Tournament 2 Day 1 titles
(2, 8, 'akhri_bahadur', 7, 2, 195, 'Spring endurance champion'),
(2, 8, 'pehla_bahadur', 8, 2, 140, 'Spring speed specialist'),
(2, 8, 'special_champion', 7, 2, 1320, 'Spring altitude master'),

-- Tournament 3 Day 1 titles (Summer Elite Cup)
(3, 15, 'akhri_bahadur', 34, 8, 225, 'Summer heat endurance'),
(3, 15, 'pehla_bahadur', 31, 7, 170, 'Heat adaptation specialist'),
(3, 15, 'special_champion', 34, 8, 1280, 'Summer altitude achievement');

-- Add more race results to make dataset comprehensive
-- Additional results for Tournament 1 Days 3-7 (sample)
INSERT INTO race_results (tournament_id, day_id, pigeon_id, player_id, release_time, landing_time, flight_duration_minutes, altitude_reached, weather_impact, notes) VALUES
-- Day 3
(1, 3, 34, 8, '09:00:00', '12:45:00', 225, 1520, 'none', 'New tournament record'),
(1, 3, 17, 4, '09:00:00', '12:30:00', 210, 1480, 'none', 'Consistent excellence'),
(1, 3, 7, 2, '09:00:00', '12:15:00', 195, 1420, 'none', 'Maintaining high standards'),
-- Day 4
(1, 4, 34, 8, '09:30:00', '13:00:00', 210, 1500, 'none', 'Sustained performance'),
(1, 4, 17, 4, '09:30:00', '12:45:00', 195, 1460, 'none', 'Championship consistency'),
-- Day 5
(1, 5, 34, 8, '10:00:00', '13:30:00', 210, 1510, 'none', 'Final push excellence'),
(1, 5, 17, 4, '10:00:00', '13:15:00', 195, 1470, 'none', 'Strong finish');

COMMIT;
