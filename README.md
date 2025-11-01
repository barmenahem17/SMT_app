# SMT App - מערכת ניהול הסעות

מערכת פנימית לניהול הסעות ילדים עם צרכים מיוחדים (Special Medical Transportation).

## 📋 תיאור הפרויקט

מערכת זו נועדה לנהל את כל ההיבטים של הסעות ילדים עם צרכים מיוחדים, כולל:
- ניהול פרטי ילדים
- ניהול נהגים ורכבים
- תכנון מסלולי הסעה
- מעקב בזמן אמת
- דוחות וניתוחים

## 🏗️ ארכיטקטורה וטכנולוגיות

### Frontend
- **Next.js 14** - React framework עם App Router
- **TypeScript** - לבטיחות קוד מקסימלית
- **Tailwind CSS** - לעיצוב מהיר ואחיד
- **ShadCN/ui** - ספריית קומפוננטות מתקדמת

### Backend & Database
- **Supabase** - מסד נתונים PostgreSQL עם real-time capabilities
- **Supabase Auth** - אימות משתמשים (בעתיד)
- **Supabase Storage** - אחסון קבצים (בעתיד)

### עיצוב
- **RTL Support** - תמיכה מלאה בכיוון ימין לשמאל
- **פונט Heebo** - פונט עברי מקצועי ונוח לקריאה
- **Responsive Design** - התאמה לכל הגדלים של מסכים

## 🎨 עקרונות עיצוב

### כיווניות (RTL)
- כל האפליקציה פועלת מימין לשמאל
- כל הקומפוננטות מותאמות לעברית
- שימוש בפונטים עבריים איכוטיים

### חוויית משתמש
- ממשק נקי ופשוט
- ניווט אינטואיטיבי
- פידבק ויזואלי ברור
- נגישות למשתמשים

### קוד נקי
- TypeScript לכל הקוד
- Component-based architecture
- עקרונות DRY (Don't Repeat Yourself)
- תיעוד מלא של קוד מורכב

## 📁 מבנה תיקיות

```
SMT_app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout ראשי עם RTL
│   ├── page.tsx             # דף הבית
│   └── globals.css          # סגנונות גלובליים
├── components/              # React Components
│   └── ui/                  # קומפוננטות UI (ShadCN)
│       ├── button.tsx
│       └── card.tsx
├── lib/                     # Utilities & helpers
│   ├── utils.ts            # פונקציות עזר
│   └── supabase/           # Supabase configuration
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── middleware.ts   # Session management
├── middleware.ts            # Next.js middleware
├── components.json          # ShadCN configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies
```

## 🚀 התקנה והרצה

### דרישות מקדימות
- Node.js 18+ 
- npm או yarn
- חשבון Supabase

### שלבי התקנה

1. **התקנת תלויות**
```bash
npm install
```

2. **הגדרת Supabase**

צור קובץ `.env.local` בתיקיית השורש והעתק את הערכים מ-`env.example`:

```bash
cp env.example .env.local
```

השג את הערכים מ-Supabase:
- היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
- בחר בפרויקט **SMT_app**
- לך ל-**Settings > API**
- העתק את **Project URL** ואת **anon/public key**
- הדבק ב-`.env.local`

3. **הרצת שרת פיתוח**
```bash
npm run dev
```

האפליקציה תהיה זמינה ב-[http://localhost:3000](http://localhost:3000)

## 🔗 חיבור ל-GitHub

הפרויקט כבר מחובר ל-Git מקומי. לחיבור ל-GitHub:

### שלב 1: חבר את ה-Repository
```bash
git remote add origin https://github.com/barmenahem17/SMT_app.git
```

### שלב 2: בדוק את החיבור
```bash
git remote -v
```

### שלב 3: שמור שינויים (רק כשאתה מוכן!)
```bash
# הוסף את כל הקבצים
git add .

# צור commit עם הודעה
git commit -m "תיאור השינויים"

# דחוף ל-GitHub
git push -u origin main
```

**חשוב**: הפרויקט **לא ישמור אוטומטית**. שמור שינויים רק כשאתה מוכן!

## 🔐 אבטחה

### קבצים שלא נשמרים ל-Git
הקבצים הבאים נמצאים ב-`.gitignore` ולא נשמרים ל-GitHub:
- `.env.local` - משתני סביבה (סודות!)
- `node_modules/` - תלויות
- `.next/` - קבצי build

### משתני סביבה
**לעולם אל תשתף** את הקבצים הבאים:
- `.env.local` - מכיל מפתחות API
- כל קובץ עם סיסמאות או טוקנים

## 📊 מסד הנתונים (Supabase)

### חיבור למסד הנתונים
מסד הנתונים פועל על Supabase בפרויקט **SMT_app**.

### שימוש בקליינט
```typescript
// Browser (Client Component)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server (Server Component/Route Handler)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### תכנון טבלאות
התכנון המלא של מסד הנתונים יבוא בשלבים הבאים לפי הצרכים.

## 🎯 תכנון עתידי

הפרויקט מוכן להתפתחות בשלבים הבאים:
1. ✅ תשתית בסיסית (הושלם)
2. 📋 תכנון מודל נתונים
3. 👥 מערכת ניהול ילדים
4. 🚗 מערכת ניהול נהגים ורכבים
5. 🗺️ תכנון מסלולי הסעה
6. 📊 דוחות וניתוחים
7. 📱 מעקב בזמן אמת

## 🤝 פיתוח

### כללי קוד
- השתמש ב-TypeScript תמיד
- עקוב אחר עקרונות clean code
- תעד קוד מורכב
- בדוק את הקוד לפני commit

### הוספת קומפוננטות ShadCN
```bash
npx shadcn-ui@latest add [component-name]
```

## 📝 רישיונות

פרויקט פרטי - כל הזכויות שמורות.

---

**שאלות?** פנה למנהל הפרויקט.

