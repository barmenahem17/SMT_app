# 🚀 הוראות התקנה והפעלה - מסיעי סמי ומשה

---

## 📋 סטטוס הפרויקט

### ✅ מה הושלם עד כה

#### Phase 1: תשתית ועיצוב
- ✅ פרויקט Next.js 14.2.15 עם TypeScript
- ✅ Tailwind CSS + ShadCN/ui v4
- ✅ תמיכה מלאה ב-RTL (ימין לשמאל)
- ✅ פונט Heebo לעברית
- ✅ Git + GitHub (SSH)
- ✅ Supabase + MCP Integration

#### Phase 2: מסד נתונים
- ✅ טבלת **children** (ילדים) + הורים (JSONB)
- ✅ טבלת **institutions** (מוסדות) + אנשי קשר (JSONB)
- ✅ טבלת **authorities** (גופים) + מפקחים (JSONB)
- ✅ טבלת **drivers** (נהגים)
- ✅ טבלת **escorts** (מלווים)
- ✅ RLS Policies לכל הטבלאות
- ✅ Triggers לעדכון `updated_at` אוטומטי
- ✅ Storage bucket לתמונות מוסדות

#### Phase 3: UI/UX
- ✅ דף כניסה מעוצב עם אנימציות
- ✅ Sidebar דינמי (פתיחה/סגירה)
- ✅ דף בית דשבורד עם חיפוש וסינון
- ✅ 5 דפי ניהול מלאים
- ✅ פורמט טלפון אוטומטי (050-123-4567)
- ✅ קומפוננטות דינמיות
- ✅ תפריטים נפתחים RTL מלאים
- ✅ הפרדה ויזואלית משופרת

---

## 🛠️ התקנה ראשונית

