import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { queryMany, queryOne, update, insert } from "@/lib/db"

// Update race results for a pigeon
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user has permission to manage times
    if (user.role !== "admin" && !user.permissions?.can_manage_times) {
      return NextResponse.json({ error: "You do not have permission to manage times" }, { status: 403 })
    }

    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const { pigeonId, dayNumber, arrivalTime, arrivalPeriod } = await request.json()

    if (!pigeonId || !dayNumber) {
      return NextResponse.json({ error: "Pigeon ID and day number are required" }, { status: 400 })
    }

    // Get tournament details for calculating race time
    const tournament = await queryOne(
      `
      SELECT * FROM tournaments WHERE id = $1
    `,
      [tournamentId],
    )

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    // Get player release time for this day
    const pigeon = await queryOne(
      `
      SELECT p.*, pl.id as player_id
      FROM pigeons p
      JOIN players pl ON p.player_id = pl.id
      WHERE p.id = $1
    `,
      [pigeonId],
    )

    if (!pigeon) {
      return NextResponse.json({ error: "Pigeon not found" }, { status: 404 })
    }

    const playerRelease = await queryOne(
      `
      SELECT * FROM player_daily_releases
      WHERE tournament_id = $1 AND day_number = $2 AND player_id = $3
    `,
      [tournamentId, dayNumber, pigeon.player_id],
    )

    // Calculate race time
    let raceTime = null
    let raceTimeMinutes = null

    if (arrivalTime && arrivalPeriod) {
      // Use player release time if available, otherwise use tournament start time
      const startTime = playerRelease?.release_time || tournament.start_time
      const startPeriod = playerRelease?.release_period || tournament.start_period

      raceTimeMinutes = calculateRaceTimeInMinutes(startTime, startPeriod, arrivalTime, arrivalPeriod)

      raceTime = formatTimeFromMinutes(raceTimeMinutes)
    }

    // Update race result
    const result = await update(
      "race_results",
      null,
      {
        tournament_id: tournamentId,
        day_number: dayNumber,
        pigeon_id: pigeonId,
        arrival_time: arrivalTime,
        arrival_period: arrivalPeriod,
        race_time: raceTime,
        race_time_minutes: raceTimeMinutes,
      },
      "WHERE tournament_id = $1 AND day_number = $2 AND pigeon_id = $3",
    )

    // Recalculate and update daily titles
    await updateDailyTitles(tournamentId, dayNumber)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error updating race results:", error)
    return NextResponse.json({ error: "Failed to update race results" }, { status: 500 })
  }
}

// Get race results for a tournament
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const results = await queryMany(
      `
      SELECT rr.*, 
        p.name as pigeon_name, 
        p.is_special,
        pl.name as player_name,
        pl.id as player_id
      FROM race_results rr
      JOIN pigeons p ON rr.pigeon_id = p.id
      JOIN players pl ON p.player_id = pl.id
      WHERE rr.tournament_id = $1
      ORDER BY rr.day_number, rr.race_time_minutes DESC NULLS LAST
    `,
      [tournamentId],
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error fetching race results:", error)
    return NextResponse.json({ error: "Failed to fetch race results" }, { status: 500 })
  }
}

// Helper functions
function calculateRaceTimeInMinutes(
  startTime: string,
  startPeriod: string,
  arrivalTime: string,
  arrivalPeriod: string,
): number {
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
  const [hours, minutes, seconds] = time.split(":").map(Number)
  let totalHours = hours

  if (period === "PM" && hours !== 12) {
    totalHours += 12
  } else if (period === "AM" && hours === 12) {
    totalHours = 0
  }

  return totalHours * 60 + minutes + seconds / 60
}

function formatTimeFromMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)
  const seconds = Math.floor((totalMinutes % 1) * 60)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

