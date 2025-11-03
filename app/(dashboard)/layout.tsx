"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // סנכרון עם מצב ה-sidebar מ-localStorage
  useEffect(() => {
    const updateSidebarState = () => {
      const saved = localStorage.getItem("sidebar-open")
      setIsSidebarOpen(saved === "true")
    }

    // בדיקה ראשונית
    updateSidebarState()

    // האזנה לשינויים ב-localStorage (כשה-sidebar משתנה)
    window.addEventListener("storage", updateSidebarState)
    
    // יצירת custom event לסנכרון תוך אותו window
    const handleSidebarToggle = () => updateSidebarState()
    window.addEventListener("sidebar-toggle", handleSidebarToggle)

    return () => {
      window.removeEventListener("storage", updateSidebarState)
      window.removeEventListener("sidebar-toggle", handleSidebarToggle)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* תוכן ראשי - מתכוונן לפי מצב ה-Sidebar */}
      <main 
        className="transition-all duration-300"
        style={{ marginRight: isSidebarOpen ? "280px" : "80px" }}
      >
        <div className="container mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

