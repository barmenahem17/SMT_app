"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestConnectionPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      const supabase = createClient()
      
      // נסה לקרוא מטבלה קיימת (children)
      const { data, error, count } = await supabase
        .from("children")
        .select("*", { count: "exact" })
        .limit(5)

      if (error) {
        setStatus("error")
        setMessage(`שגיאה: ${error.message}`)
      } else {
        setStatus("success")
        setMessage(`✅ החיבור עובד! מצאתי ${count || 0} ילדים במסד הנתונים`)
        if (data) {
          setTables(data)
        }
      }
    } catch (err: any) {
      setStatus("error")
      setMessage(`שגיאה: ${err.message}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>בדיקת חיבור Supabase</CardTitle>
          <CardDescription>
            בדיקה שהחיבור למסד הנתונים עובד
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {status === "loading" && (
              <p className="text-muted-foreground">בודק חיבור...</p>
            )}
            {status === "success" && (
              <div className="text-green-600 font-medium">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="text-red-600 font-medium">
                {message}
              </div>
            )}
          </div>

          {status === "success" && tables.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">דוגמאות מילדים:</h3>
              <div className="space-y-2">
                {tables.map((child: any) => (
                  <div key={child.id} className="p-3 border rounded-lg">
                    <p className="font-medium">
                      {child.first_name} {child.last_name}
                    </p>
                    {child.phone && (
                      <p className="text-sm text-muted-foreground">טלפון: {child.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={testConnection} variant="outline" className="w-full">
            בדוק שוב
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

