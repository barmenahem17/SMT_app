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
  showNumbering?: boolean
  centerAddButton?: boolean
  hideAddButton?: boolean
}

export function DynamicSection({
  title,
  addButtonText,
  onAdd,
  onRemove,
  items,
  renderItem,
  showNumbering = true,
  centerAddButton = false,
  hideAddButton = false,
}: DynamicSectionProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}

      <div className="space-y-4">
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
              {showNumbering && (
                <div className="text-xs text-muted-foreground mb-3 font-medium">
                  #{index + 1}
                </div>
              )}
              {renderItem(item, index)}
            </div>
          </Card>
        ))}

        {/* כפתור הוסף נוסף - מיושר לפי centerAddButton */}
        {!hideAddButton && (
          <div className={`flex pt-2 ${centerAddButton ? 'justify-center' : 'justify-end'}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAdd}
              className="gap-2"
            >
              {addButtonText}
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

