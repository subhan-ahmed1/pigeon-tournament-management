"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Calendar, Clock, Users, Target, Search, ArrowLeft, Award, Star, Crown } from "lucide-react"

interface DailyTime {
  day: number
  arrivalTime: string | null
  arrivalPeriod: "AM" | "PM" | null
  raceTime: string | null
  date?: string
  isCancelled?: boolean
}

interface PlayerDailyRelease {
  day: number
  releaseTime: string | null
  releasePeriod: "AM" | "PM" | null
  isLateRelease: boolean
}

interface Pigeon {
  id: string
  name: string
  dailyTimes: DailyTime[]
  isSpecial?: boolean
  specialByDay?: { [day: number]: boolean }
}

interface Player {
  id: string
  name: string
  pigeons: Pigeon[]
  specialPigeonName?: string
  dailyReleases?: PlayerDailyRelease[]
}

interface Tournament {
  id: string
  name: string
  date: string
  days: number
  dayDates?: string[]
  status: "upcoming" | "active" | "completed"
  startTime: string
  startPeriod: "AM" | "PM"
  endTime: string
  endPeriod: "PM" | "PM"
  players: Player[]
  returnThreshold: number
  pigeonsPerPlayer: number
  helperPigeons?: number
  specialPigeons?: number
}

interface DailySpecialTitle {
  type: "akhri_bahadur" | "pehla_bahadur" | "special_champion" | "best_average"
  day: number
  playerId: string
  pigeonId: string
  playerName: string
  pigeonName: string
  time: string
  raceTimeMinutes: number
}

interface PlayerDailySummary {
  playerId: string
  playerName: string
  day: number
  totalTime: number
  formattedTime: string
  returnedCount: number
  averageTime: number
  formattedAvgTime: string
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | "total">("total")
  const [playerSearchTerm, setPlayerSearchTerm] = useState("")
  const [playerDailySummaries, setPlayerDailySummaries] = useState<PlayerDailySummary[]>([])

