import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured. Please set up Supabase environment variables.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { subAdmins } = body

    if (!subAdmins || !Array.isArray(subAdmins)) {
      return NextResponse.json({ error: "Invalid sub-admins data" }, { status: 400 })
    }

    console.log("Saving sub-admins to database:", subAdmins.length)

    // Test database connectivity
    const { data: testData, error: testError } = await supabase.from("sub_admins").select("count").limit(1)

    if (testError) {
      console.error("Database connectivity test failed:", testError)
      return NextResponse.json(
        {
          error: `Database connection failed: ${testError.message}`,
        },
        { status: 500 },
      )
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Insert sub-admins one by one
    for (const subAdmin of subAdmins) {
      try {
        const subAdminData = {
          id: Number.parseInt(subAdmin.id) || Date.now(),
          username: subAdmin.username || "unnamed",
          password: subAdmin.password || "",
          permissions: subAdmin.permissions || {},
          created_at: subAdmin.createdAt || new Date().toISOString(),
          is_active: subAdmin.isActive !== undefined ? subAdmin.isActive : true,
        }

        const { error: subAdminError } = await supabase.from("sub_admins").upsert(subAdminData, { onConflict: "id" })

        if (subAdminError) {
          console.error("Error inserting sub-admin:", subAdminError)
          errors.push(`Sub-admin ${subAdmin.username}: ${subAdminError.message}`)
          errorCount++
        } else {
          successCount++
        }
      } catch (subAdminErr) {
        console.error("Error processing sub-admin:", subAdminErr)
        errors.push(`Sub-admin ${subAdmin.username}: ${subAdminErr}`)
        errorCount++
      }
    }

    const message = `Saved ${successCount} sub-admins successfully. ${errorCount} errors occurred.`
    console.log(message)

    return NextResponse.json({
      success: true,
      message,
      successCount,
      errorCount,
      errors: errors.slice(0, 5),
    })
  } catch (error) {
    console.error("Unexpected error saving sub-admins:", error)
    return NextResponse.json(
      {
        error: `Failed to save sub-admins: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
