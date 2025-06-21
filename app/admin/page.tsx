"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Lock,
  Plus,
  Trash2,
  Clock,
  Star,
  Trophy,
  Crown,
  Award,
  Calendar,
  User,
  Info,
  X,
  Edit,
  AlertTriangle,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DailyTime {
  day: number
  arrivalTime: string | null // Format: "HH:MM:SS"
  arrivalPeriod: "AM" | "PM" | null
  raceTime: string | null // Calculated race time
  isCancelled?: boolean // Flag for cancelled time
}

interface PlayerDailyRelease {
  day: number
  releaseTime: string | null // When the player released pigeons for this day
  releasePeriod: "AM" | "PM" | null
  isLateRelease: boolean // Flag for late release
}

interface Pigeon {
  id: string
  name: string
  dailyTimes: DailyTime[] // Array of times for each day
  specialByDay?: { [day: number]: boolean } // Day-specific special pigeon designation
}

interface Player {
  id: string
  name: string
  pigeons: Pigeon[]
  specialPigeonName?: string // Custom name for special pigeon
  dailyReleases?: PlayerDailyRelease[] // Release times per day for this player
}

interface Tournament {
  id: string
  name: string
  date: string
  days: number // Number of days the tournament runs
  dayDates: string[] // Array of dates for each day
  status: "upcoming" | "active" | "completed"
  startTime: string // Format: "HH:MM:SS"
  startPeriod: "AM" | "PM"
  endTime: string // Format: "HH:MM:SS"
  endPeriod: "AM" | "PM"
  players: Player[]
  returnThreshold: number // Absolute number of pigeons required (not percentage)
  pigeonsPerPlayer: number // Number of pigeons per player
  helperPigeons: number // Number of helper pigeons per player
  specialPigeons: number // Number of special pigeons per player
}

interface SpecialTitle {
  type: "akhri_bahadur" | "pehla_bahadur" | "special_champion"
  playerId: string
  pigeonId: string
  playerName: string
  pigeonName: string
  time: string
  day: number // Always include day for proper filtering
}

interface AdminPermissions {
  canCreateTournaments: boolean
  canDeleteTournaments: boolean
  canManagePlayers: boolean
  canManageTimes: boolean
  canViewReports: boolean
  canManageSpecialPigeons: boolean
}

interface SubAdmin {
  id: string
  username: string
  password: string
  permissions: AdminPermissions
  createdAt: string
  isActive: boolean
}

interface CurrentUser {
  username: string
  isMainAdmin: boolean
  permissions?: AdminPermissions
}

const MAIN_ADMIN_USERNAME = "admin"
const MAIN_ADMIN_PASSWORD = "admin123"