### דרישות מקדימות
- **Node.js 18+** ([הורדה](https://nodejs.org/))
- **npm** או **yarn**
- **Git** ([הורדה](https://git-scm.com/))
- חשבון **Supabase** ([הרשמה](https://supabase.com/))

### שלב 1: Clone הפרויקט

```bash
# Clone מ-GitHub (SSH)
git clone git@github.com:barmenahem17/SMT_app.git

# כנס לתיקייה
cd SMT_app
```

### שלב 2: התקנת תלויות

```bash
npm install
```

זה יתקין:
- Next.js 14.2.15
- React 18
- TypeScript
- Tailwind CSS
- ShadCN/ui components
- Supabase client
- Lucide icons
- ועוד...

### שלב 3: הגדרת משתני סביבה

#### א. צור קובץ .env.local

```bash
cp env.example .env.local
```

#### ב. קבל את פרטי Supabase

1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. בחר בפרויקט **SMT_app**
3. לך ל-**Settings → API**
4. העתק:
   - **Project URL** (תחת Configuration)
   - **anon public key** (תחת Project API keys)

#### ג. עדכן את .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://iguqsfmkjismfctjdncn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**החלף את הערכים בפרטים האמיתיים שלך!**

### שלב 4: הרץ את המיגרציות (אם צריך)

אם מסד הנתונים ריק, רוץ את המיגרציות:

1. פתח את [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. העתק והרץ כל קובץ מתיקיית `supabase/migrations/`:
   - `001_create_children_table.sql`
   - `002_create_institutions_table.sql`
   - `003_create_authorities_table.sql`
   - `004_create_drivers_table.sql`
   - `005_create_escorts_table.sql`

### שלב 5: הפעל את השרת

```bash
npm run dev
```

האפליקציה תרוץ ב-[http://localhost:3000](http://localhost:3000) 🎉

---

## 🔗 חיבור Supabase MCP ב-Cursor

אם אתה משתמש ב-Cursor IDE עם MCP:

### עדכן את mcp.json

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-access-token",
        "SUPABASE_PROJECT_REF": "iguqsfmkjismfctjdncn"
      }
    }
  }
}
```

**הערה**: ה-`project_ref` הוא החלק הראשון מה-URL (`https://iguqsfmkjismfctjdncn.supabase.co`)

---

## 📂 מבנה הפרויקט המעודכן

```
SMT_app/
├── app/
│   ├── (dashboard)/              # דפים עם Sidebar
│   │   ├── layout.tsx           # Layout עם Sidebar
│   │   └── dashboard/
│   │       ├── page.tsx         # 🏠 דף בית + חיפוש
│   │       ├── children/        # 👶 ניהול ילדים
│   │       ├── institutions/    # 🏫 ניהול מוסדות
│   │       ├── authorities/     # 🏛️ ניהול גופים
│   │       ├── drivers/         # 🚗 ניהול נהגים
│   │       └── escorts/         # 👤 ניהול מלווים
│   ├── layout.tsx               # Root Layout (RTL)
│   ├── page.tsx                 # ✨ דף כניסה מעוצב
│   └── globals.css              # סגנונות גלובליים
├── components/
│   ├── ui/                      # ShadCN Components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx          # ✅ RTL מתוקן
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   └── phone-input.tsx     # 📱 עם פורמט
│   ├── sidebar.tsx              # תפריט צד
│   └── dynamic-section.tsx      # קומפוננטה דינמית
├── lib/
│   ├── utils.ts                 # פונקציות עזר
│   ├── format-phone.ts          # פורמט טלפון
│   └── supabase/
│       ├── client.ts            # Browser client
│       ├── server.ts            # Server client
│       └── middleware.ts        # Session management
├── supabase/
│   └── migrations/              # 🗄️ מיגרציות
│       ├── 001_create_children_table.sql
│       ├── 002_create_institutions_table.sql
│       ├── 003_create_authorities_table.sql
│       ├── 004_create_drivers_table.sql
│       └── 005_create_escorts_table.sql
├── .env.local                   # 🔒 סודות (לא ב-Git)
├── env.example                  # דוגמה
├── README.md                    # תיעוד ראשי
└── SETUP_INSTRUCTIONS.md        # הקובץ הזה
```

---

## 🎯 מדריך שימוש מהיר

### כניסה למערכת

1. פתח [http://localhost:3000](http://localhost:3000)
2. תראה דף כניסה מעוצב עם אנימציות
3. לחץ "כניסה למערכת"

### חיפוש בדף הבית

1. הקלד שם בשדה החיפוש
2. או לחץ על קטגוריה לסינון:
   - ילדים
   - הורים
   - מלווים
   - נהגים
   - מפקחים
   - עובדי הוראה
   - מוסדות
3. ראה תוצאות בטבלה

### הוספת ילד חדש

1. לך ל-**ילדים** בסיידבר
2. לחץ **"הוסף ילד"**
3. מלא את הפרטים:
   - שם פרטי, שם משפחה (חובה)
   - מין: זכר/נקבה (חובה)
   - גיל (חובה)
   - טלפון (אוטומטי מתעצב ל-050-123-4567)
   - כתובת מגורים (חובה)
   - הערות
4. **הוסף הורה** (אופציונלי):
   - לחץ "הוסף הורה"
   - מלא פרטי הורה
   - אפשר להוסיף כמה שרוצים
5. **שמור**

### הוספת מוסד

1. לך ל-**מוסדות** בסיידבר
2. לחץ **"הוסף מוסד"**
3. מלא פרטים:
   - שם המוסד (חובה)
   - סוג: בית ספר/גן/אחר (חובה)
   - אות (למשל: כחל)
   - כתובת (חובה)
   - סוג מוסד: עיכוב שפתי/התפתחותי/אוטיזם/אחר (חובה)
   - קישור ווייז
   - URL לתמונת מקום איסוף
4. **הוסף איש קשר** (אופציונלי):
   - תפקיד: מורה/גננת/אחר
   - שם ומספר טלפון
5. **שמור**

### הוספת גוף

1. לך ל-**גופים** בסיידבר
2. מלא: שם הגוף, טלפון, אימייל
3. **הוסף מפקח** (אופציונלי):
   - שם, איזור, אימייל
4. **שמור**

---

## 🔧 פקודות נוספות

### פיתוח

```bash
# הפעל שרת פיתוח
npm run dev

# בנה לפרודקשן
npm run build

# הרץ פרודקשן מקומית
npm run start

# בדיקת lint
npm run lint
```

### Git

```bash
# בדוק סטטוס
git status

# הוסף שינויים
git add .

# צור commit
git commit -m "תיאור השינויים"

# דחוף ל-GitHub
git push

# משוך שינויים
git pull
```

### ShadCN Components

```bash
# הוסף קומפוננטה חדשה
npx shadcn-ui@latest add [component-name]

# דוגמאות:
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
```

---

## 🐛 פתרון בעיות נפוצות

### 1. השרת לא עולה

```bash
# נקה והתקן מחדש
rm -rf node_modules .next
npm install
npm run dev
```

### 2. Supabase לא מתחבר

- ✅ בדוק ש-`.env.local` קיים
- ✅ בדוק שהערכים נכונים (ללא רווחים)
- ✅ בדוק שאין שגיאות בקונסול
- ✅ רענן את הדף אחרי שינוי `.env.local`

### 3. בעיות RTL

אם טקסט מופיע בכיוון הלא נכון:
- ✅ וודא `dir="rtl"` ב-`app/layout.tsx`
- ✅ בדוק `text-right` בקומפוננטות
- ✅ בדוק `flex-row-reverse` בתפריטים

### 4. פורמט טלפון לא עובד

- ✅ וודא שמשתמש ב-`PhoneInput` ולא ב-`Input` רגיל
- ✅ וודא ש-`formatPhoneNumber` מיובא מ-`@/lib/format-phone`

### 5. Git Push נכשל

```bash
# אם יש בעיית authentication
git remote set-url origin git@github.com:barmenahem17/SMT_app.git

# אם צריך לעשות pull קודם
git pull --rebase
git push
```

---

## 📚 משאבים נוספים

### תיעוד

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [ShadCN/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### דפי דוגמה

- דף כניסה: `app/page.tsx`
- דף בית דשבורד: `app/(dashboard)/dashboard/page.tsx`
- ניהול ילדים: `app/(dashboard)/dashboard/children/page.tsx`
- סיידבר: `components/sidebar.tsx`
- פורמט טלפון: `lib/format-phone.ts`

---

## ✅ Checklist לפני התחלה

- [ ] Node.js 18+ מותקן
- [ ] npm מותקן
- [ ] Git מותקן
- [ ] חשבון Supabase פעיל
- [ ] Repository נמשך מ-GitHub
- [ ] `npm install` הורץ
- [ ] `.env.local` קיים עם הערכים הנכונים
- [ ] `npm run dev` עובד
- [ ] האפליקציה נפתחת ב-http://localhost:3000
- [ ] ניתן לנווט בין דפים
- [ ] ניתן להוסיף/לערוך נתונים

---

## 🎓 טיפים לפיתוח

### 1. שמירת שינויים

```bash
# תמיד לפני שמתחיל לעבוד
git status
git pull

# לסיים תכונה
git add .
git commit -m "תיאור ברור של מה שנעשה"
git push
```

### 2. עבודה עם Supabase

```typescript
// Client Component
'use client'
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server Component
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### 3. RTL Best Practices

```tsx
// תפריט נפתח
<Select>
  <SelectTrigger className="text-right">
    {/* הטקסט יהיה מימין, החץ משמאל */}
  </SelectTrigger>
</Select>

// Flexbox RTL
<div className="flex flex-row-reverse">
  {/* פריטים יופיעו בסדר הפוך */}
</div>
```

### 4. פורמט טלפון

```typescript
import { formatPhoneNumber, unformatPhoneNumber } from '@/lib/format-phone'

// לתצוגה
const display = formatPhoneNumber("0501234567")
// → "050-123-4567"

// לשמירה
const plain = unformatPhoneNumber("050-123-4567")
// → "0501234567"
```

---

## 🚀 מוכן להמשיך!

הכל מוכן, המערכת עובדת, אפשר להתחיל לעבוד!

### מה הלאה? (Phase 4)

- [ ] קישורים בין ישויות (ילד ↔ מוסד, ילד ↔ נהג)
- [ ] מערכת הסעות (מסלולים, תזמון)
- [ ] לוח שנה ותזמון
- [ ] דוחות וניתוחים
- [ ] ייצוא נתונים (Excel, PDF)
- [ ] התראות ועדכונים
- [ ] מעקב בזמן אמת

**ספר לי מה תרצה לבנות בהמשך!** 🎯

---

**זכור**:
- 💾 שמור שינויים רק כשאתה מוכן
- 🔒 אל תשתף `.env.local` או סודות
- 📝 תעד שינויים חשובים
- ✅ בדוק שהכל עובד לפני commit
- 🎨 שמור על עקרונות RTL

**שאלות?** בדוק את `README.md` או פנה למנהל הפרויקט.
