"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, Building2, Briefcase, UserCheck, ChevronDown, ChevronUp, Search } from "lucide-react"
import { unformatPhoneNumber } from "@/lib/format-phone"

interface Parent {
  first_name: string
  last_name: string
  relation: string
  relation_other?: string
  phone: string
}

interface Contact {
  first_name: string
  last_name: string
  phone: string
  role: string
  role_other?: string
}

interface Institution {
  id: string
  name: string
  type: string
  address: string
  city?: string
  contacts: Contact[]
}

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
  supervisors: Supervisor[]
}

interface Escort {
  id: string
  first_name: string
  last_name: string
  phone: string
}

interface InstitutionAssignment {
  institution_id: string
  contact_index: number
}

interface AuthorityAssignment {
  authority_id: string
  supervisor_index: number
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
  parents: Parent[]
  assigned_institutions?: InstitutionAssignment[]
  assigned_authorities?: AuthorityAssignment[]
  escort_id?: string
  created_at: string
}

const emptyParent: Parent = {
  first_name: "",
  last_name: "",
  relation: "אמא",
  phone: "",
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [escorts, setEscorts] = useState<Escort[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "זכר",
    age: 5,
    phone: "",
    home_address: "",
    city: "",
    disability: "",
    notes: "",
    parents: [] as Parent[],
    assigned_institutions: [] as InstitutionAssignment[],
    assigned_authorities: [] as AuthorityAssignment[],
    escort_id: "" as string,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    await Promise.all([
      fetchChildren(),
      fetchInstitutions(),
      fetchAuthorities(),
      fetchEscorts(),
    ])
    setLoading(false)
  }

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching children:", error)
    } else {
      setChildren(data || [])
    }
  }

  async function fetchInstitutions() {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching institutions:", error)
    } else {
      setInstitutions(data || [])
    }
  }

  async function fetchAuthorities() {
    const { data, error } = await supabase
      .from("authorities")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching authorities:", error)
    } else {
      setAuthorities(data || [])
    }
  }

  async function fetchEscorts() {
    const { data, error } = await supabase
      .from("escorts")
      .select("*")
      .order("first_name")

    if (error) {
      console.error("Error fetching escorts:", error)
    } else {
      setEscorts(data || [])
    }
  }

  function openAddDialog() {
    setEditingChild(null)
    setFormData({
      first_name: "",
      last_name: "",
      gender: "זכר",
      age: 5,
      phone: "",
      home_address: "",
      city: "",
      disability: "",
      notes: "",
      parents: [], // לא פתוח באופן אוטומטי
      assigned_institutions: [],
      assigned_authorities: [],
      escort_id: "",
    })
    setDialogOpen(true)
  }

  function openEditDialog(child: Child) {
    setEditingChild(child)
    setFormData({
      first_name: child.first_name,
      last_name: child.last_name,
      gender: child.gender,
      age: child.age,
      phone: child.phone || "",
      home_address: child.home_address,
      city: child.city || "",
      disability: child.disability || "",
      notes: child.notes || "",
      parents: child.parents || [],
      assigned_institutions: child.assigned_institutions || [],
      assigned_authorities: child.assigned_authorities || [],
      escort_id: child.escort_id || "",
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const childData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      age: formData.age,
      phone: unformatPhoneNumber(formData.phone) || null,
      home_address: formData.home_address,
      city: formData.city || null,
      disability: formData.disability || null,
      notes: formData.notes || null,
      parents: formData.parents,
      assigned_institutions: formData.assigned_institutions,
      assigned_authorities: formData.assigned_authorities,
      escort_id: formData.escort_id || null,
    }

    if (editingChild) {
      const { error } = await supabase
        .from("children")
        .update(childData)
        .eq("id", editingChild.id)

      if (error) {
        console.error("Error updating child:", error)
        alert("שגיאה בעדכון הילד")
      } else {
        setDialogOpen(false)
        fetchChildren()
      }
    } else {
      const { error } = await supabase.from("children").insert([childData])

      if (error) {
        console.error("Error adding child:", error)
        alert("שגיאה בהוספת הילד")
      } else {
        setDialogOpen(false)
        fetchChildren()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הילד?")) return

    const { error } = await supabase.from("children").delete().eq("id", id)

    if (error) {
      console.error("Error deleting child:", error)
      alert("שגיאה במחיקת הילד")
    } else {
      fetchChildren()
    }
  }

  function addParent() {
    if (formData.parents.length >= 2) {
      return
    }

    const hasMother = formData.parents.some((p) => p.relation === "אמא")
    const hasFather = formData.parents.some((p) => p.relation === "אבא")
    const defaultRelation = hasMother && !hasFather ? "אבא" : (!hasMother && hasFather ? "אמא" : "אמא")

    setFormData({
      ...formData,
      parents: [...formData.parents, { ...emptyParent, relation: defaultRelation }],
    })
  }

  function removeParent(index: number) {
    setFormData({
      ...formData,
      parents: formData.parents.filter((_, i) => i !== index),
    })
  }

  function updateParent(index: number, field: keyof Parent, value: string) {
    const newParents = [...formData.parents]
    newParents[index] = { ...newParents[index], [field]: value }
    setFormData({ ...formData, parents: newParents })
  }

  function addInstitution() {
    if (formData.assigned_institutions.length >= 2) {
      return
    }
    setFormData({
      ...formData,
      assigned_institutions: [
        ...formData.assigned_institutions,
        { institution_id: "", contact_index: -1 },
      ],
    })
  }

  function removeInstitution(index: number) {
    setFormData({
      ...formData,
      assigned_institutions: formData.assigned_institutions.filter((_, i) => i !== index),
    })
  }

  function updateInstitution(index: number, field: keyof InstitutionAssignment, value: string | number) {
    const newAssignments = [...formData.assigned_institutions]
    newAssignments[index] = { ...newAssignments[index], [field]: value }
    setFormData({ ...formData, assigned_institutions: newAssignments })
  }

  function addAuthority() {
    setFormData({
      ...formData,
      assigned_authorities: [
        ...formData.assigned_authorities,
        { authority_id: "", supervisor_index: -1 },
      ],
    })
  }

  function removeAuthority(index: number) {
    setFormData({
      ...formData,
      assigned_authorities: formData.assigned_authorities.filter((_, i) => i !== index),
    })
  }

  function updateAuthority(index: number, field: keyof AuthorityAssignment, value: string | number) {
    const newAssignments = [...formData.assigned_authorities]
    newAssignments[index] = { ...newAssignments[index], [field]: value }
    setFormData({ ...formData, assigned_authorities: newAssignments })
  }

  function getInstitutionDetails(assignment: InstitutionAssignment) {
    const institution = institutions.find(i => i.id === assignment.institution_id)
    if (!institution) return null
    const contact = institution.contacts?.[assignment.contact_index]
    return { institution, contact }
  }

  function getAuthorityDetails(assignment: AuthorityAssignment) {
    const authority = authorities.find(a => a.id === assignment.authority_id)
    if (!authority) return null
    const supervisor = authority.supervisors?.[assignment.supervisor_index]
    return { authority, supervisor }
  }

  function getEscortDetails(escortId: string) {
    return escorts.find(e => e.id === escortId)
  }

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ניהול ילדים</h1>
          <p className="text-muted-foreground">
            ניהול מלא של פרטי הילדים והקשרים שלהם
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2 absolute left-0">
          הוסף ילד חדש
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* שורת חיפוש */}
      {!loading && children.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש לפי שם פרטי או שם משפחה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : children.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין ילדים במערכת</p>
          <Button onClick={openAddDialog}>הוסף את הילד הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {children
            .filter((child) => {
              if (!searchQuery.trim()) return true
              const query = searchQuery.toLowerCase()
              return (
                child.first_name.toLowerCase().includes(query) ||
                child.last_name.toLowerCase().includes(query)
              )
            })
            .map((child) => {
            const isExpanded = expandedChildId === child.id
            return (
            <Card key={child.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  {/* פרטי הילד */}
                  <div className="pb-3">
                    <h3 className="text-2xl font-bold text-primary">
                      {child.first_name} {child.last_name}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                      <span>מין: {child.gender}</span>
                      <span>גיל: {child.age}</span>
                      {child.disability && <span>מוגבלות: {child.disability}</span>}
                    </div>
                    <div className="text-sm mt-1">
                      <strong>כתובת מגורים:</strong> {child.home_address}
                      {child.city && `, ${child.city}`}
                    </div>
                    {child.phone && (
                      <div className="mt-2 text-sm">
                        <strong>טלפון:</strong> {child.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                      </div>
                    )}
                    {child.notes && (
                      <div className="text-sm mt-2 text-muted-foreground">
                        <strong>הערות:</strong> {child.notes}
                      </div>
                    )}
                  </div>
                  
                  {/* כפתור הרחבה */}
                  <div className="flex justify-center pt-2 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedChildId(isExpanded ? null : child.id)}
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
                  
                  {isExpanded && (
                    <div className="space-y-4 pt-2">
                      {/* הורים */}
                      {child.parents && child.parents.length > 0 && (
                        <div className="pb-3 border-b border-slate-200">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            👥 הורים
                          </h4>
                          <div className="space-y-3">
                            {child.parents.map((parent, i) => (
                              <div key={i} className="bg-slate-50 p-3 rounded">
                                <div className="text-sm">
                                  <strong>
                                    {parent.relation === "אחר" && parent.relation_other
                                      ? parent.relation_other
                                      : parent.relation}:
                                  </strong>{" "}
                                  {parent.first_name} {parent.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <strong>טלפון:</strong> {parent.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* מוסדות */}
                      {child.assigned_institutions && child.assigned_institutions.length > 0 && (
                        <div className="pb-3 border-b border-slate-200">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> מוסדות
                          </h4>
                          <div className="space-y-3">
                            {child.assigned_institutions.map((assignment, i) => {
                              const details = getInstitutionDetails(assignment)
                              if (!details) return null
                              const { institution, contact } = details
                              return (
                                <div key={i} className="space-y-3">
                                  <div className="bg-slate-50 p-3 rounded">
                                    <div className="text-sm font-bold">{institution.name}</div>
                                    {institution.type && (
                                      <div className="text-sm text-muted-foreground mt-1">
                                        <strong>סוג:</strong> {institution.type}
                                      </div>
                                    )}
                                    {(institution.address || institution.city) && (
                                      <div className="text-sm text-muted-foreground mt-1">
                                        <strong>כתובת:</strong> {institution.address}{institution.city && `, ${institution.city}`}
                                      </div>
                                    )}
                                  </div>
                                  {contact && (
                                    <div className="bg-slate-50 p-3 rounded">
                                      <div className="text-sm">
                                        <strong>{contact.role === "אחר" && contact.role_other ? contact.role_other : contact.role}:</strong>{" "}
                                        {contact.first_name} {contact.last_name}
                                      </div>
                                      <div className="text-sm text-muted-foreground mt-1">
                                        <strong>טלפון:</strong> {contact.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                                      </div>
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
                        <div className="pb-3 border-b border-slate-200">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" /> מלווה
                          </h4>
                          {(() => {
                            const escort = getEscortDetails(child.escort_id)
                            if (!escort) return null
                            return (
                              <div className="bg-slate-50 p-3 rounded">
                                <div className="text-sm">
                                  <strong>שם:</strong> {escort.first_name} {escort.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <strong>טלפון:</strong> {escort.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      )}

                      {/* גופים */}
                      {child.assigned_authorities && child.assigned_authorities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> גופים
                          </h4>
                          <div className="space-y-3">
                            {child.assigned_authorities.map((assignment, i) => {
                              const details = getAuthorityDetails(assignment)
                              if (!details) return null
                              const { authority, supervisor } = details
                              return (
                                <div key={i} className="bg-slate-50 p-3 rounded">
                                  <div className="text-sm font-bold">{authority.name}</div>
                                  {supervisor && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      <div><strong>מפקח:</strong> {supervisor.first_name} {supervisor.last_name}</div>
                                      {supervisor.role && <div className="mt-1"><strong>תפקיד:</strong> {supervisor.role}</div>}
                                      {supervisor.email && <div className="mt-1"><strong>אימייל:</strong> {supervisor.email}</div>}
                                      {supervisor.phone && <div className="mt-1"><strong>טלפון:</strong> {supervisor.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</div>}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(child)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(child.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingChild ? "עריכת ילד" : "הוספת ילד חדש"}
            </DialogTitle>
            <DialogDescription>
              מלא את כל הפרטים הנדרשים והצמד מוסדות, גופים ומלווה
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* פרטי הילד הבסיסיים */}
            <div className="space-y-4 pb-4 border-b-2">
              <h3 className="font-semibold text-lg">פרטי הילד</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    שם פרטי <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    שם משפחה <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-[120px_100px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    מין <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="זכר">זכר</SelectItem>
                      <SelectItem value="נקבה">נקבה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">
                    גיל <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
                    }
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disability">מוגבלות</Label>
                  <Input
                    id="disability"
                    value={formData.disability}
                    onChange={(e) =>
                      setFormData({ ...formData, disability: e.target.value })
                    }
                    placeholder="למשל: אוטיזם, עיכוב התפתחותי..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="home_address">
                    כתובת מגורים <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="home_address"
                    value={formData.home_address}
                    onChange={(e) =>
                      setFormData({ ...formData, home_address: e.target.value })
                    }
                    placeholder="רחוב ומספר בית"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    עיר <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="למשל: תל אביב"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    placeholder="050-123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">הערות נוספות</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </div>

            {/* הורים */}
            <div className="border-t-2 border-primary/30 pt-6 mt-6">
              <div className="flex flex-col items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-center">👥 הורים</h3>
                {formData.parents.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addParent}
                    className="gap-2 w-[140px]"
                  >
                    הוסף הורה
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {formData.parents.length > 0 && (
                <DynamicSection
                  title=""
                  addButtonText="הוסף הורה נוסף"
                  onAdd={addParent}
                  onRemove={removeParent}
                  items={formData.parents}
                  centerAddButton={true}
                  hideAddButton={formData.parents.length >= 2}
                  renderItem={(parent, index) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>שם פרטי</Label>
                      <Input
                        value={parent.first_name}
                        onChange={(e) =>
                          updateParent(index, "first_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>שם משפחה</Label>
                      <Input
                        value={parent.last_name}
                        onChange={(e) =>
                          updateParent(index, "last_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>קשר</Label>
                      <Select
                        value={parent.relation}
                        onValueChange={(value) =>
                          updateParent(index, "relation", value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="אמא">אמא</SelectItem>
                          <SelectItem value="אבא">אבא</SelectItem>
                          <SelectItem value="אחר">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {parent.relation === "אחר" && (
                      <div className="space-y-2">
                        <Label>תיאור הקשר</Label>
                        <Input
                          value={parent.relation_other || ""}
                          onChange={(e) =>
                            updateParent(index, "relation_other", e.target.value)
                          }
                          placeholder="למשל: סבתא, דודה..."
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>מספר טלפון</Label>
                      <PhoneInput
                        value={parent.phone}
                        onChange={(value) =>
                          updateParent(index, "phone", value)
                        }
                        placeholder="050-123-4567"
                      />
                    </div>
                  </div>
                )}
                />
              )}
            </div>

            {/* מוסדות */}
            <div className="border-t pt-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> מוסדות
                </h3>
                {formData.assigned_institutions.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInstitution}
                    className="gap-2 w-[140px]"
                  >
                    הוסף מוסד
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {formData.assigned_institutions.length > 0 && (
                <DynamicSection
                  title=""
                  addButtonText="הוסף מוסד נוסף"
                  onAdd={addInstitution}
                  onRemove={removeInstitution}
                  items={formData.assigned_institutions}
                  showNumbering={false}
                  centerAddButton={true}
                  hideAddButton={formData.assigned_institutions.length >= 2}
                  renderItem={(assignment, index) => {
                    const selectedInstitution = institutions.find(
                      i => i.id === assignment.institution_id
                    )
                    return (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>בחר מוסד</Label>
                          <Select
                            value={assignment.institution_id}
                            onValueChange={(value) =>
                              updateInstitution(index, "institution_id", value)
                            }
                          >
                            <SelectTrigger className="max-w-full">
                              <SelectValue placeholder="בחר מוסד..." />
                            </SelectTrigger>
                            <SelectContent className="max-w-[400px]">
                              {institutions.map((inst) => (
                                <SelectItem key={inst.id} value={inst.id} className="truncate">
                                  {inst.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedInstitution && selectedInstitution.contacts?.length > 0 && (
                          <div className="space-y-2">
                            <Label>בחר איש קשר</Label>
                            <Select
                              value={assignment.contact_index.toString()}
                              onValueChange={(value) =>
                                updateInstitution(index, "contact_index", parseInt(value))
                              }
                            >
                              <SelectTrigger className="max-w-full">
                                <SelectValue placeholder="בחר איש קשר..." />
                              </SelectTrigger>
                              <SelectContent className="max-w-[400px]">
                                {selectedInstitution.contacts.map((contact, idx) => (
                                  <SelectItem key={idx} value={idx.toString()} className="truncate">
                                    {contact.first_name} {contact.last_name} ({contact.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
              )}
            </div>

            {/* מלווה */}
            <div className="border-t pt-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="h-5 w-5" /> מלווה
                </h3>
                {!formData.escort_id ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (escorts.length > 0) {
                        setFormData({ ...formData, escort_id: escorts[0].id })
                      }
                    }}
                    className="gap-2 w-[140px]"
                  >
                    הוסף מלווה
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, escort_id: "" })}
                    className="w-[140px]"
                  >
                    הסר מלווה
                  </Button>
                )}
              </div>
              {formData.escort_id && (
                <div className="space-y-2 max-w-md">
                  <Label>בחר מלווה</Label>
                  <Select
                    value={formData.escort_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, escort_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר מלווה..." />
                    </SelectTrigger>
                    <SelectContent>
                      {escorts.map((escort) => (
                        <SelectItem key={escort.id} value={escort.id}>
                          {escort.first_name} {escort.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* גופים */}
            <div className="border-t pt-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> גופים
                </h3>
                {formData.assigned_authorities.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAuthority}
                    className="gap-2 w-[140px]"
                  >
                    הוסף גוף
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {formData.assigned_authorities.length > 0 && (
                <DynamicSection
                  title=""
                  addButtonText="הוסף גוף נוסף"
                  onAdd={addAuthority}
                  onRemove={removeAuthority}
                  items={formData.assigned_authorities}
                  showNumbering={false}
                  centerAddButton={true}
                  hideAddButton={false}
                  renderItem={(assignment, index) => {
                    const selectedAuthority = authorities.find(
                      a => a.id === assignment.authority_id
                    )
                    return (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>בחר גוף</Label>
                          <Select
                            value={assignment.authority_id}
                            onValueChange={(value) =>
                              updateAuthority(index, "authority_id", value)
                            }
                          >
                            <SelectTrigger className="max-w-full">
                              <SelectValue placeholder="בחר גוף..." />
                            </SelectTrigger>
                            <SelectContent className="max-w-[400px]">
                              {authorities.map((auth) => (
                                <SelectItem key={auth.id} value={auth.id} className="truncate">
                                  {auth.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedAuthority && selectedAuthority.supervisors?.length > 0 && (
                          <div className="space-y-2">
                            <Label>בחר מפקח</Label>
                            <Select
                              value={assignment.supervisor_index.toString()}
                              onValueChange={(value) =>
                                updateAuthority(index, "supervisor_index", parseInt(value))
                              }
                            >
                              <SelectTrigger className="max-w-full">
                                <SelectValue placeholder="בחר מפקח..." />
                              </SelectTrigger>
                              <SelectContent className="max-w-[400px]">
                                {selectedAuthority.supervisors.map((supervisor, idx) => (
                                  <SelectItem key={idx} value={idx.toString()} className="truncate">
                                    {supervisor.first_name} {supervisor.last_name} - {supervisor.area}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
              )}
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
                {editingChild ? "שמור שינויים" : "הוסף ילד"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