async function updateDailyTitles(tournamentId: number, dayNumber: number) {
  try {
    // Get tournament details
    const tournament = await queryOne(
      `
      SELECT * FROM tournaments WHERE id = $1
    `,
      [tournamentId],
    )

    if (!tournament) {
      throw new Error("Tournament not found")
    }

    // Delete existing titles for this day
    await queryOne(
      `
      DELETE FROM daily_titles
      WHERE tournament_id = $1 AND day_number = $2
    `,
      [tournamentId, dayNumber],
    )

    // Find Akhri Bahadur (longest flight time)
    const akhriResult = await queryOne(
      `
      SELECT rr.*, 
        p.id as pigeon_id, 
        p.name as pigeon_name, 
        p.is_special,
        pl.id as player_id,
        pl.name as player_name
      FROM race_results rr
      JOIN pigeons p ON rr.pigeon_id = p.id
      JOIN players pl ON p.player_id = pl.id
      WHERE rr.tournament_id = $1 
        AND rr.day_number = $2 
        AND rr.race_time IS NOT NULL
      ORDER BY rr.race_time_minutes DESC
      LIMIT 1
    `,
      [tournamentId, dayNumber],
    )

    if (akhriResult) {
      await insert("daily_titles", {
        tournament_id: tournamentId,
        day_number: dayNumber,
        title_type: "akhri_bahadur",
        player_id: akhriResult.player_id,
        pigeon_id: akhriResult.pigeon_id,
        time: akhriResult.race_time,
        race_time_minutes: akhriResult.race_time_minutes,
      })
    }

    // Find Pehla Bahadur (first non-helper pigeon with highest time)
    // First, get all players who meet the return threshold
    const eligiblePlayers = await queryMany(
      `
      SELECT pl.id, pl.name,
        COUNT(DISTINCT rr.pigeon_id) as returned_count
      FROM players pl
      JOIN pigeons p ON p.player_id = pl.id
      JOIN race_results rr ON rr.pigeon_id = p.id
      WHERE rr.tournament_id = $1 
        AND rr.race_time IS NOT NULL
      GROUP BY pl.id, pl.name
      HAVING COUNT(DISTINCT rr.pigeon_id) >= $2
    `,
      [tournamentId, tournament.return_threshold],
    )

    if (eligiblePlayers.length > 0) {
      // For each eligible player, find their first non-helper pigeon
      let pehlaResult = null

      for (const player of eligiblePlayers) {
        // Get helper pigeons for this player
        const helperPigeons = await getHelperPigeons(tournamentId, player.id, tournament.helper_pigeons)

        // Find first non-helper pigeon with highest time
        const playerPehla = await queryOne(
          `
          SELECT rr.*, 
            p.id as pigeon_id, 
            p.name as pigeon_name,
            $3 as player_id,
            $4 as player_name
          FROM race_results rr
          JOIN pigeons p ON rr.pigeon_id = p.id
          WHERE rr.tournament_id = $1 
            AND rr.day_number = $2 
            AND p.player_id = $3
            AND rr.race_time IS NOT NULL
            AND p.id NOT IN (${helperPigeons.map((_, i) => `$${i + 5}`).join(", ") || "NULL"})
          ORDER BY rr.race_time_minutes DESC
          LIMIT 1
        `,
          [tournamentId, dayNumber, player.id, player.name, ...helperPigeons],
        )

        if (playerPehla && (!pehlaResult || playerPehla.race_time_minutes > pehlaResult.race_time_minutes)) {
          pehlaResult = playerPehla
        }
      }

      if (pehlaResult) {
        await insert("daily_titles", {
          tournament_id: tournamentId,
          day_number: dayNumber,
          title_type: "pehla_bahadur",
          player_id: pehlaResult.player_id,
          pigeon_id: pehlaResult.pigeon_id,
          time: pehlaResult.race_time,
          race_time_minutes: pehlaResult.race_time_minutes,
        })
      }
    }

    // Find Special Champion (special pigeon with highest total time)
    // This is a tournament-wide title, but we'll update it on each day change
    await updateSpecialChampion(tournamentId)
  } catch (error) {
    console.error("Error updating daily titles:", error)
    throw error
  }
}

async function getHelperPigeons(tournamentId: number, playerId: number, helperCount: number): Promise<number[]> {
  if (helperCount <= 0) {
    return []
  }

  // Get all pigeons for this player with their total race time
  const pigeons = await queryMany(
    `
    SELECT p.id,
      SUM(rr.race_time_minutes) as total_time
    FROM pigeons p
    JOIN race_results rr ON rr.pigeon_id = p.id
    WHERE p.player_id = $1 
      AND rr.tournament_id = $2
      AND rr.race_time IS NOT NULL
    GROUP BY p.id
    ORDER BY total_time ASC
    LIMIT $3
  `,
    [playerId, tournamentId, helperCount],
  )

  return pigeons.map((p) => p.id)
}

async function updateSpecialChampion(tournamentId: number) {
  try {
    // Delete existing special champion title
    await queryOne(
      `
      DELETE FROM daily_titles
      WHERE tournament_id = $1 AND title_type = 'special_champion'
    `,
      [tournamentId],
    )

    // Find special pigeon with highest total time
    const specialChampion = await queryOne(
      `
      SELECT 
        p.id as pigeon_id,
        p.name as pigeon_name,
        pl.id as player_id,
        pl.name as player_name,
        tp.special_pigeon_name,
        SUM(rr.race_time_minutes) as total_time,
        MAX(rr.day_number) as best_day
      FROM pigeons p
      JOIN players pl ON p.player_id = pl.id
      JOIN tournament_participants tp ON tp.player_id = pl.id AND tp.tournament_id = $1
      JOIN race_results rr ON rr.pigeon_id = p.id AND rr.tournament_id = $1
      WHERE p.is_special = true
        AND rr.race_time IS NOT NULL
      GROUP BY p.id, p.name, pl.id, pl.name, tp.special_pigeon_name
      ORDER BY total_time DESC
      LIMIT 1
    `,
      [tournamentId],
    )

    if (specialChampion) {
      await insert("daily_titles", {
        tournament_id: tournamentId,
        day_number: specialChampion.best_day,
        title_type: "special_champion",
        player_id: specialChampion.player_id,
        pigeon_id: specialChampion.pigeon_id,
        time: formatTimeFromMinutes(specialChampion.total_time),
        race_time_minutes: specialChampion.total_time,
      })
    }
  } catch (error) {
    console.error("Error updating special champion:", error)
    throw error
  }
}
