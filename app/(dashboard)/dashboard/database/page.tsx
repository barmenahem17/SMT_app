"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

type FilterType = "ילדים" | "הורים" | "מלווים" | "נהגים" | "מפקחים" | "עובדי הוראה" | "מוסדות" | null

interface SearchResult {
  id: string
  type: string
  name: string
  details: string
  additionalInfo?: string
}

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const filters: FilterType[] = [
    "ילדים",
    "הורים",
    "מלווים",
    "נהגים",
    "מפקחים",
    "עובדי הוראה",
    "מוסדות",
  ]

  useEffect(() => {
    if (activeFilter || searchTerm) {
      performSearch()
    } else {
      setResults([])
    }
  }, [activeFilter, searchTerm])

  async function performSearch() {
    setLoading(true)
    const allResults: SearchResult[] = []

    try {
      // חיפוש ילדים
      if (!activeFilter || activeFilter === "ילדים") {
        let query = supabase.from("children").select("*")
        
        if (searchTerm) {
          query = query.or(`first_name.ilike.${searchTerm}%,last_name.ilike.${searchTerm}%`)
        }
        
        const { data: children } = await query

        if (children) {
          allResults.push(
            ...children.map((child: any) => ({
              id: child.id,
              type: "ילד",
              name: `${child.first_name} ${child.last_name}`,
              details: `גיל: ${child.age}, מין: ${child.gender}`,
              additionalInfo: child.home_address,
            }))
          )
        }
      }

      // חיפוש הורים (מתוך טבלת children)
      if (!activeFilter || activeFilter === "הורים") {
        const { data: children } = await supabase.from("children").select("*")

        if (children) {
          children.forEach((child: any) => {
            if (child.parents && Array.isArray(child.parents)) {
              child.parents.forEach((parent: any) => {
                const firstName = parent.first_name?.toLowerCase() || ""
                const lastName = parent.last_name?.toLowerCase() || ""
                const searchLower = searchTerm.toLowerCase()
                
                if (
                  !searchTerm ||
                  firstName.startsWith(searchLower) ||
                  lastName.startsWith(searchLower)
                ) {
                  allResults.push({
                    id: `${child.id}-${parent.first_name}-${parent.last_name}`,
                    type: "הורה",
                    name: `${parent.first_name} ${parent.last_name}`,
                    details: `קשר: ${parent.relation}`,
                    additionalInfo: `הורה של: ${child.first_name} ${child.last_name}`,
                  })
                }
              })
            }
          })
        }
      }

      // חיפוש מלווים
      if (!activeFilter || activeFilter === "מלווים") {
        let query = supabase.from("escorts").select("*")
        
        if (searchTerm) {
          query = query.or(`first_name.ilike.${searchTerm}%,last_name.ilike.${searchTerm}%`)
        }
        
        const { data: escorts } = await query

        if (escorts) {
          allResults.push(
            ...escorts.map((escort: any) => ({
              id: escort.id,
              type: "מלווה",
              name: `${escort.first_name} ${escort.last_name}`,
              details: escort.phone || "אין טלפון",
              additionalInfo: escort.notes,
            }))
          )
        }
      }

      // חיפוש נהגים
      if (!activeFilter || activeFilter === "נהגים") {
        let query = supabase.from("drivers").select("*")
        
        if (searchTerm) {
          query = query.or(`first_name.ilike.${searchTerm}%,last_name.ilike.${searchTerm}%`)
        }
        
        const { data: drivers } = await query

        if (drivers) {
          allResults.push(
            ...drivers.map((driver: any) => ({
              id: driver.id,
              type: "נהג",
              name: `${driver.first_name} ${driver.last_name}`,
              details: `רכב: ${driver.car_number || "אין מספר"} - ${driver.car_type || ""}`,
              additionalInfo: driver.phone,
            }))
          )
        }
      }

      // חיפוש מפקחים (מתוך טבלת authorities)
      if (!activeFilter || activeFilter === "מפקחים") {
        const { data: authorities } = await supabase.from("authorities").select("*")

        if (authorities) {
          authorities.forEach((authority: any) => {
            if (authority.supervisors && Array.isArray(authority.supervisors)) {
              authority.supervisors.forEach((supervisor: any) => {
                const firstName = supervisor.first_name?.toLowerCase() || ""
                const lastName = supervisor.last_name?.toLowerCase() || ""
                const searchLower = searchTerm.toLowerCase()
                
                if (
                  !searchTerm ||
                  firstName.startsWith(searchLower) ||
                  lastName.startsWith(searchLower)
                ) {
                  allResults.push({
                    id: `${authority.id}-${supervisor.first_name}-${supervisor.last_name}`,
                    type: "מפקח",
                    name: `${supervisor.first_name} ${supervisor.last_name}`,
                    details: `תפקיד: ${supervisor.role || "לא צוין"}`,
                    additionalInfo: `גוף: ${authority.name}`,
                  })
                }
              })
            }
          })
        }
      }

      // חיפוש עובדי הוראה (מתוך טבלת institutions)
      if (!activeFilter || activeFilter === "עובדי הוראה") {
        const { data: institutions } = await supabase.from("institutions").select("*")

        if (institutions) {
          institutions.forEach((institution: any) => {
            if (institution.contacts && Array.isArray(institution.contacts)) {
              institution.contacts.forEach((contact: any) => {
                const firstName = contact.first_name?.toLowerCase() || ""
                const lastName = contact.last_name?.toLowerCase() || ""
                const searchLower = searchTerm.toLowerCase()
                
                if (
                  !searchTerm ||
                  firstName.startsWith(searchLower) ||
                  lastName.startsWith(searchLower)
                ) {
                  allResults.push({
                    id: `${institution.id}-${contact.first_name}-${contact.last_name}`,
                    type: "עובד הוראה",
                    name: `${contact.first_name} ${contact.last_name}`,
                    details: `תפקיד: ${contact.role === "אחר" && contact.role_other ? contact.role_other : contact.role}`,
                    additionalInfo: `מוסד: ${institution.name}`,
                  })
                }
              })
            }
          })
        }
      }

      // חיפוש מוסדות
      if (!activeFilter || activeFilter === "מוסדות") {
        let query = supabase.from("institutions").select("*")
        
        if (searchTerm) {
          query = query.or(`name.ilike.${searchTerm}%,address.ilike.${searchTerm}%`)
        }
        
        const { data: institutions } = await query

        if (institutions) {
          allResults.push(
            ...institutions.map((inst: any) => ({
              id: inst.id,
              type: "מוסד",
              name: inst.name,
              details: `סוג: ${inst.type === "אחר" && inst.type_other ? inst.type_other : inst.type}`,
              additionalInfo: inst.address,
            }))
          )
        }
      }

      setResults(allResults)
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">מסד נתונים</h1>
        <p className="text-muted-foreground">חיפוש מתקדם בכל הנתונים במערכת</p>
      </div>

      {/* חיפוש */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חפש לפי שם..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </Card>

      {/* כפתורי סינון */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">סינון לפי קטגוריה</h3>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              size="lg"
            >
              {filter}
            </Button>
          ))}
          {activeFilter && (
            <Button variant="ghost" onClick={() => setActiveFilter(null)} size="lg">
              נקה סינון
            </Button>
          )}
        </div>
      </Card>

      {/* תוצאות */}
      {loading ? (
        <Card className="p-12">
          <p className="text-center text-muted-foreground">מחפש...</p>
        </Card>
      ) : results.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-right p-4 font-semibold">סוג</th>
                  <th className="text-right p-4 font-semibold">שם</th>
                  <th className="text-right p-4 font-semibold">פרטים</th>
                  <th className="text-right p-4 font-semibold">מידע נוסף</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={result.id}
                    className={`border-b hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {result.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{result.name}</td>
                    <td className="p-4 text-muted-foreground">{result.details}</td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {result.additionalInfo || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || activeFilter
                ? "לא נמצאו תוצאות"
                : "התחל לחפש או בחר קטגוריה"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || activeFilter
                ? "נסה לחפש משהו אחר או לשנות את הסינון"
                : "השתמש בשדה החיפוש או בכפתורי הסינון למעלה"}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

