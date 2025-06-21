import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getTournaments, createTournament, supabase } from "@/lib/db"

// Get all tournaments
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    console.log(`User ${user?.username || "anonymous"} is viewing tournaments`)

    const tournaments = await getTournaments()
    return NextResponse.json({ tournaments })
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}

// Create a new tournament
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.role !== "admin" && !user.permissions?.can_create_tournaments) {
      return NextResponse.json({ error: "You do not have permission to create tournaments" }, { status: 403 })
    }

    const tournamentData = await request.json()

    if (!tournamentData.name || !tournamentData.start_date) {
      return NextResponse.json({ error: "Tournament name and start date are required" }, { status: 400 })
    }

    const tournament = await createTournament({
      ...tournamentData,
      created_by: user.id,
    })

    // Create tournament days
    const days = tournamentData.days || 1
    const tournamentDays = []

    for (let i = 0; i < days; i++) {
      const date = new Date(tournamentData.start_date)
      date.setDate(date.getDate() + i)

      tournamentDays.push({
        tournament_id: tournament.id,
        day_number: i + 1,
        date: date.toISOString().split("T")[0],
      })
    }

    await supabase.from("tournament_days").insert(tournamentDays)

    return NextResponse.json({ tournament }, { status: 201 })
  } catch (error) {
    console.error("Error creating tournament:", error)
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 })
  }
}
