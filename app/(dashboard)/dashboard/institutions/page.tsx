"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp, Search } from "lucide-react"
import { unformatPhoneNumber } from "@/lib/format-phone"

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
  type_other?: string
  letter_code?: string
  address: string
  city?: string
  institution_subtype: string
  subtype_other?: string
  waze_link?: string
  pickup_image_url?: string
  contacts: Contact[]
  created_at: string
}

const emptyContact: Contact = {
  first_name: "",
  last_name: "",
  phone: "",
  role: "מורה",
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const [expandedInstitutionId, setExpandedInstitutionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    type: "בית ספר",
    type_other: "",
    letter_code: "",
    address: "",
    city: "",
    institution_subtype: "עיכוב שפתי",
    subtype_other: "",
    waze_link: "",
    pickup_image_url: "",
    contacts: [] as Contact[],
  })
  const [showContacts, setShowContacts] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchInstitutions()
  }, [])

  async function fetchInstitutions() {
    setLoading(true)
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching institutions:", error)
    } else {
      setInstitutions(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setEditingInstitution(null)
    setFormData({
      name: "",
      type: "בית ספר",
      type_other: "",
      letter_code: "",
      address: "",
      city: "",
      institution_subtype: "עיכוב שפתי",
      subtype_other: "",
      waze_link: "",
      pickup_image_url: "",
      contacts: [{ ...emptyContact }], // שדה אחד פתוח באופן אוטומטי
    })
    setShowContacts(true) // פתוח באופן אוטומטי
    setDialogOpen(true)
  }

  function openEditDialog(institution: Institution) {
    setEditingInstitution(institution)
    setFormData({
      name: institution.name,
      type: institution.type,
      type_other: institution.type_other || "",
      letter_code: institution.letter_code || "",
      address: institution.address,
      city: institution.city || "",
      institution_subtype: institution.institution_subtype,
      subtype_other: institution.subtype_other || "",
      waze_link: institution.waze_link || "",
      pickup_image_url: institution.pickup_image_url || "",
      contacts: institution.contacts || [],
    })
    setShowContacts(institution.contacts && institution.contacts.length > 0)
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const institutionData = {
      name: formData.name,
      type: formData.type,
      type_other: formData.type === "אחר" ? formData.type_other : null,
      letter_code: formData.letter_code || null,
      address: formData.address,
      city: formData.city || null,
      institution_subtype: formData.institution_subtype,
      subtype_other:
        formData.institution_subtype === "אחר" ? formData.subtype_other : null,
      waze_link: formData.waze_link || null,
      pickup_image_url: formData.pickup_image_url || null,
      contacts: formData.contacts,
    }

    if (editingInstitution) {
      const { error } = await supabase
        .from("institutions")
        .update(institutionData)
        .eq("id", editingInstitution.id)

      if (error) {
        console.error("Error updating institution:", error)
        alert("שגיאה בעדכון המוסד")
      } else {
        setDialogOpen(false)
        fetchInstitutions()
      }
    } else {
      const { error } = await supabase
        .from("institutions")
        .insert([institutionData])

      if (error) {
        console.error("Error adding institution:", error)
        alert("שגיאה בהוספת המוסד")
      } else {
        setDialogOpen(false)
        fetchInstitutions()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המוסד?")) return

    const { error } = await supabase.from("institutions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting institution:", error)
      alert("שגיאה במחיקת המוסד")
    } else {
      fetchInstitutions()
    }
  }

  function addContact() {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { ...emptyContact }],
    })
  }

  function removeContact(index: number) {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index),
    })
  }

  function updateContact(index: number, field: keyof Contact, value: string) {
    const newContacts = [...formData.contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setFormData({ ...formData, contacts: newContacts })
  }

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ניהול מוסדות</h1>
          <p className="text-muted-foreground">ניהול בתי ספר, גנים ומוסדות חינוך</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2 absolute left-0">
          הוסף מוסד חדש
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* שורת חיפוש */}
      {!loading && institutions.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש לפי שם המוסד..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : institutions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין מוסדות במערכת</p>
          <Button onClick={openAddDialog}>הוסף את המוסד הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {institutions
            .filter((institution) => {
              if (!searchQuery.trim()) return true
              const query = searchQuery.toLowerCase()
              return institution.name.toLowerCase().includes(query)
            })
            .map((institution) => {
            const isExpanded = expandedInstitutionId === institution.id
            return (
              <Card key={institution.id} className="p-6">
                <div className="space-y-3">
                  {/* כרטיס בסיסי */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="text-xl font-semibold">{institution.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>
                            {institution.type === "אחר" && institution.type_other
                              ? institution.type_other
                              : institution.type}
                          </span>
                          {institution.letter_code && (
                            <span>אות: {institution.letter_code}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>כתובת:</strong> {institution.address}
                        {institution.city && `, ${institution.city}`}
                      </div>
                      <div className="text-sm">
                        <strong>סוג:</strong>{" "}
                        {institution.institution_subtype === "אחר" &&
                        institution.subtype_other
                          ? institution.subtype_other
                          : institution.institution_subtype}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(institution)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(institution.id)}
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
                      onClick={() => setExpandedInstitutionId(isExpanded ? null : institution.id)}
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
                    <div className="space-y-3 pt-2">
                      {institution.waze_link && (
                        <div>
                          <a
                            href={institution.waze_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            פתח ב-Waze <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {institution.contacts && institution.contacts.length > 0 && (
                        <div className={institution.waze_link ? "pt-2 border-t" : ""}>
                          <strong className="text-sm">אנשי קשר:</strong>
                          <div className="mt-2 space-y-2">
                            {institution.contacts.map((contact, i) => (
                              <div key={i} className="text-sm bg-slate-50 p-2 rounded">
                                <div className="text-muted-foreground">
                                  <strong>{contact.role === "אחר" && contact.role_other ? contact.role_other : contact.role}:</strong> {contact.first_name} {contact.last_name}
                                </div>
                                <div className="text-muted-foreground mt-1">
                                  <strong>טלפון:</strong> {contact.phone}
                                </div>
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
              {editingInstitution ? "עריכת מוסד" : "הוספת מוסד חדש"}
            </DialogTitle>
            <DialogDescription>מלא את כל הפרטים הנדרשים</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 grid-cols-[2fr_140px_100px]">
              <div className="space-y-2">
                <Label htmlFor="name">
                  שם המוסד <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  סוג המוסד <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="בית ספר">בית ספר</SelectItem>
                    <SelectItem value="גן">גן</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="letter_code">אות</Label>
                <Input
                  id="letter_code"
                  value={formData.letter_code}
                  onChange={(e) =>
                    setFormData({ ...formData, letter_code: e.target.value })
                  }
                  placeholder="כחל"
                />
              </div>
            </div>

            {formData.type === "אחר" && (
              <div className="space-y-2">
                <Label htmlFor="type_other">תיאור סוג המוסד</Label>
                <Input
                  id="type_other"
                  value={formData.type_other}
                  onChange={(e) =>
                    setFormData({ ...formData, type_other: e.target.value })
                  }
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">
                  כתובת <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="רחוב ומספר"
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
                <Label htmlFor="institution_subtype">
                  סוג מוסד <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.institution_subtype}
                  onValueChange={(value) =>
                    setFormData({ ...formData, institution_subtype: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="עיכוב שפתי">עיכוב שפתי</SelectItem>
                    <SelectItem value="עיכוב התפתחותי">עיכוב התפתחותי</SelectItem>
                    <SelectItem value="אוטיזם">אוטיזם</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.institution_subtype === "אחר" && (
              <div className="space-y-2">
                <Label htmlFor="subtype_other">תיאור סוג המוסד</Label>
                <Input
                  id="subtype_other"
                  value={formData.subtype_other}
                  onChange={(e) =>
                    setFormData({ ...formData, subtype_other: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="waze_link">קישור לוויז</Label>
              <Input
                id="waze_link"
                value={formData.waze_link}
                onChange={(e) =>
                  setFormData({ ...formData, waze_link: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_image_url">תמונת מקום איסוף (URL)</Label>
              <Input
                id="pickup_image_url"
                value={formData.pickup_image_url}
                onChange={(e) =>
                  setFormData({ ...formData, pickup_image_url: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                העלה תמונה ל-Supabase Storage והדבק כאן את הקישור
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">אנשי קשר</h3>

                <DynamicSection
                  title=""
                  addButtonText="הוסף איש קשר נוסף"
                  onAdd={addContact}
                  onRemove={removeContact}
                  items={formData.contacts}
                  centerAddButton={true}
                  renderItem={(contact, index) => (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>שם פרטי</Label>
                          <Input
                            value={contact.first_name}
                            onChange={(e) =>
                              updateContact(index, "first_name", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>שם משפחה</Label>
                          <Input
                            value={contact.last_name}
                            onChange={(e) =>
                              updateContact(index, "last_name", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>תפקיד</Label>
                          <Select
                            value={contact.role}
                            onValueChange={(value) =>
                              updateContact(index, "role", value)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="מורה">מורה</SelectItem>
                              <SelectItem value="גננת">גננת</SelectItem>
                              <SelectItem value="אחר">אחר</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {contact.role === "אחר" && (
                          <div className="space-y-2">
                            <Label>תיאור התפקיד</Label>
                            <Input
                              value={contact.role_other || ""}
                              onChange={(e) =>
                                updateContact(index, "role_other", e.target.value)
                              }
                              placeholder="למשל: מזכירה, מנהל..."
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>מספר טלפון</Label>
                          <PhoneInput
                            value={contact.phone}
                            onChange={(value) =>
                              updateContact(index, "phone", value)
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
                {editingInstitution ? "שמור שינויים" : "הוסף מוסד"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

