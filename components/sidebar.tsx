"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronLeft, Database, Users, Building2, Briefcase, Car, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(true)
  const pathname = usePathname()

  // שמירה ושחזור מצב ה-sidebar מ-localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open")
    if (saved !== null) {
      setIsOpen(saved === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-open", isOpen.toString())
    // שידור אירוע כדי שה-layout יידע על השינוי
    window.dispatchEvent(new Event("sidebar-toggle"))
  }, [isOpen])

  const menuItems = [
    { href: "/dashboard/children", label: "ילדים", icon: Users },
    { href: "/dashboard/institutions", label: "מוסדות", icon: Building2 },
    { href: "/dashboard/authorities", label: "גופים", icon: Briefcase },
    { href: "/dashboard/drivers", label: "נהגים", icon: Car },
    { href: "/dashboard/escorts", label: "מלווים", icon: UserCheck },
  ]

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-screen bg-white border-l border-slate-200 shadow-lg transition-all duration-300 ease-in-out z-50",
        isOpen ? "w-[280px]" : "w-[80px]"
      )}
    >
      {/* כפתור פתיחה/סגירה */}
      <div className="absolute -left-3 top-6">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full bg-white shadow-md hover:shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* כותרת */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard">
          <h1
            className={cn(
              "font-bold text-primary transition-all duration-300 hover:opacity-80 cursor-pointer",
              isOpen ? "text-xl text-center" : "text-sm text-center"
            )}
          >
            {isOpen ? "מסיעי סמי ומשה" : "SMT"}
          </h1>
        </Link>
      </div>

      {/* תפריט */}
      <nav className="p-4 space-y-2">
        {/* כפתור מסד הנתונים */}
        <div>
          <button
            onClick={() => setIsDatabaseOpen(!isDatabaseOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              "hover:bg-slate-100 text-slate-700 font-medium",
              isDatabaseOpen && "bg-slate-50"
            )}
          >
            <Database className="h-5 w-5 shrink-0" />
            {isOpen && (
              <>
                <span className="flex-1 text-right">מסד הנתונים</span>
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isDatabaseOpen && "rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {/* תת-תפריט */}
          {isDatabaseOpen && (
            <div className={cn("mt-2 space-y-1", isOpen ? "mr-4" : "mt-2")}>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all",
                      "hover:bg-slate-100",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-slate-600"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

