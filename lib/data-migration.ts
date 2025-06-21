import { queryOne, insert } from "./db"

// Function to migrate data from localStorage to database
export async function migrateLocalStorageToDatabase() {
  try {
    console.log("Starting data migration from localStorage to database...")

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("Not in browser environment, skipping migration")
      return
    }

    // Get tournaments from localStorage
    const tournamentsJson = localStorage.getItem("tournaments")
    if (!tournamentsJson) {
      console.log("No tournaments found in localStorage")
      return
    }

    const tournaments = JSON.parse(tournamentsJson)
    console.log(`Found ${tournaments.length} tournaments in localStorage`)

    // Get sub-admins from localStorage
    const subAdminsJson = localStorage.getItem("subAdmins")
    const subAdmins = subAdminsJson ? JSON.parse(subAdminsJson) : []

    // Create main admin if it doesn't exist
    const mainAdminExists = await queryOne(
      `
      SELECT * FROM users WHERE username = $1
    `,
      ["admin"],
    )

    if (!mainAdminExists) {
      await insert("users", {
        username: "admin",
        password_hash: "admin123", // In production, use proper password hashing
        email: "admin@example.com",
        full_name: "System Administrator",
        role: "admin",
      })
      console.log("Created main admin user")
    }

    // Migrate sub-admins
    for (const subAdmin of subAdmins) {
      const existingSubAdmin = await queryOne(
        `
        SELECT * FROM users WHERE username = $1
      `,
        [subAdmin.username],
      )

      if (!existingSubAdmin) {
        await insert("users", {
          username: subAdmin.username,
          password_hash: subAdmin.password, // In production, use proper password hashing
          email: `${subAdmin.username}@example.com`,
          full_name: subAdmin.username,
          role: "sub_admin",
          permissions: JSON.stringify({
            can_create_tournaments: subAdmin.permissions.canCreateTournaments,
            can_delete_tournaments: subAdmin.permissions.canDeleteTournaments,
            can_manage_players: subAdmin.permissions.canManagePlayers,
            can_manage_times: subAdmin.permissions.canManageTimes,
            can_view_reports: subAdmin.permissions.canViewReports,
            can_manage_special_pigeons: subAdmin.permissions.canManageSpecialPigeons,
          }),
          is_active: subAdmin.isActive,
        })
        console.log(`Migrated sub-admin: ${subAdmin.username}`)
      }
    }

    // Migrate tournaments and related data
    for (const tournament of tournaments) {
      // Create tournament
      const newTournament = await insert("tournaments", {
        name: tournament.name,
        start_date: tournament.date,
        days: tournament.days,
        status: tournament.status,
        start_time: tournament.startTime,
        start_period: tournament.startPeriod,
        end_time: tournament.endTime,
        end_period: tournament.endPeriod,
        return_threshold: tournament.returnThreshold,
        pigeons_per_player: tournament.pigeonsPerPlayer,
        helper_pigeons: tournament.helperPigeons || 0,
        special_pigeons: tournament.specialPigeons || 0,
        created_by: 1, // Main admin
      })

      console.log(`Migrated tournament: ${tournament.name}`)

      // Create tournament days
      if (tournament.dayDates) {
        for (let i = 0; i < tournament.days; i++) {
          await insert("tournament_days", {
            tournament_id: newTournament.id,
            day_number: i + 1,
            date: tournament.dayDates[i],
          })
        }
        console.log(`Created ${tournament.days} tournament days`)
      }

      // Migrate players and pigeons
      for (const player of tournament.players) {
        // Create player
        const newPlayer = await insert("players", {
          name: player.name,
        })

        // Add player to tournament
        const participant = await insert("tournament_participants", {
          tournament_id: newTournament.id,
          player_id: newPlayer.id,
          special_pigeon_name: player.specialPigeonName,
          registration_date: new Date().toISOString(),
        })

        console.log(`Migrated player: ${player.name}`)

        // Create pigeons
        for (const pigeon of player.pigeons) {
          const newPigeon = await insert("pigeons", {
            player_id: newPlayer.id,
            name: pigeon.name,
            is_special: pigeon.isSpecial || false,
          })

          // Create race results
          for (const dailyTime of pigeon.dailyTimes) {
            await insert("race_results", {
              tournament_id: newTournament.id,
              day_number: dailyTime.day,
              pigeon_id: newPigeon.id,
              arrival_time: dailyTime.arrivalTime,
              arrival_period: dailyTime.arrivalPeriod,
              race_time: dailyTime.raceTime,
              race_time_minutes: dailyTime.raceTime
                ? calculateRaceTimeInMinutes(
                    tournament.startTime,
                    tournament.startPeriod,
                    dailyTime.arrivalTime,
                    dailyTime.arrivalPeriod,
                  )
                : null,
            })
          }
        }

        // Create player daily releases
        if (player.dailyReleases) {
          for (const release of player.dailyReleases) {
            await insert("player_daily_releases", {
              tournament_id: newTournament.id,
              day_number: release.day,
              player_id: newPlayer.id,
              release_time: release.releaseTime,
              release_period: release.releasePeriod,
              is_late_release: release.isLateRelease,
            })
          }
        }
      }

      // Calculate and create daily titles
      for (let day = 1; day <= tournament.days; day++) {
        await updateDailyTitles(newTournament.id, day)
      }
    }

    console.log("Migration completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Migration error:", error)
    return { success: false, error }
  }
}

// Helper functions (same as in the API routes)
function calculateRaceTimeInMinutes(
  startTime: string,
  startPeriod: string,
  arrivalTime: string,
  arrivalPeriod: string,
): number {
  if (!arrivalTime || !arrivalPeriod) return 0

  const startMinutes = timeToMinutes(startTime, startPeriod)
  const arrivalMinutes = timeToMinutes(arrivalTime, arrivalPeriod)

  let raceMinutes = arrivalMinutes - startMinutes

  // Handle next day arrival
  if (raceMinutes < 0) {
    raceMinutes += 24 * 60
  }

  return raceMinutes
}

function timeToMinutes(time: string, period: string): number {
  if (!time) return 0

  const [hours, minutes, seconds] = time.split(":").map(Number)
  let totalHours = hours

  if (period === "PM" && hours !== 12) {
    totalHours += 12
  } else if (period === "AM" && hours === 12) {
    totalHours = 0
  }

  return totalHours * 60 + minutes + seconds / 60
}

// This is a simplified version - the full implementation would be the same as in the API routes
async function updateDailyTitles(tournamentId: number, dayNumber: number) {
  // Implementation would be the same as in the API routes
  console.log(`Calculating titles for tournament ${tournamentId}, day ${dayNumber}`)
}
