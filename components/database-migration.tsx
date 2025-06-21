"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Database, Server, Check, AlertCircle, RefreshCw } from "lucide-react"

export function DatabaseMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "migrating" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const startMigration = async () => {
    try {
      setIsLoading(true)
      setStatus("migrating")
      setMessage("Starting migration from localStorage to database...")
      setProgress(10)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Call the migration API
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearInterval(progressInterval)

      if (response.ok) {
        setProgress(100)
        setStatus("success")
        setMessage("Migration completed successfully! Your data is now stored in the database.")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Migration failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Migration
        </CardTitle>
        <CardDescription>
          Transfer your tournament data from browser storage to the database for cross-device access
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "migrating" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-gray-500">{message}</p>
          </div>
        )}

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-800">Migration Successful</AlertTitle>
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-800">Migration Failed</AlertTitle>
            <AlertDescription className="text-red-700">{message}</AlertDescription>
          </Alert>
        )}

        {status === "idle" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-6">
              <div className="relative">
                <Server className="h-16 w-16 text-gray-300" />
                <div className="absolute -right-2 -bottom-2">
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-500">
              This will copy all your tournament data from your browser's local storage to the database. Once migrated,
              your data will be accessible from any device.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={startMigration} disabled={isLoading || status === "migrating"} className="w-full">
          {status === "success" ? "Migration Complete" : "Start Migration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