  useEffect(() => {
    // Load tournaments from localStorage
    const savedTournaments = localStorage.getItem("tournaments")
    if (savedTournaments) {
      const loadedTournaments = JSON.parse(savedTournaments)
      // Ensure all tournaments have dayDates array
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
        return tournament
      })
      setTournaments(updatedTournaments)
    } else {
      // Sample data with new format - multi-day tournament (15 days for testing)
      const sampleTournaments: Tournament[] = [
        {
          id: "1",
          name: "Spring Championship 2024",
          date: "2024-05-24",
          days: 15,
          dayDates: Array.from({ length: 15 }, (_, i) => {
            const date = new Date("2024-05-24")
            date.setDate(date.getDate() + i)
            return date.toISOString().split("T")[0]
          }),
          status: "active",
          startTime: "06:00:00",
          startPeriod: "AM",
          endTime: "07:00:00",
          endPeriod: "PM",
          returnThreshold: 50,
          pigeonsPerPlayer: 11,
          helperPigeons: 3,
          specialPigeons: 1,
          players: [
            {
              id: "1",
              name: "راجہ جاوید محمد آباد",
              specialPigeonName: "Thunder Bolt",
              pigeons: Array.from({ length: 11 }, (_, i) => ({
                id: `p1-${i + 1}`,
                name: `Pigeon ${i + 1}`,
                isSpecial: i === 10,
                specialByDay: { 1: i === 10 },
                dailyTimes: Array.from({ length: 15 }, (_, day) => ({
                  day: day + 1,
                  arrivalTime:
                    i < 11
                      ? `${(9 + Math.floor(i / 2)).toString().padStart(2, "0")}:${(52 + i * 3).toString().padStart(2, "0")}:00`
                      : null,
                  arrivalPeriod: i < 9 ? ("AM" as const) : ("PM" as const),
                  raceTime:
                    i < 11
                      ? `0${(3 + Math.floor(i / 2)).toString()}:${(52 + i * 3).toString().padStart(2, "0")}:00`
                      : null,
                  date: "2024-05-24",
                  isCancelled: false,
                })),
              })),
            },
            {
              id: "2",
              name: "راجہ جاوید گھڑ کلاں",
              specialPigeonName: "Lightning Strike",
              pigeons: Array.from({ length: 11 }, (_, i) => ({
                id: `p2-${i + 1}`,
                name: `Pigeon ${i + 1}`,
                isSpecial: i === 10,
                specialByDay: { 1: i === 10 },
                dailyTimes: Array.from({ length: 15 }, (_, day) => ({
                  day: day + 1,
                  arrivalTime:
                    i < 10
                      ? `${(8 + Math.floor(i / 2)).toString().padStart(2, "0")}:${(2 + i * 10).toString().padStart(2, "0")}:00`
                      : null,
                  arrivalPeriod: i < 7 ? ("AM" as const) : ("PM" as const),
                  raceTime:
                    i < 10
                      ? `0${(2 + Math.floor(i / 2)).toString()}:${(2 + i * 10).toString().padStart(2, "0")}:00`
                      : null,
                  date: "2024-05-24",
                  isCancelled: false,
                })),
              })),
            },
            {
              id: "3",
              name: "چوہدری مصیب اندازہ کرم سرائے کشمیر",
              specialPigeonName: "Golden Eagle",
              pigeons: Array.from({ length: 11 }, (_, i) => ({
                id: `p3-${i + 1}`,
                name: `Pigeon ${i + 1}`,
                isSpecial: i === 10,
                specialByDay: { 1: i === 10 },
                dailyTimes: Array.from({ length: 15 }, (_, day) => ({
                  day: day + 1,
                  arrivalTime:
                    i < 9
                      ? `${(7 + Math.floor(i / 2)).toString().padStart(2, "0")}:${(15 + i * 8).toString().padStart(2, "0")}:45`
                      : null,
                  arrivalPeriod: i < 5 ? ("AM" as const) : ("PM" as const),
                  raceTime:
                    i < 9
                      ? `0${(1 + Math.floor(i / 2)).toString()}:${(15 + i * 8).toString().padStart(2, "0")}:45`
                      : null,
                  date: "2024-05-24",
                  isCancelled: false,
                })),
              })),
            },
            {
              id: "4",
              name: "استاد ملک شہیم بخش گوجر خانہ",
              specialPigeonName: "Storm Rider",
              pigeons: Array.from({ length: 11 }, (_, i) => ({
                id: `p4-${i + 1}`,
                name: `Pigeon ${i + 1}`,
                isSpecial: i === 10,
                specialByDay: { 1: i === 10 },
                dailyTimes: Array.from({ length: 15 }, (_, day) => ({
                  day: day + 1,
                  arrivalTime:
                    i < 11
                      ? `${(8 + Math.floor(i / 3)).toString().padStart(2, "0")}:${(5 + i * 5).toString().padStart(2, "0")}:${(30 + i * 3).toString().padStart(2, "0")}`
                      : null,
                  arrivalPeriod: i < 8 ? ("AM" as const) : ("PM" as const),
                  raceTime:
                    i < 11
                      ? `0${(2 + Math.floor(i / 3)).toString()}:${(5 + i * 5).toString().padStart(2, "0")}:${(30 + i * 3).toString().padStart(2, "0")}`
                      : null,
                  date: "2024-05-24",
                  isCancelled: false,
                })),
              })),
            },
          ],
        },
        {
          id: "2",
          name: "Summer Tournament",
          date: "2025-06-06",
          days: 1,
          dayDates: ["2025-06-06"],
          status: "upcoming",
          startTime: "06:00:00",
          startPeriod: "AM",
          endTime: "07:00:00",
          endPeriod: "PM",
          returnThreshold: 0,
          pigeonsPerPlayer: 5,
          helperPigeons: 0,
          specialPigeons: 0,
          players: [
            {
              id: "1",
              name: "Player 1",
              pigeons: Array.from({ length: 5 }, (_, i) => ({
                id: `p1-${i + 1}`,
                name: `Pigeon ${i + 1}`,
                specialByDay: {},
                dailyTimes: [
                  {
                    day: 1,
                    arrivalTime: null,
                    arrivalPeriod: null,
                    raceTime: null,
                    date: "2025-06-06",
                    isCancelled: false,
                  },
                ],
              })),
            },
          ],
        },
      ]
      setTournaments(sampleTournaments)
      localStorage.setItem("tournaments", JSON.stringify(sampleTournaments))
    }
  }, [])

  // Calculate daily summaries for all players when tournament or day changes
  useEffect(() => {
    if (selectedTournament && selectedDay !== "total") {
      const tournament = tournaments.find((t) => t.id === selectedTournament)
      if (tournament) {
        const day = Number(selectedDay)
        const summaries: PlayerDailySummary[] = []

        tournament.players.forEach((player) => {
          const totalTime = calculateDayRaceTime(player.pigeons, day)
          const returnedCount = getReturnedPigeonsCountForDay(player.pigeons, day)
          const averageTime = returnedCount > 0 ? totalTime / returnedCount : 0

          summaries.push({
            playerId: player.id,
            playerName: player.name,
            day,
            totalTime,
            formattedTime: formatTimeHoursTotal(totalTime),
            returnedCount,
            averageTime,
            formattedAvgTime: formatTime(averageTime),
          })
        })

        // Sort by total time (highest first)
        summaries.sort((a, b) => b.totalTime - a.totalTime)
        setPlayerDailySummaries(summaries)
      }
    }
  }, [selectedTournament, selectedDay, tournaments])

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

  const calculateRaceTimeInMinutes = (
    startTime: string,
    startPeriod: "AM" | "PM",
    arrivalTime: string,
    arrivalPeriod: "AM" | "PM",
  ): number => {
    const startMinutes = timeToMinutes(startTime, startPeriod)
    const arrivalMinutes = timeToMinutes(arrivalTime, arrivalPeriod)

    let raceMinutes = arrivalMinutes - startMinutes

    // Handle next day arrival
    if (raceMinutes < 0) {
      raceMinutes += 24 * 60
    }

    return raceMinutes
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

  const calculateDayAverageTime = (pigeons: Pigeon[], day: number) => {
    let totalMinutes = 0
    let returnedCount = 0

    pigeons.forEach((pigeon) => {
      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
      if (dayTime?.raceTime && !dayTime?.isCancelled) {
        const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
        totalMinutes += hours * 60 + minutes + seconds / 60
        returnedCount++
      }
    })

    return returnedCount > 0 ? totalMinutes / returnedCount : 0
  }

  const calculateTotalRaceTime = (pigeons: Pigeon[], days: number) => {
    let totalMinutes = 0
    for (let day = 1; day <= days; day++) {
      totalMinutes += calculateDayRaceTime(pigeons, day)
    }
    return totalMinutes
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

  const getReturnedPigeonsCountForDay = (pigeons: Pigeon[], day: number) => {
    let count = 0
    pigeons.forEach((pigeon) => {
      const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
      if (dayTime?.raceTime && !dayTime?.isCancelled) {
        count++
      }
    })
    return count
  }

  // Update the helper pigeon logic to use lowest time instead of highest
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
      .sort((a, b) => a.totalTime - b.totalTime) // Changed to ascending order (lowest time first)
      .slice(0, helperCount)
      .map((p) => p.id)
  }

  // Add this function after the existing getHelperPigeons function
  const getHelperPigeonsForDisplay = (player: Player, tournament: Tournament): string[] => {
    return getHelperPigeons(player.pigeons, tournament.helperPigeons || 0, tournament.days)
  }

  // Update the getHelperPigeonsForDisplay function to make it day-specific
  const getHelperPigeonsForDay = (player: Player, tournament: Tournament, day: number): string[] => {
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

  // Function to check if a pigeon is special for a specific day
  const isPigeonSpecialForDay = (pigeon: Pigeon, day: number): boolean => {
    // Check if this pigeon is marked as special for this specific day
    if (pigeon.specialByDay && pigeon.specialByDay[day]) {
      return true
    }
    // Fallback to the general isSpecial flag if specialByDay is not set
    return pigeon.isSpecial === true
  }

  // Function to get the overall special champion (only one for the entire tournament)
  const getOverallSpecialChampion = (tournament: Tournament): DailySpecialTitle | null => {
    let overallSpecialChampion: {
      player: Player
      pigeon: Pigeon
      totalTime: number
      totalTimeString: string
    } | null = null

    tournament.players.forEach((player) => {
      // Find all pigeons that are special for at least one day
      player.pigeons.forEach((pigeon) => {
        if (pigeon.isSpecial || (pigeon.specialByDay && Object.values(pigeon.specialByDay).some((val) => val))) {
          let totalMinutes = 0
          let hasAllDayTimes = true

          // Check if special pigeon has times for ALL days
          for (let day = 1; day <= tournament.days; day++) {
            const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
            if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && dayTime?.raceTime && !dayTime?.isCancelled) {
              const dayMinutes = calculateRaceTimeInMinutes(
                tournament.startTime,
                tournament.startPeriod,
                dayTime.arrivalTime,
                dayTime.arrivalPeriod,
              )
              totalMinutes += dayMinutes
            } else {
              hasAllDayTimes = false
              break
            }
          }

          // Only consider for special champion if ALL day times are entered
          if (hasAllDayTimes && (!overallSpecialChampion || totalMinutes > overallSpecialChampion.totalTime)) {
            overallSpecialChampion = {
              player,
              pigeon,
              totalTime: totalMinutes,
              totalTimeString: formatTimeFromMinutes(totalMinutes),
            }
          }
        }
      })
    })

    if (overallSpecialChampion) {
      return {
        type: "special_champion",
        day: 0, // Use day 0 to indicate this is the overall champion
        playerId: overallSpecialChampion.player.id,
        pigeonId: overallSpecialChampion.pigeon.id,
        playerName: overallSpecialChampion.player.name,
        pigeonName: overallSpecialChampion.player.specialPigeonName || "Special Pigeon",
        time: overallSpecialChampion.totalTimeString,
        raceTimeMinutes: overallSpecialChampion.totalTime,
      }
    }

    return null
  }

  // Update the getDailySpecialTitles function to remove daily special champion
  const getDailySpecialTitles = (tournament: Tournament, specificDay?: number): DailySpecialTitle[] => {
    const titles: DailySpecialTitle[] = []
    const daysToProcess = specificDay ? [specificDay] : Array.from({ length: tournament.days }, (_, i) => i + 1)

    for (const day of daysToProcess) {
      // Find Akhri Bahadur for this day
      let akhriPigeon: {
        player: Player
        pigeon: Pigeon
        time: number
        timeString: string
      } | null = null

      tournament.players.forEach((player) => {
        player.pigeons.forEach((pigeon) => {
          const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
          if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled) {
            const totalMinutes = calculateRaceTimeInMinutes(
              tournament.startTime,
              tournament.startPeriod,
              dayTime.arrivalTime,
              dayTime.arrivalPeriod,
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
          day,
          playerId: akhriPigeon.player.id,
          pigeonId: akhriPigeon.pigeon.id,
          playerName: akhriPigeon.player.name,
          pigeonName: isPigeonSpecialForDay(akhriPigeon.pigeon, day)
            ? akhriPigeon.player.specialPigeonName || "Special Pigeon"
            : akhriPigeon.pigeon.name,
          time: akhriPigeon.timeString,
          raceTimeMinutes: akhriPigeon.time,
        })
      }

      // Find Pehla Bahadur for this day - EXCLUDE HELPER PIGEONS
      let pehlaPigeon: {
        player: Player
        pigeon: Pigeon
        time: number
        timeString: string
      } | null = null

      tournament.players.forEach((player) => {
        // Check eligibility based on total tournament returns
        const totalTournamentReturned = getReturnedPigeonsCount(player.pigeons, tournament.days)
        const requiredReturned = tournament.returnThreshold

        if (totalTournamentReturned >= requiredReturned) {
          // Get helper pigeons for this specific day
          const helperPigeonIds = getHelperPigeonsForDay(player, tournament, day)

          // Find the FIRST non-helper pigeon (could be at any index)
          const firstNonHelperPigeon = player.pigeons.find((pigeon) => !helperPigeonIds.includes(pigeon.id))

          if (firstNonHelperPigeon) {
            const dayTime = firstNonHelperPigeon.dailyTimes.find((dt) => dt.day === day)
            if (dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled) {
              const totalMinutes = calculateRaceTimeInMinutes(
                tournament.startTime,
                tournament.startPeriod,
                dayTime.arrivalTime,
                dayTime.arrivalPeriod,
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
          day,
          playerId: pehlaPigeon.player.id,
          pigeonId: pehlaPigeon.pigeon.id,
          playerName: pehlaPigeon.player.name,
          pigeonName: pehlaPigeon.pigeon.name,
          time: pehlaPigeon.timeString,
          raceTimeMinutes: pehlaPigeon.time,
        })
      }

      // Calculate Best Average for this day (player with highest total time that day)
      let bestAveragePlayer: {
        player: Player
        totalTime: number
        totalTimeString: string
      } | null = null

      tournament.players.forEach((player) => {
        const dayTotalTime = calculateDayRaceTime(player.pigeons, day)

        if (dayTotalTime > 0 && (!bestAveragePlayer || dayTotalTime > bestAveragePlayer.totalTime)) {
          bestAveragePlayer = {
            player,
            totalTime: dayTotalTime,
            totalTimeString: formatTimeFromMinutes(dayTotalTime),
          }
        }
      })

      if (bestAveragePlayer) {
        titles.push({
          type: "best_average" as any,
          day,
          playerId: bestAveragePlayer.player.id,
          pigeonId: "", // Not specific to a pigeon
          playerName: bestAveragePlayer.player.name,
          pigeonName: "Best Average",
          time: bestAveragePlayer.totalTimeString,
          raceTimeMinutes: bestAveragePlayer.totalTime,
        })
      }
    }

    // Add overall special champion if not calculating for a specific day
    if (!specificDay) {
      const overallSpecialChampion = getOverallSpecialChampion(tournament)
      if (overallSpecialChampion) {
        titles.push(overallSpecialChampion)
      }
    }

    return titles
  }

  const getRankedPlayers = (tournament: Tournament) => {
    const dailyTitles = getDailySpecialTitles(tournament)

    const rankings = tournament.players.map((player) => {
      const totalTime = calculateTotalRaceTime(player.pigeons, tournament.days)
      const returnedPigeons = getReturnedPigeonsCount(player.pigeons, tournament.days)
      const returnPercentage = (returnedPigeons / (player.pigeons.length * tournament.days)) * 100

      // Get daily titles for this player
      const playerDailyTitles = dailyTitles.filter((dt) => dt.playerId === player.id)

      // Calculate best day average
      let bestDayAverage = 0
      let bestDay = 1
      for (let day = 1; day <= tournament.days; day++) {
        const dayAvg = calculateDayAverageTime(player.pigeons, day)
        if (dayAvg > bestDayAverage) {
          bestDayAverage = dayAvg
          bestDay = day
        }
      }

      // Calculate daily breakdowns
      const dailyBreakdown = []
      for (let day = 1; day <= tournament.days; day++) {
        let totalDayTime = 0
        player.pigeons.forEach((pigeon) => {
          const dayTime = pigeon.dailyTimes.find((dt) => dt.day === day)
          if (dayTime?.raceTime && !dayTime?.isCancelled) {
            const [hours, minutes, seconds] = dayTime.raceTime.split(":").map(Number)
            totalDayTime += hours * 60 + minutes + seconds / 60
          }
        })
        dailyBreakdown.push({
          day,
          totalTime: totalDayTime,
          formattedTime: formatTime(totalDayTime),
        })
      }

      return {
        player,
        totalTime,
        formattedTotalTime: formatTimeHoursTotal(totalTime),
        returnedPigeons,
        returnPercentage,
        dailyTitles: playerDailyTitles,
        bestDayAverage,
        bestDay,
        dailyBreakdown,
        rank: 0, // Will be set after sorting
      }
    })

    // Sort by total time (highest first for ranking)
    rankings.sort((a, b) => b.totalTime - a.totalTime)

    // Assign ranks
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1
    })

    return rankings
  }

  const formatTime = (minutes: number) => {
    if (minutes === 0) return "00:00:00"

    const hrs = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    const secs = Math.floor((minutes % 1) * 60)
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // New function to format time in HH:MM:SS format with total hours (not limited to 24)
  const formatTimeHoursTotal = (minutes: number) => {
    if (minutes === 0) return "00:00:00"

    const totalHours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    const secs = Math.floor((minutes % 1) * 60)
    return `${totalHours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeFromMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    const seconds = Math.floor((totalMinutes % 1) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTitleText = (type: "akhri_bahadur" | "pehla_bahadur" | "special_champion") => {
    return type === "akhri_bahadur" ? "آخری" : type === "pehla_bahadur" ? "پہلا" : "خصوصی"
  }

  const getTitleIcon = (type: "akhri_bahadur" | "pehla_bahadur" | "special_champion" | "best_average") => {
    switch (type) {
      case "akhri_bahadur":
        return <Crown className="h-3 w-3 mr-1" />
      case "pehla_bahadur":
        return <Award className="h-3 w-3 mr-1" />
      case "special_champion":
        return <Star className="h-3 w-3 mr-1" />
      case "best_average":
        return <Trophy className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const getTitleColor = (type: "akhri_bahadur" | "pehla_bahadur" | "special_champion") => {
    switch (type) {
      case "akhri_bahadur":
        return "text-red-600"
      case "pehla_bahadur":
        return "text-green-600"
      case "special_champion":
        return "text-purple-600"
      default:
        return ""
    }
  }

  const getTitleClass = (type: "akhri_bahadur" | "pehla_bahadur" | "special_champion") => {
    switch (type) {
      case "akhri_bahadur":
        return "akhri-bahadur"
      case "pehla-bahadur":
        return "pehla-bahadur"
      case "special-champion":
        return "special-champion"
      default:
        return ""
    }
  }

  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament)

  // Filter players based on search term
  const getFilteredPlayers = (players: Player[]) => {
    if (!playerSearchTerm) return players
    return players.filter((player) => player.name.toLowerCase().includes(playerSearchTerm.toLowerCase()))
  }

  // Get daily special titles for the selected tournament - Updated to get titles for specific day only
  const dailySpecialTitles =
    selectedTournamentData && selectedDay !== "total"
      ? getDailySpecialTitles(selectedTournamentData, Number(selectedDay))
      : selectedTournamentData
        ? getDailySpecialTitles(selectedTournamentData)
        : []

  // Helper function to check if a pigeon has a special title for a specific day
  const getPigeonDailyTitle = (playerId: string, pigeonId: string, day: number): DailySpecialTitle | null => {
    return (
      dailySpecialTitles.find(
        (title) => title.playerId === playerId && title.pigeonId === pigeonId && title.day === day,
      ) || null
    )
  }

  // Get all titles for a player
  const getPlayerTitles = (playerId: string): DailySpecialTitle[] => {
    return dailySpecialTitles.filter((title) => title.playerId === playerId)
  }

  // If no tournament is selected, show tournament list
  if (!selectedTournamentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-12 w-12 text-gray-700 mr-3" />
                <h1 className="text-5xl font-bold text-gray-800">High Flyer</h1>
              </div>
              <p className="text-xl text-gray-600">Professional Pigeon Racing Tournament System</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
              >
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                      {tournament.name}
                    </h2>
                    <Badge
                      className={`px-3 py-1 text-sm font-medium ${
                        tournament.status === "active"
                          ? "bg-green-100 text-green-800"
                          : tournament.status === "upcoming"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-6 font-medium">{formatDate(tournament.date)}</p>
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium">
                        {tournament.days} day{tournament.days > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium">
                        Daily Start: {tournament.startTime} {tournament.startPeriod}
                      </span>
                    </div>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <Target className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium">Return Threshold: {tournament.returnThreshold}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">{tournament.players.length} Players</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">{tournament.pigeonsPerPlayer} Pigeons</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                    onClick={() => setSelectedTournament(tournament.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render tournament details
  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes blinkRed {
          0%, 40% {
            background: linear-gradient(135deg, #fee2e2, #fca5a5);
            border-color: #f87171;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
            color: #7f1d1d;
            transform: scale(1);
          }
          41%, 80% {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            border-color: #dc2626;
            box-shadow: 0 0 30px rgba(239, 68, 68, 1);
            color: white;
            transform: scale(1.05);
          }
          81%, 100% { 
            background: linear-gradient(135deg, #fee2e2, #fca5a5);
            border-color: #f87171;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
            color: #7f1d1d;
            transform: scale(1);
          }
        }

        @keyframes blinkGreen {
          0%, 40% { 
            background: linear-gradient(135deg, #dcfce7, #86efac);
            border-color: #4ade80;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
            color: #14532d;
            transform: scale(1);
          }
          41%, 80% { 
            background: linear-gradient(135deg, #16a34a, #15803d);
            border-color: #16a34a;
            box-shadow: 0 0 30px rgba(34, 197, 94, 1);
            color: white;
            transform: scale(1.05);
          }
          81%, 100% { 
            background: linear-gradient(135deg, #dcfce7, #86efac);
            border-color: #4ade80;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
            color: #14532d;
            transform: scale(1);
          }
        }

        @keyframes blinkBlue {
          0%, 40% { 
            background: linear-gradient(135deg, #dbeafe, #93c5fd);
            border-color: #60a5fa;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
            color: #1e3a8a;
            transform: scale(1);
          }
          41%, 80% { 
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            border-color: #2563eb;
            box-shadow: 0 0 30px rgba(59, 130, 246, 1);
            color: white;
            transform: scale(1.05);
          }
          81%, 100% { 
            background: linear-gradient(135deg, #dbeafe, #93c5fd);
            border-color: #60a5fa;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
            color: #1e3a8a;
            transform: scale(1);
          }
        }

        @keyframes blinkPurple {
          0%, 40% { 
            background: linear-gradient(135deg, #f3e8ff, #c084fc);
            border-color: #a855f7;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
            color: #581c87;
            transform: scale(1);
          }
          41%, 80% { 
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border-color: #8b5cf6;
            box-shadow: 0 0 30px rgba(168, 85, 247, 1);
            color: white;
            transform: scale(1.05);
          }
          81%, 100% { 
            background: linear-gradient(135deg, #f3e8ff, #c084fc);
            border-color: #a855f7;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
            color: #581c87;
            transform: scale(1);
          }
        }

        @keyframes blinkGold {
          0%, 40% { 
            background: linear-gradient(135deg, #fef3c7, #fbbf24);
            border-color: #f59e0b;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
            color: #92400e;
            transform: scale(1);
          }
          41%, 80% { 
            background: linear-gradient(135deg, #d97706, #b45309);
            border-color: #d97706;
            box-shadow: 0 0 30px rgba(245, 158, 11, 1);
            color: white;
            transform: scale(1.05);
          }
          81%, 100% { 
            background: linear-gradient(135deg, #fef3c7, #fbbf24);
            border-color: #f59e0b;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
            color: #92400e;
            transform: scale(1);
          }
        }

        .akhri-bahadur {
          animation: blinkRed 2s infinite;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          display: inline-block;
          font-weight: bold;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .pehla-bahadur {
          animation: blinkGreen 2s infinite;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          display: inline-block;
          font-weight: bold;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .best-average {
          animation: blinkBlue 2s infinite;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          display: inline-block;
          font-weight: bold;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .special-champion {
          animation: blinkPurple 2s infinite;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          display: inline-block;
          font-weight: bold;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .special-pigeon-gold {
          animation: blinkGold 2s infinite;
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
          margin: 0.125rem;
          display: inline-block;
          font-weight: bold;
          border: 2px solid;
          transition: all 0.3s ease;
          font-size: 0.75rem;
        }

        .helper-pigeon {
          background-color: rgba(59, 130, 246, 0.1);
          border: 1px dashed #3b82f6;
          border-radius: 0.25rem;
        }

        .daily-title-card {
          border: 2px solid;
          border-radius: 0.75rem;
          padding: 1rem;
          margin: 0.25rem;
          font-weight: bold;
          text-align: center;
          transition: all 0.3s ease;
        }

        .daily-title-akhri {
          animation: blinkRed 2.5s infinite;
        }

        .daily-title-pehla {
          animation: blinkGreen 2.5s infinite;
        }

        .daily-title-best {
          animation: blinkBlue 2.5s infinite;
        }

        .daily-title-special {
          animation: blinkPurple 2.5s infinite;
        }
        
        .cancelled-pigeon {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px dashed #ef4444;
          border-radius: 0.25rem;
          opacity: 0.7;
          text-decoration: line-through;
        }
      `}</style>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => setSelectedTournament(null)}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{selectedTournamentData.name}</h1>
          </div>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search players..."
              value={playerSearchTerm}
              onChange={(e) => setPlayerSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 text-lg border border-gray-300 focus:border-gray-500 rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="total" className="w-full" onValueChange={(value) => setSelectedDay(value)}>
            {/* Tabs Container */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Tournament Days</h3>
                <div className="text-sm text-gray-500">
                  {selectedTournamentData.days} day{selectedTournamentData.days > 1 ? "s" : ""} total
                </div>
              </div>

              {/* Scrollable Tabs Container */}
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide">
                  <TabsList className="flex w-max min-w-full bg-gray-50 rounded-lg p-2 gap-2">
                    <TabsTrigger
                      value="total"
                      className="text-sm font-semibold py-3 px-4 rounded-lg whitespace-nowrap data-[state=active]:bg-gray-800 data-[state=active]:text-white transition-all duration-300 flex-shrink-0 min-w-[120px] text-center"
                    >
                      <div>
                        <div className="font-bold">Total</div>
                        <div className="text-xs opacity-80">Rankings</div>
                      </div>
                    </TabsTrigger>

                    {selectedTournamentData.dayDates?.map((date, index) => (
                      <TabsTrigger
                        key={index + 1}
                        value={(index + 1).toString()}
                        className="text-sm font-semibold py-3 px-4 rounded-lg whitespace-nowrap data-[state=active]:bg-gray-800 data-[state=active]:text-white transition-all duration-300 flex-shrink-0 min-w-[120px] text-center"
                      >
                        <div>
                          <div className="font-bold">Day {index + 1}</div>
                          <div className="text-xs opacity-80">{formatDate(date)}</div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Scroll Indicators */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>

              {/* Days Overview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{selectedTournamentData.days}</div>
                    <div className="text-xs text-gray-500">Total Days</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {selectedTournamentData.dayDates ? formatDate(selectedTournamentData.dayDates[0]) : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Start Date</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {selectedTournamentData.dayDates
                        ? formatDate(selectedTournamentData.dayDates[selectedTournamentData.dayDates.length - 1])
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">End Date</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {selectedTournamentData.startTime} {selectedTournamentData.startPeriod}
                    </div>
                    <div className="text-xs text-gray-500">Daily Start</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Rankings Tab */}
            <TabsContent value="total">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Overall Tournament Rankings</h2>
                <p className="text-lg text-gray-600">
                  Players ranked by total race time across all {selectedTournamentData.days} days
                </p>
              </div>

              {/* Overall Special Champion Display */}
              {getOverallSpecialChampion(selectedTournamentData) && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-center mb-4">Overall Special Champion</h3>
                  <div className="flex justify-center">
                    <div className="daily-title-card daily-title-special max-w-md">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="h-6 w-6 mr-2" />
                        <h3 className="text-lg font-bold">خصوصی چیمپیئن</h3>
                      </div>
                      <div className="text-lg font-bold">
                        {getOverallSpecialChampion(selectedTournamentData)?.playerName}
                      </div>
                      <div className="text-md opacity-90 mt-1">
                        {getOverallSpecialChampion(selectedTournamentData)?.pigeonName}
                      </div>
                      <div className="text-lg font-mono mt-2 bg-black bg-opacity-20 rounded px-2 py-1">
                        {getOverallSpecialChampion(selectedTournamentData)?.time}
                      </div>
                      <div className="text-sm mt-2">Total Time Across All Days</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Rankings Table */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md mb-12">
                <div className="bg-gray-800 p-4">
                  <h3 className="text-xl font-bold text-white">Complete Tournament Rankings</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-16 font-bold text-gray-900">Rank</TableHead>
                        <TableHead className="font-bold text-gray-900">Player</TableHead>
                        {Array.from({ length: selectedTournamentData.days }, (_, i) => (
                          <TableHead key={i} className="text-center font-bold text-gray-900">
                            Day {i + 1}
                            Total Time
                          </TableHead>
                        ))}
                        <TableHead className="font-bold text-gray-900">Total Race Time</TableHead>
                        <TableHead className="font-bold text-gray-900">Special Titles</TableHead>
                        <TableHead className="font-bold text-gray-900">Returned</TableHead>
                        <TableHead className="font-bold text-gray-900">Success %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRankedPlayers(selectedTournamentData)
                        .filter((ranking) => getFilteredPlayers([ranking.player]).length > 0)
                        .map((ranking) => {
                          const playerTitles = getPlayerTitles(ranking.player.id)
                          const akhriCount = playerTitles.filter((t) => t.type === "akhri_bahadur").length
                          const pehlaCount = playerTitles.filter((t) => t.type === "pehla_bahadur").length
                          const specialCount = playerTitles.filter((t) => t.type === "special_champion").length
                          const bestAverageCount = playerTitles.filter((t) => t.type === "best_average").length

                          return (
                            <TableRow
                              key={ranking.player.id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="text-lg font-bold">{ranking.rank}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-semibold text-lg text-gray-900">{ranking.player.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {ranking.player.pigeons.length} pigeons registered
                                  </div>
                                </div>
                              </TableCell>

                              {/* Daily Total Times */}
                              {Array.from({ length: selectedTournamentData.days }, (_, dayIndex) => {
                                const dayTime = calculateDayRaceTime(ranking.player.pigeons, dayIndex + 1)
                                const dayTitles = playerTitles.filter((t) => t.day === dayIndex + 1)

                                return (
                                  <TableCell key={dayIndex} className="text-center">
                                    <div className="font-mono text-sm">{formatTime(dayTime)}</div>
                                    {dayTitles.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1 justify-center">
                                        {dayTitles.map((title, idx) => (
                                          <div
                                            key={idx}
                                            className={`text-xs px-1 py-0.5 rounded ${
                                              title.type === "akhri_bahadur"
                                                ? "bg-red-100 text-red-800"
                                                : title.type === "pehla_bahadur"
                                                  ? "bg-green-100 text-green-800"
                                                  : title.type === "special_champion"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                          >
                                            {title.type === "akhri_bahadur"
                                              ? "آخری"
                                              : title.type === "pehla_bahadur"
                                                ? "پہلا"
                                                : title.type === "special_champion"
                                                  ? "خصوصی"
                                                  : "Best Avg"}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </TableCell>
                                )
                              })}

                              <TableCell className="font-mono font-bold text-lg text-gray-800">
                                {ranking.formattedTotalTime}
                                <div className="text-sm text-gray-500">
                                  Total across {selectedTournamentData.days} days
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {akhriCount > 0 && (
                                    <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded">
                                      <Crown className="h-4 w-4 mr-1" />
                                      <span className="font-medium">
                                        آخری بہادر: {akhriCount} {akhriCount === 1 ? "day" : "days"}
                                        {akhriCount <= 3 && (
                                          <span className="text-xs ml-1">
                                            (Day{akhriCount > 1 ? "s" : ""}:{" "}
                                            {playerTitles
                                              .filter((t) => t.type === "akhri_bahadur")
                                              .map((t) => t.day)
                                              .join(", ")}
                                            )
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {pehlaCount > 0 && (
                                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                                      <Award className="h-4 w-4 mr-1" />
                                      <span className="font-medium">
                                        پہلا بہادر: {pehlaCount} {pehlaCount === 1 ? "day" : "days"}
                                        {pehlaCount <= 3 && (
                                          <span className="text-xs ml-1">
                                            (Day{pehlaCount > 1 ? "s" : ""}:{" "}
                                            {playerTitles
                                              .filter((t) => t.type === "pehla_bahadur")
                                              .map((t) => t.day)
                                              .join(", ")}
                                            )
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {specialCount > 0 && (
                                    <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                      <Star className="h-4 w-4 mr-1" />
                                      <span className="font-medium">
                                        خصوصی چیمپیئن: {specialCount} {specialCount === 1 ? "day" : "days"}
                                        {specialCount <= 3 && (
                                          <span className="text-xs ml-1">
                                            (Day{specialCount > 1 ? "s" : ""}:{" "}
                                            {playerTitles
                                              .filter((t) => t.type === "special_champion")
                                              .map((t) => t.day)
                                              .join(", ")}
                                            )
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {bestAverageCount > 0 && (
                                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      <Trophy className="h-4 w-4 mr-1" />
                                      <span className="font-medium">
                                        Best Average: {bestAverageCount} {bestAverageCount === 1 ? "day" : "days"}
                                        {bestAverageCount <= 3 && (
                                          <span className="text-xs ml-1">
                                            (Day{bestAverageCount > 1 ? "s" : ""}:{" "}
                                            {playerTitles
                                              .filter((t) => t.type === "best_average")
                                              .map((t) => t.day)
                                              .join(", ")}
                                            )
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {playerTitles.length === 0 && (
                                    <span className="text-gray-500">No special titles</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="text-lg font-bold text-gray-800">{ranking.returnedPigeons}</div>
                                <div className="text-sm text-gray-500">
                                  of {selectedTournamentData.pigeonsPerPlayer * selectedTournamentData.days}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="text-lg font-bold text-gray-800">
                                  {Math.round(ranking.returnPercentage)}%
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tournament Info Footer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-white border border-gray-200 shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Tournament Details</h3>
                    <div className="space-y-3 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Start Time:</span>
                        <span className="font-bold text-gray-800">
                          {selectedTournamentData.startTime} {selectedTournamentData.startPeriod}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Participants</h3>
                    <div className="space-y-3 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Players:</span>
                        <span className="font-bold text-gray-800">{selectedTournamentData.players.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Total Pigeons:</span>
                        <span className="font-bold text-gray-800">
                          {selectedTournamentData.players.length * selectedTournamentData.pigeonsPerPlayer}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Special Titles</h3>
                    <div className="space-y-3 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Daily Titles:</span>
                        <span className="font-bold text-gray-800">{dailySpecialTitles.length} awarded</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Return Threshold:</span>
                        <span className="font-bold text-gray-800">{selectedTournamentData.returnThreshold}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Daily Results Tabs */}
            {selectedTournamentData.dayDates?.map((date, index) => {
              // Get titles for this specific day only (no special champion on daily view)
              const dayTitles = getDailySpecialTitles(selectedTournamentData, index + 1)
              const akhriTitle = dayTitles.find((title) => title.type === "akhri_bahadur")
              const pehlaTitle = dayTitles.find((title) => title.type === "pehla_bahadur")
              const bestAverageTitle = dayTitles.find((title) => (title.type as string) === "best_average")

              return (
                <TabsContent key={index + 1} value={(index + 1).toString()}>
                  <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{formatFullDate(date)} Results</h2>
                    <p className="text-lg text-gray-600">
                      Day {index + 1} of {selectedTournamentData.days}
                    </p>
                  </div>

                  {/* Daily Special Titles - No Special Champion on Daily View */}
                  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {akhriTitle && (
                      <div className="daily-title-card daily-title-akhri">
                        <div className="flex items-center justify-center mb-2">
                          <Crown className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-bold">آخری بہادر</h3>
                        </div>
                        <div className="text-sm font-bold">{akhriTitle.playerName}</div>
                        <div className="text-xs opacity-90 mt-1">{akhriTitle.pigeonName}</div>
                        <div className="text-sm font-mono mt-2 bg-black bg-opacity-20 rounded px-2 py-1">
                          {akhriTitle.time}
                        </div>
                      </div>
                    )}

                    {pehlaTitle && (
                      <div className="daily-title-card daily-title-pehla">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-bold">پہلا بہادر</h3>
                        </div>
                        <div className="text-sm font-bold">{pehlaTitle.playerName}</div>
                        <div className="text-xs opacity-90 mt-1">{pehlaTitle.pigeonName}</div>
                        <div className="text-sm font-mono mt-2 bg-black bg-opacity-20 rounded px-2 py-1">
                          {pehlaTitle.time}
                        </div>
                      </div>
                    )}

                    {bestAverageTitle && (
                      <div className="daily-title-card daily-title-best">
                        <div className="flex items-center justify-center mb-2">
                          <Trophy className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-bold">Best Average</h3>
                        </div>
                        <div className="text-sm font-bold">{bestAverageTitle.playerName}</div>
                        <div className="text-xs opacity-90 mt-1">Daily Champion</div>
                        <div className="text-sm font-mono mt-2 bg-black bg-opacity-20 rounded px-2 py-1">
                          {bestAverageTitle.time}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Player Release Times Display for Spectators */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                      Player Release Times - Day {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredPlayers(selectedTournamentData.players).map((player) => {
                        const dailyRelease = player.dailyReleases?.find((dr) => dr.day === index + 1)
                        const hasReleaseTime = dailyRelease?.releaseTime && dailyRelease?.releasePeriod

                        return (
                          <div key={player.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                            <div className="text-center">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">{player.name}</h4>
                              {hasReleaseTime ? (
                                <div className="space-y-2">
                                  <div
                                    className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${
                                      dailyRelease.isLateRelease
                                        ? "bg-red-100 text-red-800 border border-red-300"
                                        : "bg-green-100 text-green-800 border border-green-300"
                                    }`}
                                  >
                                    {dailyRelease.releaseTime} {dailyRelease.releasePeriod}
                                  </div>
                                  {dailyRelease.isLateRelease && (
                                    <div className="text-sm text-red-600 font-medium">Late Release</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">Release time not set</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pigeon Times Table */}
                  <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-8">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-900 text-white">
                          <TableHead className="font-bold text-white">Rank</TableHead>
                          <TableHead className="font-bold text-white">User</TableHead>
                          {Array.from({ length: selectedTournamentData.pigeonsPerPlayer }, (_, i) => (
                            <TableHead key={i} className="text-center font-bold text-white">
                              Pigeon {i + 1}
                            </TableHead>
                          ))}
                          <TableHead className="text-center font-bold text-white">Total Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredPlayers(selectedTournamentData.players)
                          .sort((a, b) => {
                            const aTotalTime = calculateDayRaceTime(a.pigeons, index + 1)
                            const bTotalTime = calculateDayRaceTime(b.pigeons, index + 1)
                            return bTotalTime - aTotalTime // Sort by total time (highest first)
                          })
                          .map((player, playerRank) => {
                            const dailySummary = playerDailySummaries.find(
                              (s) => s.playerId === player.id && s.day === index + 1,
                            )
                            const helperPigeonIds = getHelperPigeonsForDay(player, selectedTournamentData, index + 1)

                            return (
                              <TableRow
                                key={player.id}
                                className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
                              >
                                <TableCell className="font-bold text-lg text-center">{playerRank + 1}</TableCell>
                                <TableCell className="align-top font-medium">
                                  <div className="text-lg font-semibold">{player.name}</div>
                                </TableCell>

                                {player.pigeons.map((pigeon, pigeonIndex) => {
                                  const dayTime = pigeon.dailyTimes.find((dt) => dt.day === index + 1)
                                  const hasTime =
                                    dayTime?.arrivalTime && dayTime?.arrivalPeriod && !dayTime?.isCancelled
                                  // Get helper pigeons specifically for this day
                                  const isHelper = helperPigeonIds.includes(pigeon.id)
                                  const pigeonTitle = getPigeonDailyTitle(player.id, pigeon.id, index + 1)

                                  return (
                                    <TableCell
                                      key={pigeon.id}
                                      className={`text-center p-2 align-top ${
                                        isHelper ? "helper-pigeon" : ""
                                      } ${dayTime?.isCancelled ? "cancelled-pigeon" : ""}`}
                                    >
                                      {hasTime ? (
                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-600">
                                            {dayTime.date && formatDate(dayTime.date)}
                                          </div>
                                          <div className="text-sm font-medium">
                                            {dayTime.arrivalTime} {dayTime.arrivalPeriod}
                                          </div>
                                          {dayTime.raceTime && (
                                            <div className="inline-block bg-gray-500 text-white text-xs px-3 py-1 rounded">
                                              {dayTime.raceTime}
                                            </div>
                                          )}
                                          {isHelper && (
                                            <div className="mt-1 text-xs text-blue-600 flex items-center justify-center">
                                              <Crown className="h-3 w-3 mr-1" />
                                              Helper
                                            </div>
                                          )}
                                          {isPigeonSpecialForDay(pigeon, index + 1) && (
                                            <div className="special-pigeon-gold">
                                              <div className="flex items-center justify-center">
                                                <Star className="h-3 w-3 mr-1" />
                                                DM
                                              </div>
                                            </div>
                                          )}
                                          {pigeonTitle && (
                                            <div
                                              className={
                                                pigeonTitle.type === "akhri_bahadur"
                                                  ? "akhri-bahadur"
                                                  : pigeonTitle.type === "pehla_bahadur"
                                                    ? "pehla-bahadur"
                                                    : "best-average"
                                              }
                                            >
                                              <div className="flex items-center justify-center text-xs">
                                                {getTitleIcon(pigeonTitle.type)}
                                                {pigeonTitle.type === "akhri_bahadur"
                                                  ? "آخری"
                                                  : pigeonTitle.type === "pehla_bahadur"
                                                    ? "پہلا"
                                                    : "Best"}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-sm">
                                          {isPigeonSpecialForDay(pigeon, index + 1) && (
                                            <div className="special-pigeon-gold">
                                              <div className="flex items-center justify-center">
                                                <Star className="h-3 w-3 mr-1" />
                                                DM
                                              </div>
                                            </div>
                                          )}
                                          <div className="text-gray-400 mt-1">
                                            {dayTime?.isCancelled ? "Cancelled" : "N/A"}
                                          </div>
                                        </div>
                                      )}
                                    </TableCell>
                                  )
                                })}

                                <TableCell className="text-center font-bold text-lg">
                                  {dailySummary?.formattedTime || "00:00:00"}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Tournament Details Cards at Bottom - Professional Style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card className="bg-white border border-gray-200 shadow-md">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Tournament Details</h3>
                        <div className="space-y-3 text-base">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Start Time:</span>
                            <span className="font-bold text-gray-800">
                              {selectedTournamentData.startTime} {selectedTournamentData.startPeriod}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Day:</span>
                            <span className="font-bold text-gray-800">
                              {index + 1} of {selectedTournamentData.days}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Date:</span>
                            <span className="font-bold text-gray-800">{formatFullDate(date)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200 shadow-md">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Participants</h3>
                        <div className="space-y-3 text-base">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Players:</span>
                            <span className="font-bold text-gray-800">{selectedTournamentData.players.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Total Pigeons:</span>
                            <span className="font-bold text-gray-800">
                              {selectedTournamentData.players.length * selectedTournamentData.pigeonsPerPlayer}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Returned Today:</span>
                            <span className="font-bold text-gray-800">
                              {selectedTournamentData.players.reduce(
                                (total, player) => total + getReturnedPigeonsCountForDay(player.pigeons, index + 1),
                                0,
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
