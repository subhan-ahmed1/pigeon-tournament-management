// User types
export interface User {
  id: number
  username: string
  password_hash: string
  email: string
  full_name: string
  role: "admin" | "sub_admin" | "user"
  created_at: string
  updated_at: string
}

export interface SubAdmin {
  id: number
  username: string
  password_hash: string
  permissions: AdminPermissions
  created_at: string
  is_active: boolean
}

export interface AdminPermissions {
  can_create_tournaments: boolean
  can_delete_tournaments: boolean
  can_manage_players: boolean
  can_manage_times: boolean
  can_view_reports: boolean
  can_manage_special_pigeons: boolean
}

// Tournament types
export interface Tournament {
  id: number
  name: string
  start_date: string
  days: number
  status: "upcoming" | "active" | "completed"
  start_time: string
  start_period: "AM" | "PM"
  end_time: string
  end_period: "AM" | "PM"
  return_threshold: number
  pigeons_per_player: number
  helper_pigeons: number
  special_pigeons: number
  created_by: number
  created_at: string
  updated_at: string
}

export interface TournamentDay {
  id: number
  tournament_id: number
  day_number: number
  date: string
  weather_conditions?: string
  temperature?: number
  wind_speed?: number
  wind_direction?: string
  notes?: string
}

// Player types
export interface Player {
  id: number
  name: string
  contact_number?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface TournamentParticipant {
  id: number
  tournament_id: number
  player_id: number
  special_pigeon_name?: string
  registration_date: string
}

// Pigeon types
export interface Pigeon {
  id: number
  player_id: number
  name: string
  ring_number?: string
  color?: string
  breed?: string
  gender?: string
  is_special: boolean
  created_at: string
  updated_at: string
}

// Race result types
export interface RaceResult {
  id: number
  tournament_id: number
  day_number: number
  pigeon_id: number
  arrival_time?: string
  arrival_period?: "AM" | "PM"
  race_time?: string
  race_time_minutes?: number
  created_at: string
  updated_at: string
}

export interface PlayerDailyRelease {
  id: number
  tournament_id: number
  day_number: number
  player_id: number
  release_time?: string
  release_period?: "AM" | "PM"
  is_late_release: boolean
}

export interface DailyTitle {
  id: number
  tournament_id: number
  day_number: number
  title_type: "akhri_bahadur" | "pehla_bahadur" | "special_champion"
  player_id: number
  pigeon_id: number
  time: string
  race_time_minutes: number
}

// Session type
export interface Session {
  id: number
  session_id: string
  user_id: number
  created_at: string
  expires_at: string
}
