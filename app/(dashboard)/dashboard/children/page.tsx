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
import { Plus, Pencil, Trash2 } from "lucide-react"
import { unformatPhoneNumber } from "@/lib/format-phone"

interface Parent {
  first_name: string
  last_name: string
  relation: string
  relation_other?: string
  phone: string
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
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
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
  })
  const [showParents, setShowParents] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    setLoading(true)
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching children:", error)
    } else {
      setChildren(data || [])
    }
    setLoading(false)
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
      parents: [{ ...emptyParent }], // שדה אחד פתוח באופן אוטומטי
    })
    setShowParents(true) // פתוח באופן אוטומטי
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
    })
    setShowParents(child.parents && child.parents.length > 0)
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
    }

    if (editingChild) {
      // עריכה
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
      // הוספה
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
    setFormData({
      ...formData,
      parents: [...formData.parents, { ...emptyParent }],
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול ילדים</h1>
          <p className="text-muted-foreground">
            ניהול מלא של פרטי הילדים והורים
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          הוסף ילד חדש
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : children.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין ילדים במערכת</p>
          <Button onClick={openAddDialog}>הוסף את הילד הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => (
            <Card key={child.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {child.first_name} {child.last_name}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>מין: {child.gender}</span>
                      <span>גיל: {child.age}</span>
                      {child.phone && <span>טלפון: {child.phone}</span>}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>כתובת:</strong> {child.home_address}
                    {child.city && `, ${child.city}`}
                  </div>
                  {child.disability && (
                    <div className="text-sm">
                      <strong>מוגבלות:</strong> {child.disability}
                    </div>
                  )}
                  {child.notes && (
                    <div className="text-sm">
                      <strong>הערות:</strong> {child.notes}
                    </div>
                  )}
                  {child.parents && child.parents.length > 0 && (
                    <div className="pt-2 border-t">
                      <strong className="text-sm">הורים:</strong>
                      <div className="mt-2 space-y-1">
                        {child.parents.map((parent, i) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            {parent.first_name} {parent.last_name} (
                            {parent.relation === "אחר" && parent.relation_other
                              ? parent.relation_other
                              : parent.relation}
                            ) - {parent.phone}
                          </div>
                        ))}
                      </div>
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
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingChild ? "עריכת ילד" : "הוספת ילד חדש"}
            </DialogTitle>
            <DialogDescription>
              מלא את כל הפרטים הנדרשים
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                rows={3}
              />
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">הורים</h3>

                <DynamicSection
                  title=""
                  addButtonText="הוסף הורה נוסף"
                  onAdd={addParent}
                  onRemove={removeParent}
                  items={formData.parents}
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
                {editingChild ? "שמור שינויים" : "הוסף ילד"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

