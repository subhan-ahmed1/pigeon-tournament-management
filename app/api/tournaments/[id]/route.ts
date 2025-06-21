import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getTournament, supabase } from "@/lib/db"

// Get a specific tournament with all related data
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const tournamentData = await getTournament(tournamentId)

    if (!tournamentData) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json(tournamentData)
  } catch (error) {
    console.error("Error fetching tournament:", error)
    return NextResponse.json({ error: "Failed to fetch tournament details" }, { status: 500 })
  }
}

// Update a tournament
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.role !== "admin" && !user.permissions?.can_create_tournaments) {
      return NextResponse.json({ error: "You do not have permission to update tournaments" }, { status: 403 })
    }

    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const tournamentData = await request.json()

    const { data: tournament, error } = await supabase
      .from("tournaments")
      .update(tournamentData)
      .eq("id", tournamentId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 })
    }

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json({ tournament })
  } catch (error) {
    console.error("Error updating tournament:", error)
    return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 })
  }
}

// Delete a tournament
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.role !== "admin" && !user.permissions?.can_delete_tournaments) {
      return NextResponse.json({ error: "You do not have permission to delete tournaments" }, { status: 403 })
    }

    const tournamentId = Number.parseInt(params.id)

    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const { data: tournament, error } = await supabase
      .from("tournaments")
      .delete()
      .eq("id", tournamentId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 })
    }

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tournament:", error)
    return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 })
  }
}
