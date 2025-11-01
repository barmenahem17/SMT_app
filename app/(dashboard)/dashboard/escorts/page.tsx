"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { unformatPhoneNumber } from "@/lib/format-phone"

interface Escort {
  id: string
  first_name: string
  last_name: string
  phone: string
  notes?: string
  created_at: string
}

export default function EscortsPage() {
  const [escorts, setEscorts] = useState<Escort[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEscort, setEditingEscort] = useState<Escort | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchEscorts()
  }, [])

  async function fetchEscorts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("escorts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching escorts:", error)
    } else {
      setEscorts(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setEditingEscort(null)
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      notes: "",
    })
    setDialogOpen(true)
  }

  function openEditDialog(escort: Escort) {
    setEditingEscort(escort)
    setFormData({
      first_name: escort.first_name,
      last_name: escort.last_name,
      phone: escort.phone,
      notes: escort.notes || "",
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const escortData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: unformatPhoneNumber(formData.phone) || null,
      notes: formData.notes || null,
    }

    if (editingEscort) {
      const { error } = await supabase
        .from("escorts")
        .update(escortData)
        .eq("id", editingEscort.id)

      if (error) {
        console.error("Error updating escort:", error)
        alert("שגיאה בעדכון המלווה")
      } else {
        setDialogOpen(false)
        fetchEscorts()
      }
    } else {
      const { error } = await supabase.from("escorts").insert([escortData])

      if (error) {
        console.error("Error adding escort:", error)
        alert("שגיאה בהוספת המלווה")
      } else {
        setDialogOpen(false)
        fetchEscorts()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המלווה?")) return

    const { error } = await supabase.from("escorts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting escort:", error)
      alert("שגיאה במחיקת המלווה")
    } else {
      fetchEscorts()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול מלווים</h1>
          <p className="text-muted-foreground">ניהול מלא של מלווי ההסעות</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          הוסף מלווה חדש
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : escorts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין מלווים במערכת</p>
          <Button onClick={openAddDialog}>הוסף את המלווה הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {escorts.map((escort) => (
            <Card key={escort.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {escort.first_name} {escort.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{escort.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => openEditDialog(escort)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDelete(escort.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
              {escort.notes && (
                <div className="text-sm border-t pt-3">
                  <strong>הערות:</strong> {escort.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEscort ? "עריכת מלווה" : "הוספת מלווה חדש"}
            </DialogTitle>
            <DialogDescription>מלא את כל הפרטים הנדרשים</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="phone">
                מספר טלפון <span className="text-destructive">*</span>
              </Label>
              <PhoneInput
                id="phone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                placeholder="050-123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
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
                {editingEscort ? "שמור שינויים" : "הוסף מלווה"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

