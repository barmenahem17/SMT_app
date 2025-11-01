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

interface Driver {
  id: string
  first_name: string
  last_name: string
  car_number: string
  car_type: string
  phone: string
  notes?: string
  created_at: string
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    car_number: "",
    car_type: "",
    phone: "",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDrivers()
  }, [])

  async function fetchDrivers() {
    setLoading(true)
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching drivers:", error)
    } else {
      setDrivers(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setEditingDriver(null)
    setFormData({
      first_name: "",
      last_name: "",
      car_number: "",
      car_type: "",
      phone: "",
      notes: "",
    })
    setDialogOpen(true)
  }

  function openEditDialog(driver: Driver) {
    setEditingDriver(driver)
    setFormData({
      first_name: driver.first_name,
      last_name: driver.last_name,
      car_number: driver.car_number,
      car_type: driver.car_type,
      phone: driver.phone,
      notes: driver.notes || "",
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const driverData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      car_number: formData.car_number,
      car_type: formData.car_type,
      phone: unformatPhoneNumber(formData.phone) || null,
      notes: formData.notes || null,
    }

    if (editingDriver) {
      const { error } = await supabase
        .from("drivers")
        .update(driverData)
        .eq("id", editingDriver.id)

      if (error) {
        console.error("Error updating driver:", error)
        alert("שגיאה בעדכון הנהג")
      } else {
        setDialogOpen(false)
        fetchDrivers()
      }
    } else {
      const { error } = await supabase.from("drivers").insert([driverData])

      if (error) {
        console.error("Error adding driver:", error)
        alert("שגיאה בהוספת הנהג")
      } else {
        setDialogOpen(false)
        fetchDrivers()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הנהג?")) return

    const { error } = await supabase.from("drivers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting driver:", error)
      alert("שגיאה במחיקת הנהג")
    } else {
      fetchDrivers()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול נהגים</h1>
          <p className="text-muted-foreground">ניהול מלא של נהגי ההסעות</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          הוסף נהג חדש
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">טוען...</div>
      ) : drivers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין נהגים במערכת</p>
          <Button onClick={openAddDialog}>הוסף את הנהג הראשון</Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <Card key={driver.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {driver.first_name} {driver.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{driver.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => openEditDialog(driver)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDelete(driver.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>רכב:</strong> {driver.car_type}
                </div>
                <div>
                  <strong>מספר:</strong> {driver.car_number}
                </div>
                {driver.notes && (
                  <div className="pt-2 border-t">
                    <strong>הערות:</strong> {driver.notes}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "עריכת נהג" : "הוספת נהג חדש"}
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="car_number">
                  מספר רכב <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="car_number"
                  value={formData.car_number}
                  onChange={(e) =>
                    setFormData({ ...formData, car_number: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="car_type">
                  סוג רכב <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="car_type"
                  value={formData.car_type}
                  onChange={(e) =>
                    setFormData({ ...formData, car_type: e.target.value })
                  }
                  placeholder="למשל: טויוטה לבנה"
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
                {editingDriver ? "שמור שינויים" : "הוסף נהג"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

