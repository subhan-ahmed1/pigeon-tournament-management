import { cookies } from "next/headers"
import { supabase } from "./db"

export interface User {
  id: string
  username: string
  role: string
  full_name: string
}

// Get authenticated user (alias for getCurrentSession for backward compatibility)
export async function getAuthenticatedUser(): Promise<User | null> {
  return await getCurrentSession()
}

// Verify user credentials
export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  try {
    // Check if database is available
    if (!supabase) {
      // For development/build without database, return mock admin user
      if (username === "admin" && password === "admin123") {
        return {
          id: "1",
          username: "admin",
          role: "admin",
          full_name: "Administrator",
        }
      }
      return null
    }

    // Try to authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    })

    if (error || !data.user) {
      return null
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("email", username)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return null
    }

    return {
      id: data.user.id,
      username: profile.username || username,
      role: profile.role || "user",
      full_name: profile.full_name || username,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Create a new session
export async function createSession(userId: string): Promise<void> {
  try {
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    // Store session in database if available
    if (supabase) {
      await supabase.from("user_sessions").insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })
    }
  } catch (error) {
    console.error("Session creation error:", error)
    throw error
  }
}

// Get current session
export async function getCurrentSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return null
    }

    // Check database session if available
    if (supabase) {
      const { data: session, error } = await supabase
        .from("user_sessions")
        .select(`
          *,
          users(*)
        `)
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error || !session) {
        return null
      }

      return {
        id: session.users.id,
        username: session.users.username,
        role: session.users.role,
        full_name: session.users.full_name,
      }
    }

    // For development without database, return mock admin
    return {
      id: "1",
      username: "admin",
      role: "admin",
      full_name: "Administrator",
    }
  } catch (error) {
    console.error("Session retrieval error:", error)
    return null
  }
}

// Logout user
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    // Remove session from database if available
    if (supabase && sessionToken) {
      await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
    }

    // Clear session cookie
    cookieStore.delete("session")

    // Sign out from Supabase if available
    if (supabase) {
      await supabase.auth.signOut()
    }
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

// Generate a random session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentSession()
  return user !== null
}
