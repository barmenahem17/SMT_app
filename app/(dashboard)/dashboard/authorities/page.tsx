"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { DynamicSection } from "@/components/dynamic-section"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react"
import { unformatPhoneNumber } from "@/lib/format-phone"

interface Supervisor {
  first_name: string
  last_name: string
  role: string
  email: string
  phone?: string
}

interface Authority {
  id: string
  name: string
  main_phone: string
  email: string
  supervisors: Supervisor[]
  created_at: string
}

const emptySupervisor: Supervisor = {
  first_name: "",
  last_name: "",
  role: "",
  email: "",
  phone: "",
}

export default function AuthoritiesPage() {
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null)
  const [expandedAuthorityId, setExpandedAuthorityId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    main_phone: "",
    email: "",
    supervisors: [] as Supervisor[],
  })
  const [showSupervisors, setShowSupervisors] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchAuthorities()
  }, [])

  async function fetchAuthorities() {
    setLoading(true)
    const { data, error } = await supabase
      .from("authorities")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching authorities:", error)
    } else {
      setAuthorities(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setEditingAuthority(null)
    setFormData({
      name: "",
      main_phone: "",
      email: "",
      supervisors: [{ ...emptySupervisor }], // שדה אחד פתוח באופן אוטומטי
    })
    setShowSupervisors(true) // פתוח באופן אוטומטי
    setDialogOpen(true)
  }

  function openEditDialog(authority: Authority) {
    setEditingAuthority(authority)
    setFormData({
      name: authority.name,
      main_phone: authority.main_phone,
      email: authority.email,
      supervisors: authority.supervisors || [],
    })
    setShowSupervisors(authority.supervisors && authority.supervisors.length > 0)
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const authorityData = {
      name: formData.name,
      main_phone: unformatPhoneNumber(formData.main_phone),
      email: formData.email,
      supervisors: formData.supervisors,
    }

    if (editingAuthority) {
      const { error } = await supabase
        .from("authorities")
        .update(authorityData)
        .eq("id", editingAuthority.id)

      if (error) {
        console.error("Error updating authority:", error)
        alert("שגיאה בעדכון הגוף")
      } else {
        setDialogOpen(false)
        fetchAuthorities()
      }
    } else {
      const { error } = await supabase.from("authorities").insert([authorityData])

      if (error) {
        console.error("Error adding authority:", error)
        alert("שגיאה בהוספת הגוף")
      } else {
        setDialogOpen(false)
        fetchAuthorities()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הגוף?")) return

    const { error } = await supabase.from("authorities").delete().eq("id", id)

    if (error) {
      console.error("Error deleting authority:", error)
      alert("שגיאה במחיקת הגוף")
    } else {
      fetchAuthorities()
    }
  }

  function addSupervisor() {
    setFormData({
      ...formData,
      supervisors: [...formData.supervisors, { ...emptySupervisor }],
    })
  }

  function removeSupervisor(index: number) {
    setFormData({
      ...formData,
      supervisors: formData.supervisors.filter((_, i) => i !== index),
    })
  }

  function updateSupervisor(index: number, field: keyof Supervisor, value: string) {
    const newSupervisors = [...formData.supervisors]
    newSupervisors[index] = { ...newSupervisors[index], [field]: value }
    setFormData({ ...formData, supervisors: newSupervisors })
  }

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ניהול גופים</h1>
          <p className="text-muted-foreground">ניהול גופים ומפקחים</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2 absolute left-0">
          הוסף גוף חדש
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* שורת חיפוש */}
      {!loading && authorities.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש לפי שם הגוף..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : authorities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין גופים במערכת</p>
          <Button onClick={openAddDialog}>הוסף את הגוף הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {authorities
            .filter((authority) => {
              if (!searchQuery.trim()) return true
              const query = searchQuery.toLowerCase()
              return authority.name.toLowerCase().includes(query)
            })
            .map((authority) => {
            const isExpanded = expandedAuthorityId === authority.id
            return (
              <Card key={authority.id} className="p-6">
                <div className="space-y-3">
                  {/* כרטיס בסיסי */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="text-xl font-semibold">{authority.name}</h3>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <div><strong>טלפון:</strong> {authority.main_phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</div>
                          <div><strong>אימייל:</strong> {authority.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(authority)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(authority.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* כפתור הרחבה */}
                  <div className="flex justify-center pt-2 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAuthorityId(isExpanded ? null : authority.id)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <div className="flex items-center gap-1">
                        {isExpanded ? (
                          <>
                            <span>הסתר פרטים</span>
                            <ChevronUp className="h-4 w-4 flex-shrink-0" />
                          </>
                        ) : (
                          <>
                            <span>הרחב פרטים</span>
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          </>
                        )}
                      </div>
                    </Button>
                  </div>

                  {/* פרטים מורחבים */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3">
                      {authority.supervisors && authority.supervisors.length > 0 && (
                        <div>
                          <strong className="text-sm">מפקחים:</strong>
                          <div className="mt-2 space-y-2">
                            {authority.supervisors.map((supervisor, i) => (
                              <div key={i} className="text-sm bg-slate-50 p-2 rounded">
                                <div><strong>שם:</strong> {supervisor.first_name} {supervisor.last_name}</div>
                                {supervisor.role && <div className="text-muted-foreground mt-1"><strong>תפקיד:</strong> {supervisor.role}</div>}
                                {supervisor.email && <div className="text-muted-foreground mt-1"><strong>אימייל:</strong> {supervisor.email}</div>}
                                {supervisor.phone && <div className="text-muted-foreground mt-1"><strong>טלפון:</strong> {supervisor.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAuthority ? "עריכת גוף" : "הוספת גוף חדש"}
            </DialogTitle>
            <DialogDescription>מלא את כל הפרטים הנדרשים</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 grid-cols-[2fr_1fr]">
              <div className="space-y-2">
                <Label htmlFor="name">
                  שם הגוף <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="למשל: עיריית תל אביב"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_phone">
                  מספר טלפון ראשי <span className="text-destructive">*</span>
                </Label>
                <PhoneInput
                  id="main_phone"
                  value={formData.main_phone}
                  onChange={(value) =>
                    setFormData({ ...formData, main_phone: value })
                  }
                  placeholder="050-123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                אימייל <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">מפקחים</h3>

                <DynamicSection
                  title=""
                  addButtonText="הוסף מפקח נוסף"
                  onAdd={addSupervisor}
                  onRemove={removeSupervisor}
                  items={formData.supervisors}
                  centerAddButton={true}
                  renderItem={(supervisor, index) => (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>שם פרטי</Label>
                          <Input
                            value={supervisor.first_name}
                            onChange={(e) =>
                              updateSupervisor(index, "first_name", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>שם משפחה</Label>
                          <Input
                            value={supervisor.last_name}
                            onChange={(e) =>
                              updateSupervisor(index, "last_name", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>תפקיד</Label>
                          <Input
                            value={supervisor.role}
                            onChange={(e) =>
                              updateSupervisor(index, "role", e.target.value)
                            }
                            placeholder="למשל: מפקח ראשי, מתאם..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>אימייל</Label>
                          <Input
                            type="email"
                            value={supervisor.email}
                            onChange={(e) =>
                              updateSupervisor(index, "email", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>טלפון</Label>
                          <PhoneInput
                            value={supervisor.phone || ""}
                            onChange={(value) =>
                              updateSupervisor(index, "phone", value)
                            }
                            placeholder="050-123-4567"
                          />
                        </div>
                      </div>
                    )}
                  />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                ביטול
              </Button>
              <Button type="submit">
                {editingAuthority ? "שמור שינויים" : "הוסף גוף"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

