import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { queryMany, queryOne, insert } from "@/lib/db"

// Add a player to a tournament
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user has permission to manage players
    if (user.role !== "admin" && !user.permissions?.can_manage_players) {
      return NextResponse.json({ error: "You do not have permission to manage players" }, { status: 403 })
    }

    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const { playerId, playerName, specialPigeonName } = await request.json()

    // Get tournament details to know how many pigeons to create
    const tournament = await queryOne(
      `
      SELECT * FROM tournaments WHERE id = $1
    `,
      [tournamentId],
    )

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    let player

    // If player ID is provided, use existing player
    if (playerId) {
      player = await queryOne(
        `
        SELECT * FROM players WHERE id = $1
      `,
        [playerId],
      )

      if (!player) {
        return NextResponse.json({ error: "Player not found" }, { status: 404 })
      }
    }
    // Otherwise create a new player
    else if (playerName) {
      player = await insert("players", {
        name: playerName,
      })
    } else {
      return NextResponse.json({ error: "Either player ID or player name is required" }, { status: 400 })
    }

    // Add player to tournament
    const participant = await insert("tournament_participants", {
      tournament_id: tournamentId,
      player_id: player.id,
      special_pigeon_name: specialPigeonName,
      registration_date: new Date().toISOString(),
    })

    // Create pigeons for the player
    const pigeons = []
    for (let i = 0; i < tournament.pigeons_per_player; i++) {
      // Determine if this pigeon should be special
      const isSpecial = i >= tournament.pigeons_per_player - tournament.special_pigeons

      const pigeon = await insert("pigeons", {
        player_id: player.id,
        name: `Pigeon ${i + 1}`,
        is_special: isSpecial,
      })

      pigeons.push(pigeon)

      // Create empty race results for each day
      for (let day = 1; day <= tournament.days; day++) {
        await insert("race_results", {
          tournament_id: tournamentId,
          day_number: day,
          pigeon_id: pigeon.id,
        })
      }
    }

    // Create empty daily releases for the player
    for (let day = 1; day <= tournament.days; day++) {
      await insert("player_daily_releases", {
        tournament_id: tournamentId,
        day_number: day,
        player_id: player.id,
        is_late_release: false,
      })
    }

    return NextResponse.json(
      {
        participant,
        player,
        pigeons,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding player to tournament:", error)
    return NextResponse.json({ error: "Failed to add player to tournament" }, { status: 500 })
  }
}

// Get all players in a tournament
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const participants = await queryMany(
      `
      SELECT tp.*, p.name as player_name, p.contact_number, p.address
      FROM tournament_participants tp
      JOIN players p ON tp.player_id = p.id
      WHERE tp.tournament_id = $1
    `,
      [tournamentId],
    )

    return NextResponse.json({ participants })
  } catch (error) {
    console.error("Error fetching tournament participants:", error)
    return NextResponse.json({ error: "Failed to fetch tournament participants" }, { status: 500 })
  }
}
