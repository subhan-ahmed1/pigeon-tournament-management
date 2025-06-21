import { createClient } from "@supabase/supabase-js"

// Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create Supabase clients with error handling
let supabase: any = null
let supabaseAdmin: any = null

try {
  // Only create clients if we have valid URLs and keys
  if (
    supabaseUrl &&
    supabaseUrl !== "https://placeholder.supabase.co" &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey &&
    supabaseAnonKey !== "placeholder-anon-key"
  ) {
    console.log("Initializing Supabase client...")
    supabase = createClient(supabaseUrl, supabaseAnonKey)

    if (supabaseServiceKey && supabaseServiceKey !== "placeholder-service-key") {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    }

    console.log("Supabase client initialized successfully")
  } else {
    console.warn("Supabase environment variables not configured properly")
    console.warn("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set but invalid" : "Missing")
    console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set but invalid" : "Missing")
    console.warn("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "Set but invalid" : "Missing")
  }
} catch (error) {
  console.error("Supabase client initialization failed:", error)
}

// Helper function to check if database is available
function isDatabaseAvailable() {
  return (
    supabase !== null &&
    supabaseUrl &&
    supabaseUrl !== "https://placeholder.supabase.co" &&
    supabaseUrl.startsWith("https://")
  )
}

// Helper function to execute SQL queries using Supabase
export async function query(text: string, params?: any[]) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  try {
    console.log("Executing query:", { text, params })
    throw new Error("Use Supabase client methods instead of raw SQL queries")
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper functions for common operations
export async function getTournaments() {
  if (!isDatabaseAvailable()) {
    // Return mock data for development/build
    return [
      {
        id: 1,
        name: "Winter Championship 2024",
        start_date: "2024-01-15",
        end_date: "2024-01-20",
        status: "completed",
        location: "Bewal, Pakistan",
      },
    ]
  }

  const { data, error } = await supabase
    .from("tournaments")
    .select(`
      *,
      tournament_participants(count)
    `)
    .order("start_date", { ascending: false })

  if (error) throw error
  return data
}

export async function getTournament(id: number) {
  if (!isDatabaseAvailable()) {
    // Return mock data for development/build
    return {
      id: id,
      name: "Mock Tournament",
      start_date: "2024-01-15",
      end_date: "2024-01-20",
      status: "active",
      location: "Bewal, Pakistan",
      tournament_days: [],
      tournament_participants: [],
    }
  }

  const { data, error } = await supabase
    .from("tournaments")
    .select(`
      *,
      tournament_days(*),
      tournament_participants(
        *,
        players(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createTournament(tournamentData: any) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  const { data, error } = await supabase.from("tournaments").insert(tournamentData).select().single()

  if (error) throw error
  return data
}

export async function getPlayers() {
  if (!isDatabaseAvailable()) {
    // Return mock data for development/build
    return [
      {
        id: 1,
        name: "Ahmad Ali",
        phone: "+92-300-1234567",
        city: "Bewal",
        pigeons: [],
      },
    ]
  }

  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      pigeons(count)
    `)
    .order("name")

  if (error) throw error
  return data
}

export async function createPlayer(playerData: any) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  const { data, error } = await supabase.from("players").insert(playerData).select().single()

  if (error) throw error
  return data
}

// Authentication helpers
export async function authenticateUser(username: string, password: string) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  })

  if (error) throw error
  return data
}

export async function getCurrentUser() {
  if (!isDatabaseAvailable()) {
    return null
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  return user
}

// Helper function to get a single row
export async function queryOne(tableName: string, conditions: Record<string, any> = {}) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  try {
    let query = supabase.from(tableName).select("*")

    // Apply conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    const { data, error } = await query.single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Database queryOne error:", error)
    throw error
  }
}

// Helper function to get multiple rows
export async function queryMany(tableName: string, conditions: Record<string, any> = {}) {
  if (!isDatabaseAvailable()) {
    return []
  }

  try {
    let query = supabase.from(tableName).select("*")

    // Apply conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Database queryMany error:", error)
    throw error
  }
}

// Helper function to insert data and return the inserted row
export async function insert(tableName: string, data: Record<string, any>) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  try {
    const { data: result, error } = await supabase.from(tableName).insert(data).select().single()

    if (error) throw error
    return result
  } catch (error) {
    console.error("Database insert error:", error)
    throw error
  }
}

// Helper function to update data and return the updated row
export async function update(tableName: string, id: string | number, data: Record<string, any>) {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not configured. Please set up Supabase environment variables.")
  }

  try {
    const { data: result, error } = await supabase.from(tableName).update(data).eq("id", id).select().single()

    if (error) throw error
    return result
  } catch (error) {
    console.error("Database update error:", error)
    throw error
  }
}

// Export the clients (may be null if not configured)
export { supabase, supabaseAdmin, isDatabaseAvailable }