const DEFAULT_PERMISSIONS: AdminPermissions = {
  canCreateTournaments: false,
  canDeleteTournaments: false,
  canManagePlayers: false,
  canManageTimes: false,
  canViewReports: false,
  canManageSpecialPigeons: false,
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<string>("")
  const [newTournamentName, setNewTournamentName] = useState("")
  const [newTournamentDate, setNewTournamentDate] = useState("")
  const [newTournamentDays, setNewTournamentDays] = useState(1)
  const [newTournamentThreshold, setNewTournamentThreshold] = useState(0)
  const [newTournamentPigeons, setNewTournamentPigeons] = useState(11)
  const [newTournamentHelperPigeons, setNewTournamentHelperPigeons] = useState(0)
  const [newTournamentSpecialPigeons, setNewTournamentSpecialPigeons] = useState(0)
  const [newTournamentStartTime, setNewTournamentStartTime] = useState("06:00:00")
  const [newTournamentStartPeriod, setNewTournamentStartPeriod] = useState<"AM" | "PM">("AM")
  const [newTournamentEndTime, setNewTournamentEndTime] = useState("07:00:00")
  const [newTournamentEndPeriod, setNewTournamentEndPeriod] = useState<"AM" | "PM">("AM")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newSpecialPigeonName, setNewSpecialPigeonName] = useState("")
  const [selectedDay, setSelectedDay] = useState(1)
  const [timeDialogOpen, setTimeDialogOpen] = useState(false)
  const [releaseTimeDialogOpen, setReleaseTimeDialogOpen] = useState(false)
  const [specialPigeonDialogOpen, setSpecialPigeonDialogOpen] = useState(false)
  const [dateEditDialogOpen, setDateEditDialogOpen] = useState(false)
  const [subAdminDialogOpen, setSubAdminDialogOpen] = useState(false)
  const [selectedPigeon, setSelectedPigeon] = useState<{
    tournamentId: string
    playerId: string
    pigeonId: string
  } | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<{
    tournamentId: string
    playerId: string
  } | null>(null)
  const [arrivalTimeValue, setArrivalTimeValue] = useState("")
  const [arrivalPeriodValue, setArrivalPeriodValue] = useState<"AM" | "PM">("AM")
  const [releaseTimeValue, setReleaseTimeValue] = useState("")
  const [releasePeriodValue, setReleasePeriodValue] = useState<"AM" | "PM">("AM")
  const [playerSearchTerm, setPlayerSearchTerm] = useState("")
  const [editingDayDates, setEditingDayDates] = useState<string[]>([])

  // Sub-admin form states
  const [newSubAdminUsername, setNewSubAdminUsername] = useState("")
  const [newSubAdminPassword, setNewSubAdminPassword] = useState("")
  const [newSubAdminPermissions, setNewSubAdminPermissions] = useState<AdminPermissions>(DEFAULT_PERMISSIONS)
  const [editingSubAdmin, setEditingSubAdmin] = useState<SubAdmin | null>(null)

  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [editTournamentDialogOpen, setEditTournamentDialogOpen] = useState(false)

  // Check authentication first
  useEffect(() => {
    // Simple authentication check without forcing
    const savedAuth = localStorage.getItem("adminAuthenticated")
    const savedUser = localStorage.getItem("currentUser")

    if (savedAuth === "true" && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setIsAuthenticated(false)
        setCurrentUser(null)
      }
    } else {
      setIsAuthenticated(false)
      setCurrentUser(null)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const savedTournaments = localStorage.getItem("tournaments")
      if (savedTournaments) {
        const loadedTournaments = JSON.parse(savedTournaments)
        // Ensure all tournaments have dayDates array and updated structure
        const updatedTournaments = loadedTournaments.map((tournament: Tournament) => {
          if (!tournament.dayDates) {
            // Generate default dates based on the base date
            const dayDates = []
            for (let i = 0; i < tournament.days; i++) {
              const date = new Date(tournament.date)
              date.setDate(date.getDate() + i)
              dayDates.push(date.toISOString().split("T")[0])
            }
            return { ...tournament, dayDates }
          }

          // Update players to use new release time structure
          const updatedPlayers = tournament.players.map((player) => {
            // Initialize dailyReleases if not present
            if (!player.dailyReleases) {
              player.dailyReleases = Array.from({ length: tournament.days }, (_, i) => ({
                day: i + 1,
                releaseTime: null,
                releasePeriod: null,
                isLateRelease: false,
              }))
            }

            // Ensure all pigeons have complete dailyTimes for all days
            const updatedPigeons = player.pigeons.map((pigeon) => {
              // Ensure dailyTimes has entries for all tournament days
              const completeDailyTimes = Array.from({ length: tournament.days }, (_, i) => {
                const existingDayTime = pigeon.dailyTimes.find((dt) => dt.day === i + 1)
                return (
                  existingDayTime || {
                    day: i + 1,
                    arrivalTime: null,
                    arrivalPeriod: null,
                    raceTime: null,
                    isCancelled: false,
                  }
                )
              })

              return {
                ...pigeon,
                dailyTimes: completeDailyTimes,
              }
            })

            return {
              ...player,
              pigeons: updatedPigeons,
            }
          })

          return {
            ...tournament,
            players: updatedPlayers,
          }
        })
        setTournaments(updatedTournaments)
        localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))
      }

      // Load sub-admins
      const savedSubAdmins = localStorage.getItem("subAdmins")
      if (savedSubAdmins) {
        setSubAdmins(JSON.parse(savedSubAdmins))
      }
    }
  }, [isAuthenticated])

  const timeToMinutes = (time: string, period: "AM" | "PM"): number => {
    const [hours, minutes, seconds] = time.split(":").map(Number)
    let totalHours = hours

    if (period === "PM" && hours !== 12) {
      totalHours += 12
    } else if (period === "AM" && hours === 12) {
      totalHours = 0
    }

    return totalHours * 60 + minutes + seconds / 60
  }

  const minutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    const seconds = Math.floor((totalMinutes % 1) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const calculateRaceTime = (
    startTime: string,
    startPeriod: "AM" | "PM",
    arrivalTime: string,
    arrivalPeriod: "AM" | "PM",
    releaseTime: string | null = null,
    releasePeriod: "AM" | "PM" | null = null,
  ): string => {
    // If release time is provided, use it instead of start time
    const effectiveStartTime = releaseTime || startTime
    const effectiveStartPeriod = releasePeriod || startPeriod

    const startMinutes = timeToMinutes(effectiveStartTime, effectiveStartPeriod as "AM" | "PM")
    const arrivalMinutes = timeToMinutes(arrivalTime, arrivalPeriod)

    let raceMinutes = arrivalMinutes - startMinutes

    // Handle next day arrival
    if (raceMinutes < 0) {
      raceMinutes += 24 * 60
    }

    return minutesToTime(raceMinutes)
  }

  const calculateRaceTimeInMinutes = (
    startTime: string,
    startPeriod: "AM" | "PM",
    arrivalTime: string,
    arrivalPeriod: "AM" | "PM",
    releaseTime: string | null = null,
    releasePeriod: "AM" | "PM" | null = null,
  ): number => {
    // If release time is provided, use it instead of start time
    const effectiveStartTime = releaseTime || startTime
    const effectiveStartPeriod = releasePeriod || startPeriod

    const startMinutes = timeToMinutes(effectiveStartTime, effectiveStartPeriod as "AM" | "PM")
    const arrivalMinutes = timeToMinutes(arrivalTime, arrivalPeriod)

    let raceMinutes = arrivalMinutes - startMinutes

    // Handle next day arrival
    if (raceMinutes < 0) {
      raceMinutes += 24 * 60
    }

    return raceMinutes
  }

  const isLateRelease = (
    startTime: string,
    startPeriod: "AM" | "PM",
    releaseTime: string,
    releasePeriod: "AM" | "PM",
  ): boolean => {
    const startMinutes = timeToMinutes(startTime, startPeriod)
    const releaseMinutes = timeToMinutes(releaseTime, releasePeriod)

    // If release time is after start time, it's a late release
    return releaseMinutes > startMinutes
  }

  const getReturnedPigeonsCount = (pigeons: Pigeon[], days: number) => {
    const returnedPigeons = new Set<string>()
    for (let day = 1; day <= days; day++) {
      pigeons.forEach((pigeon) => {
        const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
        if (dayTime?.raceTime && !dayTime?.isCancelled) {
          returnedPigeons.add(pigeon.id)
        }
      })
    }
    return returnedPigeons.size
  }

  const getPlayerReleaseTime = (player: Player, day: number): PlayerDailyRelease | null => {
    return player.dailyReleases?.find((dr) => dr.day === day) || null
  }

  // Updated function to get special titles for a specific day only - STRICT day filtering
  const getDailySpecialTitles = (tournament: Tournament, specificDay: number): SpecialTitle[] => {
    const titles: SpecialTitle[] = []

    // Find "Akhri Bahadur" (Last Warrior) - pigeon with highest time for this specific day only
    let akhriPigeon: {
      player: Player
      pigeon: Pigeon
      time: number
      timeString: string
    } | null = null

    tournament.players.forEach((player) => {
      player.pigeons.forEach((pigeon) => {
        const dayTime = pigeon.dailyTimes.find((dt) => dt.day === specificDay)
        if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled) {
          const playerRelease = getPlayerReleaseTime(player, specificDay)
          const totalMinutes = calculateRaceTimeInMinutes(
            tournament.startTime,
            tournament.startPeriod,
            dayTime.arrivalTime,
            dayTime.arrivalPeriod,
            playerRelease?.releaseTime,
            playerRelease?.releasePeriod,
          )

          if (!akhriPigeon || totalMinutes > akhriPigeon.time) {
            akhriPigeon = {
              player,
              pigeon,
              time: totalMinutes,
              timeString: dayTime.raceTime || formatTimeFromMinutes(totalMinutes),
            }
          }
        }
      })
    })

    if (akhriPigeon) {
      titles.push({
        type: "akhri_bahadur",
        playerId: akhriPigeon.player.id,
        pigeonId: akhriPigeon.pigeon.id,
        playerName: akhriPigeon.player.name,
        pigeonName: akhriPigeon.pigeon.isSpecial
          ? akhriPigeon.player.specialPigeonName || "Special Pigeon"
          : akhriPigeon.pigeon.name,
        time: akhriPigeon.timeString,
        day: specificDay,
      })
    }

    // Find "Pehla Bahadur" (First Warrior) - first NON-HELPER pigeon with highest time for this specific day
    let pehlaPigeon: {
      player: Player
      pigeon: Pigeon
      time: number
      timeString: string
    } | null = null

    tournament.players.forEach((player) => {
      const returnedCount = getReturnedPigeonsCount(player.pigeons, tournament.days)
      // Use absolute threshold instead of percentage
      const requiredReturned = tournament.returnThreshold

      if (returnedCount >= requiredReturned) {
        // Get helper pigeons for this player
        const helperPigeonIds = getHelperPigeons(player.pigeons, tournament.helperPigeons || 0, tournament.days)

        // Find the FIRST non-helper pigeon (could be pigeon at index 0, 1, 2, etc.)
        const firstNonHelperPigeon = player.pigeons.find((pigeon) => !helperPigeonIds.includes(pigeon.id))

        if (firstNonHelperPigeon) {
          const dayTime = firstNonHelperPigeon.dailyTimes.find((dt) => dt.day === specificDay)
          if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled) {
            const playerRelease = getPlayerReleaseTime(player, specificDay)
            const totalMinutes = calculateRaceTimeInMinutes(
              tournament.startTime,
              tournament.startPeriod,
              dayTime.arrivalTime,
              dayTime.arrivalPeriod,
              playerRelease?.releaseTime,
              playerRelease?.releasePeriod,
            )

            if (!pehlaPigeon || totalMinutes > pehlaPigeon.time) {
              pehlaPigeon = {
                player,
                pigeon: firstNonHelperPigeon,
                time: totalMinutes,
                timeString: dayTime.raceTime || formatTimeFromMinutes(totalMinutes),
              }
            }
          }
        }
      }
    })

    if (pehlaPigeon) {
      titles.push({
        type: "pehla_bahadur",
        playerId: pehlaPigeon.player.id,
        pigeonId: pehlaPigeon.pigeon.id,
        playerName: pehlaPigeon.player.name,
        pigeonName: pehlaPigeon.pigeon.name,
        time: pehlaPigeon.timeString,
        day: specificDay,
      })
    }

    // Find "Special Champion" - special pigeon with highest time for this specific day
    let specialChampion: {
      player: Player
      pigeon: Pigeon
      time: number
      timeString: string
    } | null = null

    tournament.players.forEach((player) => {
      const specialPigeon = player.pigeons.find((p) => p.isSpecial)
      if (specialPigeon) {
        const dayTime = specialPigeon.dailyTimes.find((dt) => dt.day === specificDay)
        if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled) {
          const playerRelease = getPlayerReleaseTime(player, specificDay)
          const dayMinutes = calculateRaceTimeInMinutes(
            tournament.startTime,
            tournament.startPeriod,
            dayTime.arrivalTime,
            dayTime.arrivalPeriod,
            playerRelease?.releaseTime,
            playerRelease?.releasePeriod,
          )

          if (!specialChampion || dayMinutes > specialChampion.time) {
            specialChampion = {
              player,
              pigeon: specialPigeon,
              time: dayMinutes,
              timeString: dayTime.raceTime || formatTimeFromMinutes(dayMinutes),
            }
          }
        }
      }
    })

    if (specialChampion) {
      titles.push({
        type: "special_champion",
        playerId: specialChampion.player.id,
        pigeonId: specialChampion.pigeon.id,
        playerName: specialChampion.player.name,
        pigeonName: specialChampion.player.specialPigeonName || "Special Pigeon",
        time: specialChampion.timeString,
        day: specificDay,
      })
    }

    return titles
  }

  const formatTimeFromMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    const seconds = Math.floor((totalMinutes % 1) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const saveTournaments = (updatedTournaments: Tournament[]) => {
    setTournaments(updatedTournaments)
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))
  }

  const saveSubAdmins = (updatedSubAdmins: SubAdmin[]) => {
    setSubAdmins(updatedSubAdmins)
    localStorage.setItem("subAdmins", JSON.stringify(updatedSubAdmins))
  }

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (currentUser?.isMainAdmin) return true
    return currentUser?.permissions?.[permission] || false
  }

  const createSubAdmin = () => {
    if (!newSubAdminUsername || !newSubAdminPassword) {
      alert("Please fill in all fields")
      return
    }

    // Check if username already exists
    if (
      newSubAdminUsername === MAIN_ADMIN_USERNAME ||
      subAdmins.some((admin) => admin.username === newSubAdminUsername)
    ) {
      alert("Username already exists")
      return
    }

    const newSubAdmin: SubAdmin = {
      id: Date.now().toString(),
      username: newSubAdminUsername,
      password: newSubAdminPassword,
      permissions: { ...newSubAdminPermissions },
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    const updatedSubAdmins = [...subAdmins, newSubAdmin]
    saveSubAdmins(updatedSubAdmins)

    setNewSubAdminUsername("")
    setNewSubAdminPassword("")
    setNewSubAdminPermissions(DEFAULT_PERMISSIONS)
    setSubAdminDialogOpen(false)
  }

  const updateSubAdmin = () => {
    if (!editingSubAdmin) return

    const updatedSubAdmins = subAdmins.map((admin) =>
      admin.id === editingSubAdmin.id
        ? { ...admin, permissions: { ...newSubAdminPermissions }, isActive: true }
        : admin,
    )
    saveSubAdmins(updatedSubAdmins)
    setEditingSubAdmin(null)
    setSubAdminDialogOpen(false)
  }

  const toggleSubAdminStatus = (adminId: string) => {
    const updatedSubAdmins = subAdmins.map((admin) =>
      admin.id === adminId ? { ...admin, isActive: !admin.isActive } : admin,
    )
    saveSubAdmins(updatedSubAdmins)
  }

  const deleteSubAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this sub-admin?")) {
      const updatedSubAdmins = subAdmins.filter((admin) => admin.id !== adminId)
      saveSubAdmins(updatedSubAdmins)
    }
  }

  const openSubAdminDialog = (subAdmin?: SubAdmin) => {
    if (subAdmin) {
      setEditingSubAdmin(subAdmin)
      setNewSubAdminUsername(subAdmin.username)
      setNewSubAdminPassword(subAdmin.password)
      setNewSubAdminPermissions({ ...subAdmin.permissions })
    } else {
      setEditingSubAdmin(null)
      setNewSubAdminUsername("")
      setNewSubAdminPassword("")
      setNewSubAdminPermissions(DEFAULT_PERMISSIONS)
    }
    setSubAdminDialogOpen(true)
  }

  const createTournament = () => {
    if (!hasPermission("canCreateTournaments")) {
      alert("You don't have permission to create tournaments")
      return
    }

    if (!newTournamentName || !newTournamentDate || newTournamentDays < 1) return

    // Ensure valid numbers with fallbacks
    const days = isNaN(newTournamentDays) || newTournamentDays < 1 ? 1 : newTournamentDays
    const threshold = isNaN(newTournamentThreshold) || newTournamentThreshold < 0 ? 0 : newTournamentThreshold
    const pigeonsPerPlayer = isNaN(newTournamentPigeons) || newTournamentPigeons < 1 ? 11 : newTournamentPigeons
    const specialPigeons =
      isNaN(newTournamentSpecialPigeons) || newTournamentSpecialPigeons < 0 ? 0 : newTournamentSpecialPigeons

    // Generate default dates for each day
    const dayDates = []
    for (let i = 0; i < days; i++) {
      const date = new Date(newTournamentDate)
      date.setDate(date.getDate() + i)
      dayDates.push(date.toISOString().split("T")[0])
    }

    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: newTournamentName,
      date: newTournamentDate,
      days: days,
      dayDates: dayDates,
      status: "upcoming",
      startTime: newTournamentStartTime,
      startPeriod: newTournamentStartPeriod,
      endTime: newTournamentEndTime,
      endPeriod: newTournamentEndPeriod,
      players: [],
      returnThreshold: threshold,
      pigeonsPerPlayer: pigeonsPerPlayer,
      helperPigeons:
        isNaN(newTournamentHelperPigeons) || newTournamentHelperPigeons < 0 ? 0 : newTournamentHelperPigeons,
      specialPigeons: specialPigeons,
    }

    const updatedTournaments = [...tournaments, newTournament]
    saveTournaments(updatedTournaments)
    setNewTournamentName("")
    setNewTournamentDate("")
    setNewTournamentDays(1)
    setNewTournamentThreshold(0)
    setNewTournamentPigeons(11)
    setNewTournamentHelperPigeons(0)
    setNewTournamentSpecialPigeons(0)
    setNewTournamentStartTime("06:00:00")
    setNewTournamentStartPeriod("AM")
    setNewTournamentEndTime("07:00:00")
    setNewTournamentEndPeriod("AM")
  }

  const toggleSpecialPigeon = (tournamentId: string, playerId: string, pigeonId?: string) => {
    if (!hasPermission("canManageSpecialPigeons")) {
      alert("You don't have permission to manage special pigeons")
      return
    }

    const tournament = tournaments.find((t) => t.id === tournamentId)
    const player = tournament?.players.find((p) => p.id === playerId)
    if (!tournament || !player) return

    if (pigeonId) {
      // Converting a normal pigeon to special for the current day
      const updatedTournaments = tournaments.map((tournament) => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            players: tournament.players.map((player) => {
              if (player.id === playerId) {
                return {
                  ...player,
                  pigeons: player.pigeons.map((pigeon) => {
                    if (pigeon.id === pigeonId) {
                      const updatedSpecialByDay = { ...pigeon.specialByDay }
                      updatedSpecialByDay[selectedDay] = true
                      return {
                        ...pigeon,
                        specialByDay: updatedSpecialByDay,
                      }
                    }
                    return pigeon
                  }),
                }
              }
              return player
            }),
          }
        }
        return tournament
      })
      saveTournaments(updatedTournaments)
    } else {
      // Converting special pigeon to normal for the current day
      if (confirm("Are you sure you want to remove special designation for this day?")) {
        const updatedTournaments = tournaments.map((tournament) => {
          if (tournament.id === tournamentId) {
            return {
              ...tournament,
              players: tournament.players.map((player) => {
                if (player.id === playerId) {
                  return {
                    ...player,
                    pigeons: player.pigeons.map((pigeon) => {
                      const updatedSpecialByDay = { ...pigeon.specialByDay }
                      delete updatedSpecialByDay[selectedDay]
                      return {
                        ...pigeon,
                        specialByDay: updatedSpecialByDay,
                      }
                    }),
                  }
                }
                return player
              }),
            }
          }
          return tournament
        })
        saveTournaments(updatedTournaments)
      }
    }
  }

  const resetPigeonTime = (tournamentId: string, playerId: string, pigeonId: string) => {
    if (!hasPermission("canManageTimes")) {
      alert("You don't have permission to manage times")
      return
    }

    if (confirm("Are you sure you want to reset this pigeon's time for this day?")) {
      const updatedTournaments = tournaments.map((tournament) => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            players: tournament.players.map((player) => {
              if (player.id === playerId) {
                return {
                  ...player,
                  pigeons: player.pigeons.map((pigeon) => {
                    if (pigeon.id === pigeonId) {
                      return {
                        ...pigeon,
                        dailyTimes: pigeon.dailyTimes.map((dayTime) => {
                          if (dayTime.day === selectedDay) {
                            return {
                              ...dayTime,
                              arrivalTime: null,
                              arrivalPeriod: null,
                              raceTime: null,
                              isCancelled: false,
                            }
                          }
                          return dayTime
                        }),
                      }
                    }
                    return pigeon
                  }),
                }
              }
              return player
            }),
          }
        }
        return tournament
      })
      saveTournaments(updatedTournaments)
    }
  }

  const togglePigeonCancellation = (tournamentId: string, playerId: string, pigeonId: string) => {
    if (!hasPermission("canManageTimes")) {
      alert("You don't have permission to manage times")
      return
    }

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === tournamentId) {
        return {
          ...tournament,
          players: tournament.players.map((player) => {
            if (player.id === playerId) {
              return {
                ...player,
                pigeons: player.pigeons.map((pigeon) => {
                  if (pigeon.id === pigeonId) {
                    return {
                      ...pigeon,
                      dailyTimes: pigeon.dailyTimes.map((dayTime) => {
                        if (dayTime.day === selectedDay) {
                          return {
                            ...dayTime,
                            isCancelled: !dayTime.isCancelled,
                          }
                        }
                        return dayTime
                      }),
                    }
                  }
                  return pigeon
                }),
              }
            }
            return player
          }),
        }
      }
      return tournament
    })
    saveTournaments(updatedTournaments)
  }

  const addPlayer = () => {
    if (!hasPermission("canManagePlayers")) {
      alert("You don't have permission to manage players")
      return
    }

    if (!newPlayerName || !selectedTournament) return

    const tournament = tournaments.find((t) => t.id === selectedTournament)
    if (!tournament) return

    // Create complete dailyTimes array for all tournament days
    const dailyTimesForPigeons = Array.from({ length: tournament.days }, (_, i) => ({
      day: i + 1,
      arrivalTime: null as string | null,
      arrivalPeriod: null as "AM" | "PM" | null,
      raceTime: null as string | null,
      isCancelled: false,
    }))

    const dailyReleasesForPlayer = Array.from({ length: tournament.days }, (_, i) => ({
      day: i + 1,
      releaseTime: null as string | null,
      releasePeriod: null as "AM" | "PM" | null,
      isLateRelease: false,
    }))

    const pigeons: Pigeon[] = Array.from({ length: tournament.pigeonsPerPlayer }, (_, i) => {
      return {
        id: `${Date.now()}-${i}`,
        name: `Pigeon ${i + 1}`,
        dailyTimes: [...dailyTimesForPigeons], // Create a copy for each pigeon
      }
    })

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      pigeons,
      dailyReleases: dailyReleasesForPlayer,
    }

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === selectedTournament) {
        return {
          ...tournament,
          players: [...tournament.players, newPlayer],
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setNewPlayerName("")
    setNewSpecialPigeonName("")
  }

  const openTimeDialog = (tournamentId: string, playerId: string, pigeonId: string) => {
    if (!hasPermission("canManageTimes")) {
      alert("You don't have permission to manage times")
      return
    }

    setSelectedPigeon({ tournamentId, playerId, pigeonId })

    // Find current time value for the selected day
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      const player = tournament.players.find((p) => p.id === playerId)
      if (player) {
        const pigeon = player.pigeons.find((p) => p.id === pigeonId)
        if (pigeon) {
          const dayTime = pigeon.dailyTimes.find((dt) => dt.day === selectedDay)
          if (dayTime) {
            setArrivalTimeValue(dayTime.arrivalTime || "")
            setArrivalPeriodValue(dayTime.arrivalPeriod || "AM")
          } else {
            setArrivalTimeValue("")
            setArrivalPeriodValue("AM")
          }
        }
      }
    }

    setTimeDialogOpen(true)
  }

  const openReleaseTimeDialog = (tournamentId: string, playerId: string) => {
    if (!hasPermission("canManageTimes")) {
      alert("You don't have permission to manage times")
      return
    }

    setSelectedPlayer({ tournamentId, playerId })

    // Find current release time for the selected day
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      const player = tournament.players.find((p) => p.id === playerId)
      if (player) {
        const playerRelease = getPlayerReleaseTime(player, selectedDay)
        if (playerRelease) {
          setReleaseTimeValue(playerRelease.releaseTime || "")
          setReleasePeriodValue(playerRelease.releasePeriod || "AM")
        } else {
          setReleaseTimeValue("")
          setReleasePeriodValue("AM")
        }
      }
    }

    setReleaseTimeDialogOpen(true)
  }

  const openSpecialPigeonDialog = (tournamentId: string, playerId: string) => {
    if (!hasPermission("canManageSpecialPigeons")) {
      alert("You don't have permission to manage special pigeons")
      return
    }

    setSelectedPlayer({ tournamentId, playerId })

    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      const player = tournament.players.find((p) => p.id === playerId)
      if (player) {
        setNewSpecialPigeonName(player.specialPigeonName || "Special Pigeon")
      }
    }

    setSpecialPigeonDialogOpen(true)
  }

  const openDateEditDialog = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      setEditingDayDates([...tournament.dayDates])
      setDateEditDialogOpen(true)
    }
  }

  const updateSpecialPigeonName = () => {
    if (!selectedPlayer) return

    const { tournamentId, playerId } = selectedPlayer

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === tournamentId) {
        return {
          ...tournament,
          players: tournament.players.map((player) => {
            if (player.id === playerId) {
              return {
                ...player,
                specialPigeonName: newSpecialPigeonName,
              }
            }
            return player
          }),
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setSpecialPigeonDialogOpen(false)
  }

  const updateDayDates = () => {
    if (!selectedTournament) return

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === selectedTournament) {
        return {
          ...tournament,
          dayDates: [...editingDayDates],
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setDateEditDialogOpen(false)
  }

  const updatePigeonTime = () => {
    if (!selectedPigeon) return

    const { tournamentId, playerId, pigeonId } = selectedPigeon
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (!tournament) return

    const player = tournament.players.find((p) => p.id === playerId)
    if (!player) return

    // Get player's release time for this day
    const playerRelease = getPlayerReleaseTime(player, selectedDay)

    // Calculate race time based on arrival time and player's release time (if provided)
    const raceTime = arrivalTimeValue
      ? calculateRaceTime(
          tournament.startTime,
          tournament.startPeriod,
          arrivalTimeValue,
          arrivalPeriodValue,
          playerRelease?.releaseTime,
          playerRelease?.releasePeriod,
        )
      : null

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === tournamentId) {
        return {
          ...tournament,
          players: tournament.players.map((player) => {
            if (player.id === playerId) {
              return {
                ...player,
                pigeons: player.pigeons.map((pigeon) => {
                  if (pigeon.id === pigeonId) {
                    return {
                      ...pigeon,
                      dailyTimes: pigeon.dailyTimes.map((dayTime) => {
                        if (dayTime.day === selectedDay) {
                          return {
                            ...dayTime,
                            arrivalTime: arrivalTimeValue,
                            arrivalPeriod: arrivalPeriodValue,
                            raceTime,
                          }
                        }
                        return dayTime
                      }),
                    }
                  }
                  return pigeon
                }),
              }
            }
            return player
          }),
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setTimeDialogOpen(false)
  }

  const updatePlayerReleaseTime = () => {
    if (!selectedPlayer) return

    const { tournamentId, playerId } = selectedPlayer
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (!tournament) return

    // Check if this is a late release
    let isLateReleaseFlag = false
    if (releaseTimeValue && releasePeriodValue) {
      isLateReleaseFlag = isLateRelease(
        tournament.startTime,
        tournament.startPeriod,
        releaseTimeValue,
        releasePeriodValue,
      )
    }

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === tournamentId) {
        return {
          ...tournament,
          players: tournament.players.map((player) => {
            if (player.id === playerId) {
              // Update player's release time for this day
              const updatedDailyReleases =
                player.dailyReleases?.map((dailyRelease) => {
                  if (dailyRelease.day === selectedDay) {
                    return {
                      ...dailyRelease,
                      releaseTime: releaseTimeValue,
                      releasePeriod: releasePeriodValue,
                      isLateRelease: isLateReleaseFlag,
                    }
                  }
                  return dailyRelease
                }) || []

              // Recalculate race times for all pigeons of this player for this day
              const updatedPigeons = player.pigeons.map((pigeon) => {
                return {
                  ...pigeon,
                  dailyTimes: pigeon.dailyTimes.map((dayTime) => {
                    if (dayTime.day === selectedDay && dayTime.arrivalTime && dayTime.arrivalPeriod) {
                      // Remove this duplicate line:
                      // const raceTime = calculateRaceTime(
                      // Keep only this complete raceTime calculation:
                      const raceTime = calculateRaceTime(
                        tournament.startTime,
                        tournament.startPeriod,
                        dayTime.arrivalTime,
                        dayTime.arrivalPeriod,
                        releaseTimeValue,
                        releasePeriodValue,
                      )
                      return {
                        ...dayTime,
                        raceTime,
                      }
                    }
                    return dayTime
                  }),
                }
              })

              return {
                ...player,
                dailyReleases: updatedDailyReleases,
                pigeons: updatedPigeons,
              }
            }
            return player
          }),
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setReleaseTimeDialogOpen(false)
  }

  const calculateDayRaceTime = (pigeons: Pigeon[], day: number) => {
    let totalMinutes = 0
    pigeons.forEach((pigeon) => {
      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
      if (dayTime?.raceTime && !dayTime?.isCancelled) {
        const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
        totalMinutes += hours * 60 + minutes + seconds / 60
      }
    })
    return totalMinutes
  }

  const calculateTotalRaceTime = (pigeons: Pigeon[], days: number) => {
    let totalMinutes = 0
    for (let day = 1; day <= days; day++) {
      totalMinutes += calculateDayRaceTime(pigeons, day)
    }
    return totalMinutes
  }

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    const secs = Math.floor((minutes % 1) * 60)
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const deleteTournament = (tournamentId: string) => {
    if (!hasPermission("canDeleteTournaments")) {
      alert("You don't have permission to delete tournaments")
      return
    }

    if (confirm("Are you sure you want to delete this tournament?")) {
      const updatedTournaments = tournaments.filter((t) => t.id !== tournamentId)
      saveTournaments(updatedTournaments)
      if (selectedTournament === tournamentId) {
        setSelectedTournament("")
      }
    }
  }

  const deletePlayer = (tournamentId: string, playerId: string) => {
    if (!hasPermission("canManagePlayers")) {
      alert("You don't have permission to manage players")
      return
    }

    if (confirm("Are you sure you want to delete this player?")) {
      const updatedTournaments = tournaments.map((tournament) => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            players: tournament.players.filter((p) => p.id !== playerId),
          }
        }
        return tournament
      })
      saveTournaments(updatedTournaments)
    }
  }

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const getSpecialPigeonsCount = (tournament: Tournament, day: number) => {
    let count = 0
    tournament.players.forEach((player) => {
      const specialPigeon = player.pigeons.find((p) => p.isSpecial)
      if (specialPigeon) {
        const dayTime = specialPigeon.dailyTimes.find((dt) => dt.day === day)
        if (dayTime?.raceTime && !dayTime?.isCancelled) {
          count++
        }
      }
    })
    return count
  }

  const getHelperPigeons = (pigeons: Pigeon[], helperCount: number, days: number): string[] => {
    if (helperCount === 0) return []

    // Check if ALL pigeons have arrived (have at least one recorded time across all days)
    const allPigeonsArrived = pigeons.every((pigeon) => {
      return pigeon.dailyTimes.some((dayTime) => dayTime.raceTime && !dayTime.isCancelled)
    })

    // Only apply helper pigeon logic if ALL pigeons have arrived
    if (!allPigeonsArrived) {
      return []
    }

    // Calculate total time for each pigeon across all days
    const pigeonTimes = pigeons.map((pigeon) => {
      let totalTime = 0
      let hasAnyTime = false

      for (let day = 1; day <= days; day++) {
        const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
        if (dayTime?.raceTime && !dayTime?.isCancelled) {
          const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
          totalTime += hours * 60 + minutes + seconds / 60
          hasAnyTime = true
        }
      }

      return {
        id: pigeon.id,
        totalTime: hasAnyTime ? totalTime : Number.POSITIVE_INFINITY,
        hasTime: hasAnyTime,
      }
    })

    // Sort by total time (LOWEST first for helper pigeons - best performing)
    return pigeonTimes
      .filter((p) => p.hasTime)
      .sort((a, b) => a.totalTime - b.totalTime) // Ascending order (lowest time first)
      .slice(0, helperCount)
      .map((p) => p.id)
  }

  const calculateDayRaceTimeExcludingHelpers = (pigeons: Pigeon[], day: number, helperPigeonIds: string[]) => {
    let totalMinutes = 0
    pigeons.forEach((pigeon) => {
      // Skip helper pigeons
      if (helperPigeonIds.includes(pigeon.id)) return

      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
      if (dayTime?.raceTime && !dayTime?.isCancelled) {
        const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
        totalMinutes += hours * 60 + minutes + seconds / 60
      }
    })
    return totalMinutes
  }

  const calculateTotalRaceTimeExcludingHelpers = (pigeons: Pigeon[], days: number, helperPigeonIds: string[]) => {
    let totalMinutes = 0
    for (let day = 1; day <= days; day++) {
      totalMinutes += calculateDayRaceTimeExcludingHelpers(pigeons, day, helperPigeonIds)
    }
    return totalMinutes
  }

  const openEditTournamentDialog = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setNewTournamentName(tournament.name)
    setNewTournamentDate(tournament.date)
    setNewTournamentDays(tournament.days)
    setNewTournamentThreshold(tournament.returnThreshold)
    setNewTournamentPigeons(tournament.pigeonsPerPlayer)
    setNewTournamentHelperPigeons(tournament.helperPigeons || 0)
    setNewTournamentSpecialPigeons(tournament.specialPigeons || 0)
    setNewTournamentStartTime(tournament.startTime)
    setNewTournamentStartPeriod(tournament.startPeriod)
    setNewTournamentEndTime(tournament.endTime)
    setNewTournamentEndPeriod(tournament.endPeriod)
    setEditTournamentDialogOpen(true)
  }

  const updateTournament = () => {
    if (!editingTournament || !hasPermission("canCreateTournaments")) {
      alert("You don't have permission to edit tournaments")
      return
    }

    if (!newTournamentName || !newTournamentDate || newTournamentDays < 1) return

    // Ensure valid numbers with fallbacks
    const days = isNaN(newTournamentDays) || newTournamentDays < 1 ? 1 : newTournamentDays
    const threshold = isNaN(newTournamentThreshold) || newTournamentThreshold < 0 ? 0 : newTournamentThreshold
    const pigeonsPerPlayer = isNaN(newTournamentPigeons) || newTournamentPigeons < 1 ? 11 : newTournamentPigeons
    const specialPigeons =
      isNaN(newTournamentSpecialPigeons) || newTournamentSpecialPigeons < 0 ? 0 : newTournamentSpecialPigeons

    // Generate updated dates for each day if days changed
    let dayDates = editingTournament.dayDates || []
    if (days !== editingTournament.days) {
      dayDates = []
      for (let i = 0; i < days; i++) {
        const date = new Date(newTournamentDate)
        date.setDate(date.getDate() + i)
        dayDates.push(date.toISOString().split("T")[0])
      }
    } else if (newTournamentDate !== editingTournament.date) {
      // Update dates if start date changed
      dayDates = []
      for (let i = 0; i < days; i++) {
        const date = new Date(newTournamentDate)
        date.setDate(date.getDate() + i)
        dayDates.push(date.toISOString().split("T")[0])
      }
    }

    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.id === editingTournament.id) {
        return {
          ...tournament,
          name: newTournamentName,
          date: newTournamentDate,
          days: days,
          dayDates: dayDates,
          startTime: newTournamentStartTime,
          startPeriod: newTournamentStartPeriod,
          endTime: newTournamentEndTime,
          endPeriod: newTournamentEndPeriod,
          returnThreshold: threshold,
          pigeonsPerPlayer: pigeonsPerPlayer,
          helperPigeons:
            isNaN(newTournamentHelperPigeons) || newTournamentHelperPigeons < 0 ? 0 : newTournamentHelperPigeons,
          specialPigeons: specialPigeons,
        }
      }
      return tournament
    })

    saveTournaments(updatedTournaments)
    setEditTournamentDialogOpen(false)
    setEditingTournament(null)

    // Clear form
    setNewTournamentName("")
    setNewTournamentDate("")
    setNewTournamentDays(1)
    setNewTournamentThreshold(0)
    setNewTournamentPigeons(11)
    setNewTournamentHelperPigeons(0)
    setNewTournamentSpecialPigeons(0)
    setNewTournamentStartTime("06:00:00")
    setNewTournamentStartPeriod("AM")
    setNewTournamentEndTime("07:00:00")
    setNewTournamentEndPeriod("AM")
  }

  // Function to check if a pigeon is special for a specific day
  const isPigeonSpecialForDay = (pigeon: Pigeon, day: number): boolean => {
    // Check if this pigeon is marked as special for this specific day
    return pigeon.specialByDay && pigeon.specialByDay[day] === true
  }

  // Get special titles for the selected tournament and selected day only - STRICT filtering
  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament)
  const specialTitles = selectedTournamentData ? getDailySpecialTitles(selectedTournamentData, selectedDay) : []

  // Helper function to check if a pigeon has a special title for the CURRENT selected day only
  const getPigeonTitle = (playerId: string, pigeonId: string): SpecialTitle | null => {
    return (
      specialTitles.find(
        (title) => title.playerId === playerId && title.pigeonId === pigeonId && title.day === selectedDay,
      ) || null
    )
  }

  const handleLogin = () => {
    try {
      // Check main admin
      if (username === MAIN_ADMIN_USERNAME && password === MAIN_ADMIN_PASSWORD) {
        const user = { username: MAIN_ADMIN_USERNAME, isMainAdmin: true }
        setCurrentUser(user)
        setIsAuthenticated(true)

        // Store authentication state
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))

        setUsername("")
        setPassword("")
        return
      }

      // Check sub-admins
      const subAdmin = subAdmins.find(
        (admin) => admin.username === username && admin.password === password && admin.isActive,
      )

      if (subAdmin) {
        const user = {
          username: subAdmin.username,
          isMainAdmin: false,
          permissions: subAdmin.permissions,
        }
        setCurrentUser(user)
        setIsAuthenticated(true)

        // Store authentication state
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))

        setUsername("")
        setPassword("")
      } else {
        alert("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    }
  }

  // New function to get helper pigeons for a specific day
  const getHelperPigeonsForDay = (player: Player, tournament: Tournament, day: number): string[] => {
    if (tournament.helperPigeons === 0) return []

    // Calculate total time for each pigeon for this specific day only
    const pigeonTimes = player.pigeons.map((pigeon) => {
      let totalTime = 0
      let hasTime = false

      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
      if (dayTime?.raceTime && !dayTime?.isCancelled) {
        const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
        totalTime = hours * 60 + minutes + seconds / 60
        hasTime = true
      }

      return {
        id: pigeon.id,
        totalTime: hasTime ? totalTime : Number.POSITIVE_INFINITY,
        hasTime,
      }
    })

    // Sort by total time (LOWEST first for helper pigeons - best performing)
    return pigeonTimes
      .filter((p) => p.hasTime)
      .sort((a, b) => a.totalTime - b.totalTime) // Ascending order (lowest time first)
      .slice(0, tournament.helperPigeons || 0)
      .map((p) => p.id)
  }

  const saveToDatabase = async () => {
    try {
      const response = await fetch("/api/admin/tournaments/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournaments }),
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error:", errorText)
        alert(`Server error (${response.status}): ${errorText}`)
        return
      }

      // Try to parse JSON
      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        const responseText = await response.text()
        console.error("Invalid JSON response:", responseText)
        alert("Server returned invalid response. Check console for details.")
        return
      }

      if (result.success) {
        let message = result.message
        if (result.warning) {
          message += `\n\nNote: ${result.warning}`
        }
        alert(message)
        if (result.errors && result.errors.length > 0) {
          console.log("Some errors occurred:", result.errors)
        }
      } else {
        alert(`Error: ${result.error}`)
        if (result.details) {
          console.error("Error details:", result.details)
        }
      }
    } catch (error) {
      console.error("Network error saving to database:", error)
      alert("Network error: Unable to connect to server")
    }
  }

  const saveSubAdminsToDatabase = async () => {
    try {
      const response = await fetch("/api/admin/sub-admins/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subAdmins }),
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error:", errorText)
        alert(`Server error (${response.status}): ${errorText}`)
        return
      }

      // Try to parse JSON
      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        const responseText = await response.text()
        console.error("Invalid JSON response:", responseText)
        alert("Server returned invalid response. Check console for details.")
        return
      }

      if (result.success) {
        alert(`Success! ${result.message}`)
        if (result.errors && result.errors.length > 0) {
          console.log("Some errors occurred:", result.errors)
        }
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Network error saving to database:", error)
      alert("Network error: Unable to connect to server")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-2xl">High Flyer Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 text-gray-400 absolute ml-3" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center mt-1">
                  <Lock className="w-4 h-4 text-gray-400 absolute ml-3" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter password"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <style jsx>{`
        @keyframes blinkRed {
          0%, 70% { 
            background: linear-gradient(135deg, #fee2e2, #fca5a5);
            border-color: #f87171;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
            color: #7f1d1d;
          }
          71%, 100% { 
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            border-color: #dc2626;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
            color: white;
          }
        }

        @keyframes blinkGreen {
          0%, 70% { 
            background: linear-gradient(135deg, #dcfce7, #86efac);
            border-color: #4ade80;
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
            color: #14532d;
          }
          71%, 100% { 
            background: linear-gradient(135deg, #16a34a, #15803d);
            border-color: #16a34a;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
            color: white;
          }
        }

        @keyframes blinkPurple {
          0%, 70% { 
            background: linear-gradient(135deg, #f3e8ff, #c084fc);
            border-color: #a855f7;
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
            color: #581c87;
          }
          71%, 100% { 
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border-color: #8b5cf6;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
            color: white;
          }
        }

        .akhri-bahadur {
          animation: blinkRed 2s infinite;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .pehla-bahadur {
          animation: blinkGreen 2s infinite;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .special-champion {
          animation: blinkPurple 2s infinite;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .badge-content {
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .akhri-bahadur .badge-content {
          color: inherit !important;
        }

        .pehla-bahadur .badge-content {
          color: inherit !important;
        }

        .special-champion .badge-content {
          color: inherit !important;
        }
        
        .late-release {
          color: #dc2626;
          font-weight: bold;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">High Flyer Admin Panel</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {currentUser?.username}
              {currentUser?.isMainAdmin ? " (Main Admin)" : " (Sub Admin)"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false)
              setCurrentUser(null)
              localStorage.removeItem("adminAuthenticated")
              localStorage.removeItem("currentUser")
            }}
          >
            Logout
          </Button>
        </div>

        {/* Database Configuration Warning */}
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Database Configuration:</strong> If you haven't set up Supabase yet, the save functionality will work in mock mode. 
            To enable real database operations, please configure your Supabase environment variables and run the database setup scripts.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="w-full md:w-auto overflow-x-auto flex-nowrap">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="players">Players & Times</TabsTrigger>
            {currentUser?.isMainAdmin && <TabsTrigger value="admins">Sub Admins</TabsTrigger>}
          </TabsList>

          <TabsContent value="tournaments">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Create Tournament */}
                  {hasPermission("canCreateTournaments") && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Create New Tournament</h3>
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="md:col-span-2 lg:col-span-1">
                            <Label htmlFor="tournamentName">Tournament Name</Label>
                            <Input
                              id="tournamentName"
                              value={newTournamentName}
                              onChange={(e) => setNewTournamentName(e.target.value)}
                              placeholder="Enter tournament name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tournamentDate">Start Date</Label>
                            <Input
                              id="tournamentDate"
                              type="date"
                              value={newTournamentDate}
                              onChange={(e) => setNewTournamentDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="tournamentDays">Duration (Days)</Label>
                            <Input
                              id="tournamentDays"
                              type="number"
                              min="1"
                              value={isNaN(newTournamentDays) ? 1 : newTournamentDays}
                              onChange={(e) =>
                                setNewTournamentDays(e.target.value === "" ? 1 : Number.parseInt(e.target.value) || 1)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="pigeonsPerPlayer">Pigeons per Player</Label>
                            <Input
                              id="pigeonsPerPlayer"
                              type="number"
                              min="1"
                              max="20"
                              value={isNaN(newTournamentPigeons) ? 11 : newTournamentPigeons}
                              onChange={(e) =>
                                setNewTournamentPigeons(
                                  e.target.value === "" ? 11 : Number.parseInt(e.target.value) || 11,
                                )
                              }
                              placeholder="11"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="returnThreshold">Return Threshold</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>
                                      Minimum number of pigeons that must return for a player to qualify for Pehla
                                      Bahadur. Can be set to 0.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              id="returnThreshold"
                              type="number"
                              min="0"
                              value={isNaN(newTournamentThreshold) ? 0 : newTournamentThreshold}
                              onChange={(e) =>
                                setNewTournamentThreshold(
                                  e.target.value === "" ? 0 : Number.parseInt(e.target.value) || 0,
                                )
                              }
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <Label htmlFor="helperPigeons">Helper Pigeons per Player</Label>
                            <Input
                              id="helperPigeons"
                              type="number"
                              min="0"
                              max="5"
                              value={isNaN(newTournamentHelperPigeons) ? 0 : newTournamentHelperPigeons}
                              onChange={(e) =>
                                setNewTournamentHelperPigeons(
                                  e.target.value === "" ? 0 : Number.parseInt(e.target.value) || 0,
                                )
                              }
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <Label htmlFor="specialPigeons">Special Pigeons per Player</Label>
                            <Input
                              id="specialPigeons"
                              type="number"
                              min="0"
                              max="3"
                              value={isNaN(newTournamentSpecialPigeons) ? 0 : newTournamentSpecialPigeons}
                              onChange={(e) =>
                                setNewTournamentSpecialPigeons(
                                  e.target.value === "" ? 0 : Number.parseInt(e.target.value) || 0,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Daily Start Time</Label>
                            <div className="flex gap-2">
                              <Input
                                type="time"
                                step="1"
                                value={newTournamentStartTime}
                                onChange={(e) => setNewTournamentStartTime(e.target.value)}
                                className="flex-1"
                              />
                              <Select
                                value={newTournamentStartPeriod}
                                onValueChange={(value: "AM" | "PM") => setNewTournamentStartPeriod(value)}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Daily End Time</Label>
                            <div className="flex gap-2">
                              <Input
                                type="time"
                                step="1"
                                value={newTournamentEndTime}
                                onChange={(e) => setNewTournamentEndTime(e.target.value)}
                                className="flex-1"
                              />
                              <Select
                                value={newTournamentEndPeriod}
                                onValueChange={(value: "AM" | "PM") => setNewTournamentEndPeriod(value)}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <Button onClick={createTournament} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Tournament
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Tournament List */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Existing Tournaments</h3>
                    {tournaments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border rounded-lg">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tournaments created yet</p>
                      </div>
                    ) : (
                      tournaments.map((tournament) => (
                        <div key={tournament.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <h4 className="font-medium text-lg">{tournament.name}</h4>
                              <p className="text-gray-600">
                                {tournament.date} • {tournament.days} {tournament.days > 1 ? "days" : "day"}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Daily Start: {tournament.startTime} {tournament.startPeriod}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4" />
                                  {tournament.pigeonsPerPlayer} pigeons per player
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  Helper Pigeons: {tournament.helperPigeons}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  Special Pigeons: {tournament.specialPigeons || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4" />
                                  Return Threshold: {tournament.returnThreshold} pigeons
                                </div>
                              </div>
                              <Badge className="mt-2">{tournament.status}</Badge>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-start">
                              <span className="text-sm text-gray-600">{tournament.players.length} players</span>
                              {hasPermission("canCreateTournaments") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditTournamentDialog(tournament)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {hasPermission("canDeleteTournaments") && (
                                <Button variant="destructive" size="sm" onClick={() => deleteTournament(tournament.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {/* Save to Database Button */}
                    {tournaments.length > 0 && (
                      <div className="border rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-green-800">Save to Database</h3>
                            <p className="text-sm text-green-600">Save all tournament data to the database</p>
                          </div>
                          <Button onClick={saveToDatabase} className="bg-green-600 hover:bg-green-700">
                            💾 Save Tournaments to Database
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle>Player & Time Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Tournament Selection */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold mb-4">Select Tournament</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tournament">Choose Tournament</Label>
                        <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tournament to manage" />
                          </SelectTrigger>
                          <SelectContent>
                            {tournaments.map((tournament) => (
                              <SelectItem key={tournament.id} value={tournament.id}>
                                {tournament.name} ({tournament.players.length} players)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedTournamentData && (
                        <div className="text-sm text-gray-600 mt-6">
                          <p>
                            <strong>{selectedTournamentData.name}</strong>
                          </p>
                          <p>
                            {selectedTournamentData.days} days • {selectedTournamentData.pigeonsPerPlayer} pigeons per
                            player
                          </p>
                          <p>Return threshold: {selectedTournamentData.returnThreshold} pigeons</p>
                          <p>Special pigeons: {selectedTournamentData.specialPigeons || 0} per player</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTournamentData && (
                    <>
                      {/* Tournament Dates Management */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Tournament Dates</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDateEditDialog(selectedTournamentData.id)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Edit Dates
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                          {selectedTournamentData.dayDates.map((date, index) => (
                            <div key={index} className="text-center p-2 bg-gray-100 rounded">
                              <div className="text-xs text-gray-500">Day {index + 1}</div>
                              <div className="font-medium">{formatDateDisplay(date)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Titles Display - Only for selected day */}
                      {specialTitles.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-4">Day {selectedDay} Special Titles</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {specialTitles.map((title, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border-2 ${
                                  title.type === "akhri_bahadur"
                                    ? "akhri-bahadur"
                                    : title.type === "pehla_bahadur"
                                      ? "pehla-bahadur"
                                      : "special-champion"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    {title.type === "akhri_bahadur" ? (
                                      <Crown className="w-6 h-6 text-white" />
                                    ) : title.type === "pehla_bahadur" ? (
                                      <Award className="w-6 h-6 text-white" />
                                    ) : (
                                      <Star className="w-6 h-6 text-white" />
                                    )}
                                  </div>
                                  <div className="text-white">
                                    <h4 className="font-bold">
                                      {title.type === "akhri_bahadur"
                                        ? "آخری بہادر (Akhri Bahadur)"
                                        : title.type === "pehla_bahadur"
                                          ? "پہلا بہادر (Pehla Bahadur)"
                                          : "خصوصی چیمپیئن (Special Champion)"}
                                    </h4>
                                    <p className="text-sm">
                                      <strong>{title.playerName}</strong> - {title.pigeonName}
                                    </p>
                                    <p className="text-xs font-mono">Time: {title.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Player */}
                      {hasPermission("canManagePlayers") && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-4">Add New Player</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="playerName">Player Name</Label>
                              <Input
                                id="playerName"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                placeholder="Enter player name"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button onClick={addPlayer} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Player ({selectedTournamentData.pigeonsPerPlayer} pigeons)
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Search Bar */}
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center gap-4">
                          <div className="w-full">
                            <Label htmlFor="playerSearch">Search Players</Label>
                            <Input
                              id="playerSearch"
                              value={playerSearchTerm}
                              onChange={(e) => setPlayerSearchTerm(e.target.value)}
                              placeholder="Enter player name to search..."
                              className="bg-white"
                            />
                          </div>
                          {playerSearchTerm && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPlayerSearchTerm("")}
                              className="mt-6"
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Day selection */}
                      <div className="border rounded-lg p-4">
                        <Label>Select Day for Time Entry</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Array.from({ length: selectedTournamentData.days }, (_, i) => (
                            <Button
                              key={i}
                              variant={selectedDay === i + 1 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedDay(i + 1)}
                              className="text-xs md:text-sm"
                            >
                              Day {i + 1} ({formatDateDisplay(selectedTournamentData.dayDates[i])})
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Players and Times */}
                      <div className="space-y-4">
                        {selectedTournamentData.players
                          .filter((player) => player.name.toLowerCase().includes(playerSearchTerm.toLowerCase()))
                          .map((player) => {
                            const helperPigeonIds = getHelperPigeonsForDay(player, selectedTournamentData, selectedDay)
                            const playerRelease = getPlayerReleaseTime(player, selectedDay)

                            return (
                              <div key={player.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                  <div>
                                    <div className="flex items-center gap-3">
                                      <h4 className="font-medium text-lg">{player.name}</h4>
                                      {playerRelease && playerRelease.releaseTime && (
                                        <div
                                          className={`text-sm px-2 py-1 rounded ${playerRelease.isLateRelease ? "bg-red-100 text-red-800 late-release" : "bg-blue-100 text-blue-800"}`}
                                        >
                                          Released: {playerRelease.releaseTime} {playerRelease.releasePeriod}
                                          {playerRelease.isLateRelease && " (Late)"}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      Day {selectedDay} Race Time (excluding helpers):{" "}
                                      {formatTime(
                                        calculateDayRaceTimeExcludingHelpers(
                                          player.pigeons,
                                          selectedDay,
                                          helperPigeonIds,
                                        ),
                                      )}
                                    </div>
                                    {selectedTournamentData.days > 1 && (
                                      <div className="text-sm text-blue-600 font-semibold mt-1">
                                        Total Tournament Race Time (excluding helpers):{" "}
                                        {formatTime(
                                          calculateTotalRaceTimeExcludingHelpers(
                                            player.pigeons,
                                            selectedTournamentData.days,
                                            helperPigeonIds,
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    {hasPermission("canManageTimes") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openReleaseTimeDialog(selectedTournamentData.id, player.id)}
                                      >
                                        <Clock className="w-4 h-4 mr-1" />
                                        Set Release Time
                                      </Button>
                                    )}
                                    {hasPermission("canManageSpecialPigeons") &&
                                      selectedTournamentData.specialPigeons > 0 && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => openSpecialPigeonDialog(selectedTournamentData.id, player.id)}
                                        >
                                          <Star className="w-4 h-4 mr-1" />
                                          Edit Special Name
                                        </Button>
                                      )}
                                    {hasPermission("canManagePlayers") && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deletePlayer(selectedTournamentData.id, player.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Pigeon Time Management */}
                                <div className="mt-4">
                                  <h5 className="text-sm font-medium mb-2">Pigeons - Day {selectedDay}</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {player.pigeons.map((pigeon) => {
                                      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === selectedDay)
                                      const isHelper = helperPigeonIds.includes(pigeon.id)
                                      const pigeonTitle = getPigeonTitle(player.id, pigeon.id)
                                      const isSpecialForDay = pigeon.specialByDay && pigeon.specialByDay[selectedDay]

                                      return (
                                        <div
                                          key={pigeon.id}
                                          className={`border rounded-lg p-3 ${
                                            isSpecialForDay
                                              ? "bg-yellow-50 border-yellow-200"
                                              : isHelper
                                                ? "bg-green-50 border-green-200"
                                                : "bg-white"
                                          } ${
                                            pigeonTitle?.type === "akhri_bahadur"
                                              ? "border-red-500 border-2"
                                              : pigeonTitle?.type === "pehla_bahadur"
                                                ? "border-green-500 border-2"
                                                : ""
                                          } ${dayTime?.isCancelled ? "opacity-50" : ""}`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <div className="font-medium">
                                                {isSpecialForDay ? "DM Pigeon" : pigeon.name}
                                                {isHelper && (
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 bg-green-100 text-green-800 text-xs"
                                                  >
                                                    Helper
                                                  </Badge>
                                                )}
                                                {dayTime?.isCancelled && (
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 bg-red-100 text-red-800 text-xs"
                                                  >
                                                    Cancelled
                                                  </Badge>
                                                )}
                                              </div>

                                              {pigeonTitle && (
                                                <Badge
                                                  className={`mt-1 ${
                                                    pigeonTitle.type === "akhri_bahadur"
                                                      ? "bg-red-100 text-red-800"
                                                      : pigeonTitle.type === "pehla_bahadur"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-purple-100 text-purple-800"
                                                  }`}
                                                >
                                                  {pigeonTitle.type === "akhri_bahadur"
                                                    ? "Akhri Bahadur"
                                                    : pigeonTitle.type === "pehla_bahadur"
                                                      ? "Pehla Bahadur"
                                                      : "Special Champion"}
                                                </Badge>
                                              )}

                                              <div className="text-xs text-gray-500 mt-1">
                                                {dayTime?.arrivalTime && !dayTime?.isCancelled
                                                  ? `Arrival: ${dayTime.arrivalTime} ${dayTime.arrivalPeriod}`
                                                  : dayTime?.isCancelled
                                                    ? "Cancelled"
                                                    : "No arrival time"}
                                              </div>

                                              {dayTime?.raceTime && !dayTime?.isCancelled && (
                                                <div className="text-xs font-medium text-blue-600 mt-1">
                                                  Race Time: {dayTime.raceTime}
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                              {!isSpecialForDay && hasPermission("canManageSpecialPigeons") && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    toggleSpecialPigeon(selectedTournamentData.id, player.id, pigeon.id)
                                                  }
                                                  className="h-6 w-6 p-0"
                                                >
                                                  <Star className="h-4 w-4 text-yellow-500" />
                                                </Button>
                                              )}

                                              {isSpecialForDay && hasPermission("canManageSpecialPigeons") && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    toggleSpecialPigeon(selectedTournamentData.id, player.id)
                                                  }
                                                  className="h-6 w-6 p-0"
                                                >
                                                  <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex gap-1 mt-2">
                                            {hasPermission("canManageTimes") && (
                                              <>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    openTimeDialog(selectedTournamentData.id, player.id, pigeon.id)
                                                  }
                                                  className="flex-1 text-xs"
                                                >
                                                  <Clock className="w-3 h-3 mr-1" />
                                                  {dayTime?.arrivalTime ? "Edit Time" : "Enter Time"}
                                                </Button>

                                                {(dayTime?.arrivalTime || dayTime?.raceTime) && (
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      resetPigeonTime(selectedTournamentData.id, player.id, pigeon.id)
                                                    }
                                                    className="text-xs text-orange-600 hover:text-orange-700"
                                                  >
                                                    Reset
                                                  </Button>
                                                )}

                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    togglePigeonCancellation(
                                                      selectedTournamentData.id,
                                                      player.id,
                                                      pigeon.id,
                                                    )
                                                  }
                                                  className={`text-xs ${
                                                    dayTime?.isCancelled
                                                      ? "text-green-600 hover:text-green-700"
                                                      : "text-red-600 hover:text-red-700"
                                                  }`}
                                                >
                                                  {dayTime?.isCancelled ? "Uncancel" : "Cancel"}
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                      {selectedTournamentData && selectedTournamentData.players.length > 0 && (
                        <div className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-blue-800">Save Player Data</h3>
                            <Button onClick={saveToDatabase} className="bg-blue-600 hover:bg-blue-700">
                              💾 Save Player Times to Database
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser?.isMainAdmin && (
            <TabsContent value="admins">
              <Card>
                <CardHeader>
                  <CardTitle>Sub-Admin Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Create Sub-Admin */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Create New Sub-Admin</h3>
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="subAdminUsername">Username</Label>
                            <Input
                              id="subAdminUsername"
                              value={newSubAdminUsername}
                              onChange={(e) => setNewSubAdminUsername(e.target.value)}
                              placeholder="Enter username"
                              disabled={!!editingSubAdmin}
                            />
                          </div>
                          <div>
                            <Label htmlFor="subAdminPassword">Password</Label>
                            <Input
                              id="subAdminPassword"
                              type="password"
                              value={newSubAdminPassword}
                              onChange={(e) => setNewSubAdminPassword(e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Permissions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2\">
