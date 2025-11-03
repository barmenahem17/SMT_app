"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getDayName = (date: Date) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    return days[date.getDay()]
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="p-1">
      {/* שורת מידע עליונה */}
      <Card className="mb-6">
        <div className="flex items-center justify-between px-6 py-1">
          {/* תאריך ויום */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{formatDate(currentTime)}</p>
              <p className="text-xs text-muted-foreground">יום {getDayName(currentTime)}</p>
            </div>
          </div>

          {/* שם החברה */}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heebo)' }}>
              מסיעי סמי ומשה
            </h1>
            <p className="text-sm text-muted-foreground">מערכת לניהול הסעות</p>
          </div>

          {/* שעון */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">{formatTime(currentTime)}</span>
            <span className="text-lg">🕐</span>
          </div>
        </div>
      </Card>

      {/* תוכן נוסף יבוא כאן */}
    </div>
  )
}

