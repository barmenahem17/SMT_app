import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold">
            מערכת ניהול הסעות
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            מסיעי סמי ומשה
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            מערכת לניהול הסעות ילדים עם צרכים מיוחדים
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/children" className="w-full">
              <Button size="lg" className="w-full">
                כניסה למסד הנתונים
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">קטגוריות</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">✓</div>
                <div className="text-xs text-muted-foreground">מוכן לשימוש</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">RTL</div>
                <div className="text-xs text-muted-foreground">תמיכה מלאה</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

