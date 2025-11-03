"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, X, Clock } from "lucide-react"
import { formatPhoneNumber } from "@/lib/format-phone"

// ממשקים
interface ChildInRoute {
  child_id: string
  pickup_time: string // HH:MM format
  pickup_address: string
  dropoff_address?: string // רק לבוקר - כתובת מוסד
}

interface Route {
  id: string
  name: string
  route_type: "morning" | "afternoon"
  is_permanent: boolean
  active_days: string[]
  children: ChildInRoute[]
  notes?: string
  created_at: string
}

interface Child {
  id: string
  first_name: string
  last_name: string
  gender: string
  age: number
  phone?: string
  home_address: string
  city?: string
  disability?: string
  notes?: string
  parents: any[]
  assigned_institutions?: any[]
  assigned_authorities?: any[]
  escort_id?: string
}

interface Institution {
  id: string
  name: string
  type: string
  address: string
  city?: string
  contacts: any[]
}

interface Contact {
  first_name: string
  last_name: string
  phone: string
  role: string
  role_other?: string
}

interface Authority {
  id: string
  name: string
  supervisors: any[]
}

interface Escort {
  id: string
  first_name: string
  last_name: string
  phone: string
}

const DAYS_OF_WEEK = [
  { value: "weekdays", label: "א׳-ה׳" },
  { value: "friday", label: "שישי" },
]

