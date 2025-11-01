"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DynamicSectionProps {
  title: string
  addButtonText: string
  children: React.ReactNode
  onAdd: () => void
  onRemove?: (index: number) => void
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
}

export function DynamicSection({
  title,
  addButtonText,
  onAdd,
  onRemove,
  items,
  renderItem,
}: DynamicSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
            לחץ על "{addButtonText}" כדי להוסיף.
          </p>
        )}

        {items.map((item, index) => (
          <Card key={index} className="p-5 relative bg-slate-50 border-2">
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 left-2"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="pr-8">
              <div className="text-xs text-muted-foreground mb-3 font-medium">
                #{index + 1}
              </div>
              {renderItem(item, index)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

