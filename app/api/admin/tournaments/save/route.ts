import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tournaments } = body

    if (!tournaments || !Array.isArray(tournaments)) {
      return NextResponse.json({ error: "Invalid tournaments data" }, { status: 400 })
    }

    console.log("Attempting to save tournaments:", tournaments.length)

    // Check if Supabase environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("Environment check:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      url: supabaseUrl ? supabaseUrl.substring(0, 20) + "..." : "missing",
    })

    if (
      !supabaseUrl ||
      !supabaseServiceKey ||
      !supabaseAnonKey ||
      supabaseUrl === "https://placeholder.supabase.co" ||
      supabaseServiceKey === "placeholder-service-key" ||
      supabaseAnonKey === "placeholder-anon-key"
    ) {
      console.log("Supabase not configured - returning mock success")
      return NextResponse.json({
        success: true,
        message: `Mock save: ${tournaments.length} tournaments would be saved (Database not configured)`,
        successCount: tournaments.length,
        errorCount: 0,
        errors: [],
        warning:
          "Database not configured. Please set up Supabase environment variables to enable real database operations.",
      })
    }

    // Try to import and use Supabase
    let supabase
    try {
      const { createClient } = await import("@supabase/supabase-js")
      supabase = createClient(supabaseUrl, supabaseServiceKey)
      console.log("Supabase client created successfully")
    } catch (importError) {
      console.error("Failed to import or create Supabase client:", importError)
      return NextResponse.json({
        success: true,
        message: `Mock save: ${tournaments.length} tournaments would be saved (Supabase import failed)`,
        successCount: tournaments.length,
        errorCount: 0,
        errors: [],
        warning: "Supabase client could not be created. Operating in mock mode.",
      })
    }

    // Test database connectivity with a simple query
    let connectivityTest
    try {
      console.log("Testing database connectivity...")
      connectivityTest = await supabase.from("tournaments").select("count").limit(1)
      console.log("Connectivity test result:", connectivityTest)
    } catch (connectError) {
      console.error("Database connectivity test failed:", connectError)
      return NextResponse.json(
        {
          error: `Database connection failed: ${connectError.message || "Unable to connect to database"}`,
          details: "Please check your Supabase configuration and ensure the database is accessible.",
        },
        { status: 500 },
      )
    }

    if (connectivityTest.error) {
      console.error("Database connectivity test failed:", connectivityTest.error)

      // Check if it's a table not found error
      if (
        connectivityTest.error.message?.includes("relation") &&
        connectivityTest.error.message?.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            error: "Database tables not found. Please run the database setup scripts first.",
            details: "Run the SQL scripts in the 'scripts' folder to create the required database tables.",
            sqlError: connectivityTest.error.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: `Database error: ${connectivityTest.error.message}`,
          details: "Please check your database configuration and permissions.",
        },
        { status: 500 },
      )
    }

    console.log("Database connectivity test passed")

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process tournaments one by one with better error handling
    for (const tournament of tournaments) {
      try {
        console.log(`Processing tournament: ${tournament.name}`)

        // Prepare tournament data for database
        const tournamentData = {
          id: Number.parseInt(tournament.id) || Date.now(),
          name: tournament.name || "Unnamed Tournament",
          start_date: tournament.date || new Date().toISOString().split("T")[0],
          end_date: tournament.dayDates?.[tournament.dayDates.length - 1] || tournament.date,
          status: tournament.status || "upcoming",
          location: "Bewal, Pakistan",
          days: tournament.days || 1,
          day_dates: tournament.dayDates || [tournament.date],
          start_time: tournament.startTime || "06:00:00",
          start_period: tournament.startPeriod || "AM",
          end_time: tournament.endTime || "07:00:00",
          end_period: tournament.endPeriod || "AM",
          return_threshold: tournament.returnThreshold || 0,
          pigeons_per_player: tournament.pigeonsPerPlayer || 11,
          helper_pigeons: tournament.helperPigeons || 0,
          special_pigeons: tournament.specialPigeons || 0,
        }

        // Insert or update tournament
        const { data: tournamentResult, error: tournamentError } = await supabase
          .from("tournaments")
          .upsert(tournamentData, { onConflict: "id" })
          .select()

        if (tournamentError) {
          console.error("Error inserting tournament:", tournamentError)
          errors.push(`Tournament ${tournament.name}: ${tournamentError.message}`)
          errorCount++
          continue
        }

        console.log("Tournament saved successfully:", tournament.name)

        // Save players for this tournament
        if (tournament.players && Array.isArray(tournament.players)) {
          for (const player of tournament.players) {
            try {
              // Insert or update player
              const playerData = {
                id: Number.parseInt(player.id) || Date.now(),
                name: player.name || "Unnamed Player",
                phone: "",
                city: "Bewal",
                special_pigeon_name: player.specialPigeonName || null,
              }

              const { error: playerError } = await supabase.from("players").upsert(playerData, { onConflict: "id" })

              if (playerError) {
                console.error("Error inserting player:", playerError)
                errors.push(`Player ${player.name}: ${playerError.message}`)
                continue
              }

              // Insert tournament participant relationship
              const { error: participantError } = await supabase.from("tournament_participants").upsert(
                {
                  tournament_id: Number.parseInt(tournament.id),
                  player_id: Number.parseInt(player.id),
                },
                { onConflict: "tournament_id,player_id" },
              )

              if (participantError) {
                console.error("Error inserting participant:", participantError)
              }

              // Save pigeons and their times
              if (player.pigeons && Array.isArray(player.pigeons)) {
                for (const pigeon of player.pigeons) {
                  try {
                    const pigeonData = {
                      id: Number.parseInt(pigeon.id.split("-")[0]) || Date.now(),
                      player_id: Number.parseInt(player.id),
                      name: pigeon.name || "Unnamed Pigeon",
                      color: "Mixed",
                      breed: "Racing",
                      special_by_day: pigeon.specialByDay || {},
                    }

                    const { error: pigeonError } = await supabase
                      .from("pigeons")
                      .upsert(pigeonData, { onConflict: "id" })

                    if (pigeonError) {
                      console.error("Error inserting pigeon:", pigeonError)
                      continue
                    }

                    // Save race results
                    if (pigeon.dailyTimes && Array.isArray(pigeon.dailyTimes)) {
                      for (const dailyTime of pigeon.dailyTimes) {
                        if (dailyTime.arrivalTime) {
                          const resultData = {
                            tournament_id: Number.parseInt(tournament.id),
                            player_id: Number.parseInt(player.id),
                            pigeon_id: Number.parseInt(pigeon.id.split("-")[0]),
                            day: dailyTime.day,
                            arrival_time: dailyTime.arrivalTime,
                            arrival_period: dailyTime.arrivalPeriod,
                            race_time: dailyTime.raceTime,
                            is_cancelled: dailyTime.isCancelled || false,
                          }

                          const { error: resultError } = await supabase.from("race_results").upsert(resultData, {
                            onConflict: "tournament_id,player_id,pigeon_id,day",
                          })

                          if (resultError) {
                            console.error("Error inserting race result:", resultError)
                          }
                        }
                      }
                    }
                  } catch (pigeonErr) {
                    console.error("Error processing pigeon:", pigeonErr)
                  }
                }
              }

              // Save daily releases
              if (player.dailyReleases && Array.isArray(player.dailyReleases)) {
                for (const release of player.dailyReleases) {
                  if (release.releaseTime) {
                    const releaseData = {
                      tournament_id: Number.parseInt(tournament.id),
                      player_id: Number.parseInt(player.id),
                      day: release.day,
                      release_time: release.releaseTime,
                      release_period: release.releasePeriod,
                      is_late_release: release.isLateRelease || false,
                    }

                    const { error: releaseError } = await supabase.from("player_daily_releases").upsert(releaseData, {
                      onConflict: "tournament_id,player_id,day",
                    })

                    if (releaseError) {
                      console.error("Error inserting release time:", releaseError)
                    }
                  }
                }
              }
            } catch (playerErr) {
              console.error("Error processing player:", playerErr)
              errors.push(`Player ${player.name}: ${playerErr}`)
            }
          }
        }

        successCount++
      } catch (tournamentErr) {
        console.error("Error processing tournament:", tournamentErr)
        errors.push(`Tournament ${tournament.name}: ${tournamentErr}`)
        errorCount++
      }
    }

    const message = `Saved ${successCount} tournaments successfully. ${errorCount} errors occurred.`
    console.log(message)

    if (errors.length > 0) {
      console.log("Errors:", errors)
    }

    return NextResponse.json({
      success: true,
      message,
      successCount,
      errorCount,
      errors: errors.slice(0, 5), // Limit error messages
    })
  } catch (error) {
    console.error("Unexpected error saving tournaments:", error)
    return NextResponse.json(
      {
        error: `Failed to save tournaments: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: "An unexpected error occurred while processing the request.",
      },
      { status: 500 },
    )
  }
}
