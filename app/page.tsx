import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">SMT App</h1>
          <nav className="flex gap-4">
            <Button variant="ghost">דף הבית</Button>
            <Button variant="ghost">אודות</Button>
            <Button variant="default">התחבר</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-l from-primary to-slate-700 bg-clip-text text-transparent">
            ברוכים הבאים למערכת ניהול ההסעות
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            מערכת מתקדמת לניהול הסעות ילדים עם צרכים מיוחדים
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">התחל עכשיו</Button>
            <Button size="lg" variant="outline">למד עוד</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">מה כלול במערכת?</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>📋 ניהול ילדים</CardTitle>
              <CardDescription>
                ניהול מקיף של פרטי הילדים, צרכים מיוחדים ופרטי קשר
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                שמור את כל המידע החשוב במקום אחד ונגיש
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🚗 ניהול נהגים ורכבים</CardTitle>
              <CardDescription>
                מעקב אחר נהגים, רכבים וזמינות בזמן אמת
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                תכנון חכם של משאבים לאופטימיזציה מקסימלית
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗺️ תכנון מסלולים</CardTitle>
              <CardDescription>
                תכנון מסלולי הסעה יעילים וחכמים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                חיסכון בזמן ובעלויות עם תכנון אופטימלי
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">סטטוס המערכת</CardTitle>
            <CardDescription className="text-center">
              המערכת מוכנה ופועלת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">✅</div>
                <div className="text-sm font-medium">תשתית מוכנה</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">🎨</div>
                <div className="text-sm font-medium">עיצוב RTL</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">🗄️</div>
                <div className="text-sm font-medium">Supabase מחובר</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 SMT App - מערכת ניהול הסעות. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

