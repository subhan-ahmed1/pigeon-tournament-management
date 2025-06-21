import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { queryMany, insert } from "@/lib/db"

// Get all players
export async function GET() {
  try {
    const players = await queryMany(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM pigeons WHERE player_id = p.id) as pigeon_count
      FROM players p
      ORDER BY p.name
    `)

    return NextResponse.json({ players })
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

// Create a new player
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user has permission to manage players
    if (user.role !== "admin" && !user.permissions?.can_manage_players) {
      return NextResponse.json({ error: "You do not have permission to manage players" }, { status: 403 })
    }

    const playerData = await request.json()

    // Validate player data
    if (!playerData.name) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 })
    }

    // Create the player
    const player = await insert("players", playerData)

    return NextResponse.json({ player }, { status: 201 })
  } catch (error) {
    console.error("Error creating player:", error)
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 })
  }
}