const emptyChildInRoute: ChildInRoute = {
  child_id: "",
  pickup_time: "",
  pickup_address: "",
  dropoff_address: "",
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [escorts, setEscorts] = useState<Escort[]>([])
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRouteId, setCurrentRouteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null)
  const [childDetailsDialog, setChildDetailsDialog] = useState<{ open: boolean; child: Child | null }>({
    open: false,
    child: null,
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPermanent, setFilterPermanent] = useState<boolean | null>(null)
  const [filterRouteType, setFilterRouteType] = useState<"morning" | "afternoon" | null>(null)
  const [filterDays, setFilterDays] = useState<"weekdays" | "friday" | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    route_type: "morning" as "morning" | "afternoon",
    is_permanent: true,
    active_days: ["weekdays"] as string[],
    children: [{ ...emptyChildInRoute }] as ChildInRoute[],
    notes: "",
  })

  const supabase = createClient()

  // טעינת נתונים
  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    const { data: childrenData } = await supabase.from("children").select("*")
    const { data: institutionsData } = await supabase.from("institutions").select("*")
    const { data: authoritiesData } = await supabase.from("authorities").select("*")
    const { data: escortsData } = await supabase.from("escorts").select("*")
    const { data: routesData } = await supabase.from("routes").select("*").order("created_at", { ascending: false })

    if (childrenData) setChildren(childrenData)
    if (institutionsData) setInstitutions(institutionsData)
    if (authoritiesData) setAuthorities(authoritiesData)
    if (escortsData) setEscorts(escortsData)
    if (routesData) setRoutes(routesData)
  }

  // פונקציות עזר
  function getPickupAddress(childId: string, routeType: "morning" | "afternoon"): string {
    const child = children.find((c) => c.id === childId)
    if (!child) return ""

    if (routeType === "morning") {
      return `${child.home_address}${child.city ? ", " + child.city : ""}`
    } else {
      // צהריים - מוסד ראשון
      if (child.assigned_institutions && child.assigned_institutions.length > 0) {
        const instId = child.assigned_institutions[0].institution_id
        const institution = institutions.find((i) => i.id === instId)
        return institution ? `${institution.address}${institution.city ? ", " + institution.city : ""}` : ""
      }
      return ""
    }
  }

  function getDropoffAddress(childId: string): string {
    const child = children.find((c) => c.id === childId)
    if (!child) return ""

    if (child.assigned_institutions && child.assigned_institutions.length > 0) {
      const instId = child.assigned_institutions[0].institution_id
      const institution = institutions.find((i) => i.id === instId)
      return institution ? `${institution.address}${institution.city ? ", " + institution.city : ""}` : ""
    }
    return ""
  }

  function sortChildrenByTime(children: ChildInRoute[]): ChildInRoute[] {
    return [...children].sort((a, b) => a.pickup_time.localeCompare(b.pickup_time))
  }

  function openAddDialog() {
    setIsEditMode(false)
    setCurrentRouteId(null)
    setFormData({
      name: "",
      route_type: "morning",
      is_permanent: true,
      active_days: ["weekdays"],
      children: [{ child_id: "", pickup_time: "", pickup_address: "", dropoff_address: "" }],
      notes: "",
    })
    setIsAddDialogOpen(true)
  }

  function openEditDialog(route: Route) {
    setIsEditMode(true)
    setCurrentRouteId(route.id)
    setFormData({
      name: route.name,
      route_type: route.route_type,
      is_permanent: route.is_permanent,
      active_days: route.active_days,
      children: route.children.length > 0 ? route.children.map(c => ({...c})) : [{ child_id: "", pickup_time: "", pickup_address: "", dropoff_address: "" }],
      notes: route.notes || "",
    })
    setIsAddDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      alert("יש להזין שם קו")
      return
    }

    // סינון ילדים - רק כאלה שבחרו אותם (יש להם child_id)
    const selectedChildren = formData.children.filter((c) => c.child_id && c.child_id.trim())
    
    // בדיקה שיש לפחות ילד אחד
    if (selectedChildren.length === 0) {
      alert("יש להוסיף לפחות ילד אחד לקו")
      return
    }

    // בדיקה שלכל הילדים שנבחרו יש שעת איסוף תקינה
    const childrenWithoutTime = selectedChildren.filter((c) => {
      if (!c.pickup_time || !c.pickup_time.trim()) return true
      // בדיקה שהפורמט תקין HH:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      return !timeRegex.test(c.pickup_time)
    })
    
    if (childrenWithoutTime.length > 0) {
      alert("יש למלא שעת איסוף תקינה (בפורמט HH:MM) לכל הילדים שנבחרו")
      return
    }

    // כל הילדים תקינים
    const validChildren = selectedChildren

    // חישוב כתובות
    const childrenWithAddresses = validChildren.map((c) => ({
      ...c,
      pickup_address: getPickupAddress(c.child_id, formData.route_type),
      dropoff_address: formData.route_type === "morning" ? getDropoffAddress(c.child_id) : undefined,
    }))

    if (isEditMode && currentRouteId) {
      // עריכה
      const { error } = await supabase
        .from("routes")
        .update({
          name: formData.name,
          route_type: formData.route_type,
          is_permanent: formData.is_permanent,
          active_days: formData.active_days,
          children: childrenWithAddresses,
          notes: formData.notes,
        })
        .eq("id", currentRouteId)

      if (error) {
        alert("שגיאה בעדכון הקו: " + error.message)
        return
      }

      setRoutes((prev) =>
        prev.map((r) =>
          r.id === currentRouteId
            ? {
                ...r,
                name: formData.name,
                route_type: formData.route_type,
                is_permanent: formData.is_permanent,
                active_days: formData.active_days,
                children: childrenWithAddresses,
                notes: formData.notes,
              }
            : r
        )
      )
    } else {
      // הוספה
      const { data, error } = await supabase
        .from("routes")
        .insert({
          name: formData.name,
          route_type: formData.route_type,
          is_permanent: formData.is_permanent,
          active_days: formData.active_days,
          children: childrenWithAddresses,
          notes: formData.notes,
        })
        .select()
        .single()

      if (error) {
        alert("שגיאה בהוספת הקו: " + error.message)
        return
      }

      if (data) {
        setRoutes((prev) => [data, ...prev])
      }
    }

    setIsAddDialogOpen(false)
  }

  async function handleDelete() {
    if (routeToDelete) {
      const { error } = await supabase.from("routes").delete().eq("id", routeToDelete)

      if (error) {
        alert("שגיאה במחיקת הקו: " + error.message)
        return
      }

      setRoutes((prev) => prev.filter((r) => r.id !== routeToDelete))
      setIsDeleteDialogOpen(false)
      setRouteToDelete(null)
    }
  }

  function addChildToRoute() {
    setFormData((prev) => {
      if (prev.children.length < 4) {
        return {
          ...prev,
          children: [...prev.children, { child_id: "", pickup_time: "", pickup_address: "", dropoff_address: "" }],
        }
      }
      return prev
    })
  }

  function removeChildFromRoute(index: number) {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }))
  }

  function updateChildInRoute(index: number, field: keyof ChildInRoute, value: string) {
    setFormData((prev) => {
      const newChildren = [...prev.children]
      newChildren[index] = { ...newChildren[index], [field]: value }
      return { ...prev, children: newChildren }
    })
  }

  function toggleDay(day: string) {
    if (formData.active_days.includes(day)) {
      setFormData({
        ...formData,
        active_days: formData.active_days.filter((d) => d !== day),
      })
    } else {
      setFormData({
        ...formData,
        active_days: [...formData.active_days, day],
      })
    }
  }

  function openChildDetails(childId: string) {
    const child = children.find((c) => c.id === childId)
    if (child) {
      setChildDetailsDialog({ open: true, child })
    }
  }

  // סינון וחיפוש
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPermanent = filterPermanent === null || route.is_permanent === filterPermanent
    const matchesType = filterRouteType === null || route.route_type === filterRouteType
    const matchesDays = filterDays === null || route.active_days.includes(filterDays)
    return matchesSearch && matchesPermanent && matchesType && matchesDays
  })

  // קיבוץ קווים
  const groupedRoutes = {
    permanent_morning: filteredRoutes.filter((r) => r.is_permanent && r.route_type === "morning"),
    permanent_afternoon: filteredRoutes.filter((r) => r.is_permanent && r.route_type === "afternoon"),
    temporary_morning: filteredRoutes.filter((r) => !r.is_permanent && r.route_type === "morning"),
    temporary_afternoon: filteredRoutes.filter((r) => !r.is_permanent && r.route_type === "afternoon"),
  }

  return (
    <div className="p-8">
      {/* כותרת */}
      <div className="mb-8 text-center relative">
        <h1 className="text-4xl font-bold mb-2">ניהול קווים</h1>
        <p className="text-muted-foreground">מערכת ניהול מסלולי הסעה</p>
        <Button
          onClick={openAddDialog}
          className="gap-2 absolute left-0 top-0"
          size="lg"
        >
          הוסף קו חדש
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* חיפוש וסינון */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חפש קו לפי שם..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex items-center gap-3 w-full">
            {/* קבוע / לא קבוע */}
            <div className="flex gap-2 flex-1">
              <Button
                variant={filterPermanent === true ? "default" : "outline"}
                onClick={() => setFilterPermanent(filterPermanent === true ? null : true)}
                className="flex-1 h-9"
                size="sm"
              >
                קבוע
              </Button>
              <Button
                variant={filterPermanent === false ? "default" : "outline"}
                onClick={() => setFilterPermanent(filterPermanent === false ? null : false)}
                className="flex-1 h-9"
                size="sm"
              >
                לא קבוע
              </Button>
            </div>

            <div className="h-6 w-px bg-slate-300"></div>

            {/* בוקר / צהריים */}
            <div className="flex gap-2 flex-1">
              <Button
                variant={filterRouteType === "morning" ? "default" : "outline"}
                onClick={() => setFilterRouteType(filterRouteType === "morning" ? null : "morning")}
                className="flex-1 h-9"
                size="sm"
              >
                בוקר
              </Button>
              <Button
                variant={filterRouteType === "afternoon" ? "default" : "outline"}
                onClick={() => setFilterRouteType(filterRouteType === "afternoon" ? null : "afternoon")}
                className="flex-1 h-9"
                size="sm"
              >
                צהריים
              </Button>
            </div>

            <div className="h-6 w-px bg-slate-300"></div>

            {/* א-ה / שישי */}
            <div className="flex gap-2 flex-1">
              <Button
                variant={filterDays === "weekdays" ? "default" : "outline"}
                onClick={() => setFilterDays(filterDays === "weekdays" ? null : "weekdays")}
                className="flex-1 h-9"
                size="sm"
              >
                א׳-ה׳
              </Button>
              <Button
                variant={filterDays === "friday" ? "default" : "outline"}
                onClick={() => setFilterDays(filterDays === "friday" ? null : "friday")}
                className="flex-1 h-9"
                size="sm"
              >
                שישי
              </Button>
            </div>
          </div>
          {(filterPermanent !== null || filterRouteType !== null || filterDays !== null) && (
            <Button variant="ghost" onClick={() => { setFilterPermanent(null); setFilterRouteType(null); setFilterDays(null) }} className="w-full">
              נקה סינון
            </Button>
          )}
        </div>
      </Card>

      {/* תצוגת קווים */}
      <div className="space-y-8">
        {/* קבוע בוקר */}
        {groupedRoutes.permanent_morning.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-700">קווים קבועים - בוקר</h2>
            <div className="grid gap-4">
              {groupedRoutes.permanent_morning.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  children={children}
                  onEdit={() => openEditDialog(route)}
                  onDelete={() => { setRouteToDelete(route.id); setIsDeleteDialogOpen(true) }}
                  onChildClick={openChildDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* קבוע צהריים */}
        {groupedRoutes.permanent_afternoon.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-700">קווים קבועים - צהריים</h2>
            <div className="grid gap-4">
              {groupedRoutes.permanent_afternoon.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  children={children}
                  onEdit={() => openEditDialog(route)}
                  onDelete={() => { setRouteToDelete(route.id); setIsDeleteDialogOpen(true) }}
                  onChildClick={openChildDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* לא קבוע בוקר */}
        {groupedRoutes.temporary_morning.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">קווים לא קבועים - בוקר</h2>
            <div className="grid gap-4">
              {groupedRoutes.temporary_morning.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  children={children}
                  onEdit={() => openEditDialog(route)}
                  onDelete={() => { setRouteToDelete(route.id); setIsDeleteDialogOpen(true) }}
                  onChildClick={openChildDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* לא קבוע צהריים */}
        {groupedRoutes.temporary_afternoon.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">קווים לא קבועים - צהריים</h2>
            <div className="grid gap-4">
              {groupedRoutes.temporary_afternoon.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  children={children}
                  onEdit={() => openEditDialog(route)}
                  onDelete={() => { setRouteToDelete(route.id); setIsDeleteDialogOpen(true) }}
                  onChildClick={openChildDetails}
                />
              ))}
            </div>
          </div>
        )}

        {filteredRoutes.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">אין קווים להצגה</h3>
              <p className="text-muted-foreground">
                {routes.length === 0 ? "התחל על ידי הוספת קו חדש" : "נסה לשנות את הסינון"}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Dialog הוספה/עריכה */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "עריכת קו" : "הוספת קו חדש"}</DialogTitle>
            <DialogDescription>הזן את פרטי הקו ובחר עד 4 ילדים</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* שם הקו */}
            <div>
              <Label>שם הקו</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="לדוגמא: קו 1 - תל אביב"
              />
            </div>

            {/* סוג קו */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>סוג קו</Label>
                <Select
                  value={formData.is_permanent ? "permanent" : "temporary"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_permanent: value === "permanent" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">קבוע</SelectItem>
                    <SelectItem value="temporary">לא קבוע</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>זמן</Label>
                <Select
                  value={formData.route_type}
                  onValueChange={(value: "morning" | "afternoon") =>
                    setFormData({ ...formData, route_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">🌅 בוקר</SelectItem>
                    <SelectItem value="afternoon">🌆 צהריים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ימי פעילות */}
            <div>
              <Label className="mb-3 block">ימי פעילות</Label>
              <div className="flex gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`cursor-pointer px-5 py-2 rounded-lg border-2 transition-all font-medium ${
                      formData.active_days.includes(day.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white border-slate-300 hover:border-primary"
                    }`}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
            </div>

            {/* ילדים */}
            <div>
              <Label className="mb-3 block">ילדים בקו (עד 4)</Label>
              <div className="space-y-4">
                {formData.children.map((child, index) => (
                  <Card key={index} className="p-4 bg-slate-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="w-64">
                          <Select
                            value={child.child_id}
                            onValueChange={(value) => updateChildInRoute(index, "child_id", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="בחר ילד" />
                            </SelectTrigger>
                            <SelectContent>
                              {children.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.first_name} {c.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <div className="flex gap-3 items-center w-64">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Input
                              type="text"
                              value={child.pickup_time || ""}
                              onChange={(e) => {
                                const value = e.target.value
                                // פורמט אוטומטי: אם מקלידים 4 ספרות, מוסיפים :
                                let formatted = value.replace(/[^0-9]/g, '')
                                if (formatted.length >= 3) {
                                  formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4)
                                }
                                updateChildInRoute(index, "pickup_time", formatted)
                              }}
                              placeholder="HH:MM (לדוגמא: 07:30)"
                              className="text-base flex-1"
                              dir="ltr"
                              maxLength={5}
                            />
                          </div>
                          {child.pickup_time && (
                            <div className="text-xs text-green-600 mr-6">
                              ✓ שעה נשמרה: {child.pickup_time}
                            </div>
                          )}
                        </div>

                        {child.child_id && (
                          <div className="text-sm text-muted-foreground bg-white p-2 rounded">
                            <strong>איסוף מ:</strong>{" "}
                            {getPickupAddress(child.child_id, formData.route_type) || "לא זמין"}
                            {formData.route_type === "morning" && getDropoffAddress(child.child_id) && (
                              <>
                                <br />
                                <strong>הורדה ב:</strong> {getDropoffAddress(child.child_id)}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.children.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeChildFromRoute(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {formData.children.length < 4 && (
                <Button
                  variant="outline"
                  onClick={addChildToRoute}
                  className="mt-3 w-full gap-2"
                >
                  הוסף ילד
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* הערות */}
            <div>
              <Label>הערות (אופציונלי)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="הערות נוספות על הקו..."
                rows={3}
              />
            </div>

            {/* סיכום - בדיקה */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">סיכום ילדים בקו:</h4>
              {formData.children.map((child, idx) => (
                <div key={idx} className="text-sm mb-1">
                  {child.child_id ? (
                    <span className="text-green-700">
                      ✓ ילד #{idx + 1}: {children.find(c => c.id === child.child_id)?.first_name || "נבחר"} 
                      {child.pickup_time ? ` - שעה: ${child.pickup_time}` : " - ⚠️ חסרה שעה"}
                    </span>
                  ) : (
                    <span className="text-gray-500">○ ילד #{idx + 1}: לא נבחר</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "שמור שינויים" : "הוסף קו"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog מחיקה */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת קו</DialogTitle>
            <DialogDescription>האם אתה בטוח שברצונך למחוק קו זה? פעולה זו לא ניתנת לביטול.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              מחק
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog פרטי ילד */}
      <Dialog open={childDetailsDialog.open} onOpenChange={(open) => setChildDetailsDialog({ open, child: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {childDetailsDialog.child && <ChildDetailsView child={childDetailsDialog.child} institutions={institutions} authorities={authorities} escorts={escorts} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// קומפוננטה לתצוגת קו
function RouteCard({
  route,
  children,
  onEdit,
  onDelete,
  onChildClick,
}: {
  route: Route
  children: Child[]
  onEdit: () => void
  onDelete: () => void
  onChildClick: (childId: string) => void
}) {
  const sortedChildren = route.children.sort((a, b) => a.pickup_time.localeCompare(b.pickup_time))

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold">{route.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                route.is_permanent ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {route.is_permanent ? "קבוע" : "לא קבוע"}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
              {route.route_type === "morning" ? "בוקר" : "צהריים"}
            </span>
            
            {/* ימי פעילות */}
            {route.active_days.includes("weekdays") && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                א׳-ה׳
              </span>
            )}
            {route.active_days.includes("friday") && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                שישי
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* רשימת ילדים */}
      <div className="space-y-3">
        {sortedChildren.map((childInRoute, index) => {
          const child = children.find((c) => c.id === childInRoute.child_id)
          if (!child) return null

          return (
            <div key={index} className="bg-slate-50 p-4 rounded-lg border-r-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">{childInRoute.pickup_time}</span>
                  </div>
                  <button
                    onClick={() => onChildClick(child.id)}
                    className="text-primary hover:underline font-semibold text-lg mb-1"
                  >
                    {child.first_name} {child.last_name}
                  </button>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>איסוף מ:</strong> {childInRoute.pickup_address}
                    </div>
                    {route.route_type === "morning" && childInRoute.dropoff_address && (
                      <div>
                        <strong>הורדה ב:</strong> {childInRoute.dropoff_address}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {route.notes && (
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <strong>הערות:</strong> {route.notes}
        </div>
      )}
    </Card>
  )
}

// קומפוננטה לתצוגת פרטי ילד
function ChildDetailsView({
  child,
  institutions,
  authorities,
  escorts,
}: {
  child: Child
  institutions: Institution[]
  authorities: Authority[]
  escorts: Escort[]
}) {
  return (
    <div className="space-y-4">
      {/* פרטים בסיסיים */}
      <div className="text-center py-4 border-b">
        <h2 className="text-2xl font-bold mb-2">
          {child.first_name} {child.last_name}
        </h2>
        <div className="text-sm text-muted-foreground">
          <span>מין: {child.gender}</span>
          <span className="mx-2">•</span>
          <span>גיל: {child.age}</span>
          {child.disability && (
            <>
              <span className="mx-2">•</span>
              <span>מוגבלות: {child.disability}</span>
            </>
          )}
        </div>
      </div>

      {/* כתובת */}
      <div className="bg-slate-50 p-4 rounded">
        <div className="font-semibold mb-1">כתובת מגורים:</div>
        <div>{child.home_address}{child.city ? `, ${child.city}` : ""}</div>
        {child.phone && (
          <div className="mt-2">
            <strong>טלפון:</strong> {formatPhoneNumber(child.phone)}
          </div>
        )}
      </div>

      {/* הורים */}
      {child.parents && child.parents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">👥 הורים</h3>
          <div className="space-y-2">
            {child.parents.map((parent: any, index: number) => (
              <div key={index} className="bg-slate-50 p-3 rounded">
                <div>
                  <strong>{parent.relation}:</strong> {parent.first_name} {parent.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>טלפון:</strong> {formatPhoneNumber(parent.phone)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* מוסדות */}
      {child.assigned_institutions && child.assigned_institutions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">🏫 מוסדות</h3>
          <div className="space-y-3">
            {child.assigned_institutions.map((assignment: any, index: number) => {
              const institution = institutions.find((i) => i.id === assignment.institution_id)
              if (!institution) return null

              const contact = institution.contacts[assignment.contact_index]

              return (
                <div key={index} className="bg-slate-50 p-3 rounded space-y-2">
                  <div>
                    <strong>{institution.name}</strong>
                  </div>
                  <div className="text-sm">
                    <strong>סוג:</strong> {institution.type}
                  </div>
                  <div className="text-sm">
                    <strong>כתובת:</strong> {institution.address}
                    {institution.city ? `, ${institution.city}` : ""}
                  </div>
                  {contact && (
                    <div className="text-sm bg-white p-2 rounded mt-2">
                      <strong>{contact.role}:</strong> {contact.first_name} {contact.last_name} -{" "}
                      {formatPhoneNumber(contact.phone)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* מלווה */}
      {child.escort_id && (
        <div>
          <h3 className="font-semibold mb-2">👤 מלווה</h3>
          {(() => {
            const escort = escorts.find((e) => e.id === child.escort_id)
            return escort ? (
              <div className="bg-slate-50 p-3 rounded">
                <div>
                  <strong>שם:</strong> {escort.first_name} {escort.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>טלפון:</strong> {formatPhoneNumber(escort.phone)}
                </div>
              </div>
            ) : null
          })()}
        </div>
      )}

      {/* גופים */}
      {child.assigned_authorities && child.assigned_authorities.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">🏛️ גופים</h3>
          <div className="space-y-2">
            {child.assigned_authorities.map((assignment: any, index: number) => {
              const authority = authorities.find((a) => a.id === assignment.authority_id)
              if (!authority) return null

              const supervisor = authority.supervisors[assignment.supervisor_index]

              return (
                <div key={index} className="bg-slate-50 p-3 rounded space-y-1">
                  <div>
                    <strong>{authority.name}</strong>
                  </div>
                  {supervisor && (
                    <div className="text-sm">
                      <strong>מפקח:</strong> {supervisor.first_name} {supervisor.last_name}
                      {supervisor.phone && (
                        <>
                          <br />
                          <strong>טלפון:</strong> {formatPhoneNumber(supervisor.phone)}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* הערות */}
      {child.notes && (
        <div className="bg-blue-50 p-3 rounded">
          <strong>הערות:</strong>
          <p className="mt-1">{child.notes}</p>
        </div>
      )}
    </div>
  )
}

