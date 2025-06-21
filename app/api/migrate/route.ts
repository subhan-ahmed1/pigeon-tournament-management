import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { migrateLocalStorageToDatabase } from "@/lib/data-migration"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can perform data migration" }, { status: 403 })
    }

    const result = await migrateLocalStorageToDatabase()

    if (result.success) {
      return NextResponse.json({ success: true, message: "Data migration completed successfully" })
    } else {
      return NextResponse.json({ error: "Migration failed", details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: "An error occurred during migration" }, { status: 500 })
  }
}
