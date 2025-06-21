# Unite Pigeon Club Bewal - Database Usage Guide

## Overview
This database is designed specifically for managing high flyer pigeon tournaments in Pakistan. It tracks flight durations, altitudes, and endurance rather than racing speeds.

## Database Setup Steps

### 1. Choose Your Database System
- **MySQL** (Recommended for beginners)
- **PostgreSQL** (More advanced features)
- **SQLite** (For small clubs)

### 2. Run the Setup Scripts
Execute these scripts in order:
1. `create-database-schema.sql` - Creates all tables
2. `seed-sample-data.sql` - Adds sample data
3. `database-setup-guide.sql` - Additional examples

### 3. Connect Your Application
Update your application's database connection settings:

\`\`\`javascript
// For MySQL
const connection = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'unite_pigeon_club_bewal'
}

// For PostgreSQL
const connection = {
  host: 'localhost',
  port: 5432,
  user: 'your_username',
  password: 'your_password',
  database: 'unite_pigeon_club_bewal'
}
\`\`\`

## Key Features for High Flyer Tournaments

### 1. Tournament Management
- Multi-day tournaments (1-30 days)
- Weather tracking for each day
- Participant registration
- Special pigeon categories

### 2. Flight Tracking
- **Arrival Time**: When pigeons return
- **Flight Duration**: Total time in air
- **Release Time**: When pigeons were released
- **Weather Conditions**: Impact on performance

### 3. Special Titles
- **Akhri Bahadur (آخری بہادر)**: Longest flight of the day
- **Pehla Bahadur (پہلا بہادر)**: Best performing first pigeon
- **Special Champion**: Best special pigeon overall

### 4. Rankings System
- Total flight time across all days
- Return percentage
- Daily performance tracking
- Helper pigeon exclusions

## Common Operations

### Adding a New Tournament
\`\`\`sql
INSERT INTO tournaments (name, start_date, days, status, start_time, start_period, end_time, end_period, return_threshold, pigeons_per_player, helper_pigeons, special_pigeons, created_by) 
VALUES ('Summer Championship 2024', '2024-07-01', 5, 'upcoming', '06:00:00', 'AM', '18:00:00', 'PM', 8, 11, 2, 1, 1);
\`\`\`

### Registering a Player
\`\`\`sql
-- Add player
INSERT INTO players (name, contact_number, address) 
VALUES ('نیا کھلاڑی', '+92-300-0000000', 'بیوال، راولپنڈی');

-- Register for tournament
INSERT INTO tournament_participants (tournament_id, player_id, special_pigeon_name) 
VALUES (1, LAST_INSERT_ID(), 'میرا خاص کبوتر');
\`\`\`

### Recording Flight Results
\`\`\`sql
-- Record pigeon arrival
INSERT INTO race_results (tournament_id, day_number, pigeon_id, arrival_time, arrival_period, race_time_minutes) 
VALUES (1, 1, 5, '15:30:00', 'PM', 570); -- 9.5 hours flight
\`\`\`

### Getting Tournament Results
\`\`\`sql
-- Daily rankings
SELECT 
    p.name,
    COUNT(rr.id) as pigeons_returned,
    SUM(rr.race_time_minutes) as total_minutes,
    CONCAT(FLOOR(SUM(rr.race_time_minutes)/60), ':', LPAD(SUM(rr.race_time_minutes)%60, 2, '0')) as total_time
FROM players p
JOIN pigeons pig ON p.id = pig.player_id
LEFT JOIN race_results rr ON pig.id = rr.pigeon_id AND rr.tournament_id = 1 AND rr.day_number = 1
GROUP BY p.id
ORDER BY total_minutes DESC;
\`\`\`

## Data Migration from Current System

If you're currently using localStorage (like in your current app), you can migrate data:

### 1. Export Current Data
\`\`\`javascript
// In browser console
const tournaments = JSON.parse(localStorage.getItem('tournaments'));
console.log(JSON.stringify(tournaments, null, 2));
\`\`\`

### 2. Convert to SQL
\`\`\`sql
-- Example conversion
INSERT INTO tournaments (name, start_date, days, status, start_time, start_period, end_time, end_period, return_threshold, pigeons_per_player, helper_pigeons, special_pigeons) 
VALUES ('Spring Championship 2024', '2024-05-24', 15, 'active', '06:00:00', 'AM', '07:00:00', 'PM', 50, 11, 3, 1);
\`\`\`

## Backup and Maintenance

### Daily Backup
\`\`\`bash
# MySQL
mysqldump -u username -p unite_pigeon_club_bewal > backup_$(date +%Y%m%d).sql

# PostgreSQL
pg_dump -U username unite_pigeon_club_bewal > backup_$(date +%Y%m%d).sql
\`\`\`

### Performance Optimization
\`\`\`sql
-- Add indexes for better performance
CREATE INDEX idx_race_results_tournament_day ON race_results(tournament_id, day_number);
CREATE INDEX idx_race_results_pigeon ON race_results(pigeon_id);
CREATE INDEX idx_pigeons_player ON pigeons(player_id);
\`\`\`

## Security Considerations

1. **User Authentication**: Use strong password hashing
2. **Data Validation**: Validate all inputs
3. **Access Control**: Implement role-based permissions
4. **Regular Backups**: Schedule automatic backups
5. **SSL/TLS**: Use encrypted connections

## Support and Troubleshooting

### Common Issues
1. **Connection Failed**: Check database credentials
2. **Slow Queries**: Add appropriate indexes
3. **Data Corruption**: Restore from backup
4. **Storage Full**: Archive old tournaments

### Getting Help
- Check the SQL error messages
- Verify table relationships
- Ensure proper data types
- Test with sample data first

## Next Steps

1. Set up your database server
2. Run the schema creation scripts
3. Insert sample data for testing
4. Connect your application
5. Import existing tournament data
6. Train users on the new system
7. Set up regular backups

Remember: This database is designed specifically for Pakistani high flyer pigeon tournaments, focusing on flight duration and endurance rather than speed racing.
