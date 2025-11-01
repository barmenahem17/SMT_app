# מסיעי סמי ומשה - SMT App 🚌

מערכת ניהול מתקדמת להסעות ילדים עם צרכים מיוחדים

---

## 📋 תיאור הפרויקט

**מערכת ניהול הסעות מקיפה** שנועדה לנהל את כל ההיבטים של הסעות ילדים עם צרכים מיוחדים, כולל ניהול ילדים, הורים, נהגים, מלווים, מוסדות וגופים מפקחים.

### ✨ תכונות עיקריות

- 🔍 **חיפוש וסינון מתקדם** - חיפוש בכל מסד הנתונים עם סינון לפי קטגוריות
- 📊 **ניהול מסד נתונים מלא** - ילדים, הורים, נהגים, מלווים, מוסדות וגופים
- 📱 **פורמט טלפון אוטומטי** - עיצוב מספרי טלפון עם מקפים (050-123-4567)
- 🎨 **עיצוב מודרני ומקצועי** - דף כניסה מעוצב עם אנימציות
- ⚡ **Real-time Database** - עדכונים בזמן אמת דרך Supabase
- 🌐 **תמיכה מלאה ב-RTL** - כל המערכת מימין לשמאל

---

## 🏗️ ארכיטקטורה וטכנולוגיות

### Frontend Stack
- **Next.js 14.2.15** - React framework עם App Router
- **TypeScript** - בטיחות קוד מקסימלית
- **Tailwind CSS** - עיצוב מהיר ואחיד
- **ShadCN/ui v4** - ספריית קומפוננטות מתקדמת
- **Lucide React** - אייקונים מודרניים

### Backend & Database
- **Supabase** - PostgreSQL עם real-time capabilities
- **Row Level Security (RLS)** - אבטחת נתונים ברמת השורה
- **Supabase Storage** - אחסון תמונות (מוכן לשימוש)
- **Real-time Subscriptions** - עדכונים בזמן אמת

### עיצוב ו-UX
- **RTL Full Support** - תמיכה מלאה בכיוון ימין לשמאל
- **פונט Heebo** - פונט עברי מקצועי מ-Google Fonts
- **Responsive Design** - מותאם לכל גדלי מסכים
- **Animations** - אנימציות חלקות ומרשימות

---

## 🎨 עקרונות עיצוב חשובים

### כיווניות RTL - מימין לשמאל

**חוק ברזל**: כל המערכת פועלת מימין לשמאל!

#### תפריטים נפתחים (Select)
```
┌─────────────────────┐
│  אמא              ▼ │  ← תפריט סגור: טקסט ימין, חץ שמאל
└─────────────────────┘

┌─────────────────────┐
│  אמא              ✓ │  ← תפריט פתוח: טקסט ימין, סימון שמאל
│  אבא                │
│  אחר                │
└─────────────────────┘
```

**יישום טכני**:
- שימוש ב-`flex-row-reverse` להיפוך סדר אלמנטים
- `text-right` לטקסט
- סימונים ב-`absolute left-2`

#### כפתורים וממשק
- כפתורים עם אייקונים: האייקון **משמאל** לטקסט
- כותרות: יישור לימין
- טפסים: תוויות מעל שדות, טקסט מיושר לימין
- טבלאות: כותרות ותוכן מיושרים לימין

### פרופורציות ועיצוב

- **שדות קטנים למידע קטן**: גיל (100px), מין (120px), אות (100px)
- **שדות בינוניים**: טלפון, תפקיד, קשר
- **שדות רחבים**: כתובת, שם מוסד, הערות
- **מרווחים אחידים**: 16px בין אלמנטים, 24px בין קטעים

### הפרדה ויזואלית

```css
/* קלף דינמי עם מספור */
.dynamic-card {
  background: slate-50;
  border: 2px solid;
  padding: 20px;
  margin: 16px 0;
}

/* מספור */
#1, #2, #3... למעלה בפינה ימנית
```

---

## 📁 מבנה הפרויקט

```
SMT_app/
├── app/
│   ├── (dashboard)/           # קבוצת דפים עם sidebar
│   │   ├── layout.tsx        # Layout עם Sidebar
│   │   └── dashboard/
│   │       ├── page.tsx      # דף בית - חיפוש וסינון
│   │       ├── children/     # ניהול ילדים
│   │       ├── institutions/ # ניהול מוסדות
│   │       ├── authorities/  # ניהול גופים
│   │       ├── drivers/      # ניהול נהגים
│   │       └── escorts/      # ניהול מלווים
│   ├── layout.tsx            # Root layout (RTL)
│   ├── page.tsx              # דף כניסה מעוצב
│   └── globals.css           # סגנונות גלובליים
├── components/
│   ├── ui/                   # ShadCN components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx       # ✨ מותאם RTL
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   └── phone-input.tsx  # 📱 Input עם פורמט טלפון
│   ├── sidebar.tsx           # תפריט צד
│   └── dynamic-section.tsx   # קומפוננטה דינמית
├── lib/
│   ├── utils.ts              # פונקציות עזר
│   ├── format-phone.ts       # 📱 פורמט טלפון
│   └── supabase/
│       ├── client.ts         # Supabase client
│       ├── server.ts         # Supabase server
│       └── middleware.ts     # Session management
├── supabase/
│   └── migrations/           # 🗄️ Database migrations
│       ├── 001_create_children_table.sql
│       ├── 002_create_institutions_table.sql
│       ├── 003_create_authorities_table.sql
│       ├── 004_create_drivers_table.sql
│       └── 005_create_escorts_table.sql
├── middleware.ts
├── components.json
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ מבנה מסד הנתונים

### טבלאות ראשיות

#### 1. **children** (ילדים)
```sql
- id (UUID)
- first_name (TEXT) - שם פרטי *
- last_name (TEXT) - שם משפחה *
- gender (TEXT) - מין (זכר/נקבה) *
- age (INTEGER) - גיל *
- phone (TEXT) - טלפון
- home_address (TEXT) - כתובת מגורים *
- notes (TEXT) - הערות
- parents (JSONB) - מערך הורים
- created_at, updated_at
```

**מבנה הורה (parents)**:
```json
{
  "first_name": "string",
  "last_name": "string",
  "relation": "אמא|אבא|אחר",
  "relation_other": "string?",
  "phone": "string"
}
```

#### 2. **institutions** (מוסדות)
```sql
- id (UUID)
- name (TEXT) - שם המוסד *
- type (TEXT) - סוג (בית ספר/גן/אחר) *
- type_other (TEXT) - תיאור אחר
- letter_code (TEXT) - אות (כחל)
- address (TEXT) - כתובת *
- institution_subtype (TEXT) - סוג מוסד *
- subtype_other (TEXT)
- waze_link (TEXT) - קישור ווייז
- image_url (TEXT) - תמונת מקום איסוף
- contacts (JSONB) - אנשי קשר
- created_at, updated_at
```

**מבנה איש קשר (contacts)**:
```json
{
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "role": "מורה|גננת|אחר",
  "role_other": "string?"
}
```

#### 3. **authorities** (גופים)
```sql
- id (UUID)
- name (TEXT) - שם הגוף *
- main_phone (TEXT) - טלפון ראשי *
- email (TEXT) - אימייל *
- supervisors (JSONB) - מפקחים
- created_at, updated_at
```

**מבנה מפקח (supervisors)**:
```json
{
  "first_name": "string",
  "last_name": "string",
  "area": "string",
  "email": "string"
}
```

#### 4. **drivers** (נהגים)
```sql
- id (UUID)
- first_name (TEXT) - שם פרטי *
- last_name (TEXT) - שם משפחה *
- car_number (TEXT) - מספר רכב *
- car_type (TEXT) - סוג רכב *
- phone (TEXT) - טלפון *
- notes (TEXT) - הערות
- created_at, updated_at
```

#### 5. **escorts** (מלווים)
```sql
- id (UUID)
- first_name (TEXT) - שם פרטי *
- last_name (TEXT) - שם משפחה *
- phone (TEXT) - טלפון *
- notes (TEXT) - הערות
- created_at, updated_at
```

### אבטחה (RLS)
כל הטבלאות כוללות:
- **SELECT**: גישה לכולם
- **INSERT/UPDATE/DELETE**: רק למשתמשים מחוברים

### Triggers
- **updated_at**: מתעדכן אוטומטית בכל שינוי

---

## 🚀 התקנה והרצה

### דרישות מקדימות
- Node.js 18+
- npm או yarn
- חשבון Supabase

### התקנה

1. **Clone הפרויקט**
```bash
git clone git@github.com:barmenahem17/SMT_app.git
cd SMT_app
```

2. **התקנת תלויות**
```bash
npm install
```

3. **הגדרת משתני סביבה**

צור קובץ `.env.local`:
```bash
cp env.example .env.local
```

הדבק את הערכים מ-Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **הרצת המיגרציות** (אם צריך)

היכנס ל-Supabase Dashboard ורוץ את המיגרציות מתיקיית `supabase/migrations/`

5. **הפעלת שרת פיתוח**
```bash
npm run dev
```

האפליקציה תרוץ ב-[http://localhost:3000](http://localhost:3000)

---

## 🎯 דפים ותכונות

### 1. דף כניסה (`/`)
- עיצוב מודרני ומרשים
- אנימציות חלקות
- 3 קלפי תכונות
- כפתור "כניסה למערכת"

### 2. דף בית הדשבורד (`/dashboard`)
**מערכת חיפוש וסינון מתקדמת**

#### חיפוש
- חיפוש בכל מסד הנתונים
- חיפוש לפי שם (רק מתחילת המילה)
- תוצאות בטבלה מעוצבת

#### סינון לפי קטגוריות
- ילדים
- הורים
- מלווים
- נהגים
- מפקחים
- עובדי הוראה
- מוסדות

#### תצוגת תוצאות
טבלה עם:
- סוג הרשומה (תג צבעוני)
- שם
- פרטים
- מידע נוסף

### 3. ניהול ילדים (`/dashboard/children`)
- הוספה, עריכה, מחיקה
- שדות: שם, מין, גיל, טלפון, כתובת, הערות
- **הוספת הורים דינמית** (רק אחרי לחיצה)
- פורמט טלפון אוטומטי
- הפרדה ויזואלית בין הורים

### 4. ניהול מוסדות (`/dashboard/institutions`)
- הוספה, עריכה, מחיקה
- שדות: שם, סוג, אות, כתובת, סוג מוסד, קישור ווייז, תמונה
- **הוספת אנשי קשר דינמית** (רק אחרי לחיצה)
- תפקיד לכל איש קשר (מורה/גננת/אחר)

### 5. ניהול גופים (`/dashboard/authorities`)
- הוספה, עריכה, מחיקה
- שדות: שם, טלפון, אימייל
- **הוספת מפקחים דינמית** (רק אחרי לחיצה)
- שדות מפקח: שם, איזור, אימייל

### 6. ניהול נהגים (`/dashboard/drivers`)
- הוספה, עריכה, מחיקה
- שדות: שם, מספר רכב, סוג רכב, טלפון, הערות

### 7. ניהול מלווים (`/dashboard/escorts`)
- הוספה, עריכה, מחיקה
- שדות: שם, טלפון, הערות

---

## 🛠️ קומפוננטות מיוחדות

### PhoneInput
קומפוננטת input עם פורמט טלפון אוטומטי:
```typescript
<PhoneInput
  value={phone}
  onChange={(value) => setPhone(value)}
  placeholder="050-123-4567"
/>
```

פורמט: `050-123-4567`

### DynamicSection
קומפוננטה להוספת רשומות דינמית:
```typescript
<DynamicSection
  title="הורים"
  addButtonText="הוסף הורה"
  onAdd={handleAdd}
  onRemove={handleRemove}
  items={items}
  renderItem={(item, index) => <YourContent />}
/>
```

תכונות:
- הפרדה ויזואלית בין פריטים
- מספור אוטומטי
- כפתור הסרה לכל פריט

### Sidebar
תפריט צד דינמי:
- פתיחה/סגירה עם אנימציה
- שינוי טקסט: "מסיעי סמי ומשה" ← "SMT"
- קישור לדף הבית בלחיצה על הכותרת
- תפריט מסד הנתונים עם תת-תפריט

---

## 📱 פורמט טלפון

### שימוש
```typescript
import { formatPhoneNumber, unformatPhoneNumber } from '@/lib/format-phone'

// פורמט לתצוגה
const formatted = formatPhoneNumber("0501234567")
// → "050-123-4567"

// הסרת פורמט לשמירה
const plain = unformatPhoneNumber("050-123-4567")
// → "0501234567"
```

### אוטומציה
- הוספת מקפים בזמן הקלדה
- מקסימום 12 תווים (כולל מקפים)
- פורמט: XXX-XXX-XXXX

---

## 🔐 אבטחה

### משתני סביבה
**אל תשתף את הקבצים הבאים:**
- `.env.local` - מכיל מפתחות API
- כל קובץ עם סיסמאות/טוקנים

### .gitignore
הקבצים הבאים לא נשמרים ל-Git:
```
.env.local
.env*.local
node_modules/
.next/
```

### Row Level Security (RLS)
- **SELECT**: פתוח לכולם (בינתיים)
- **INSERT/UPDATE/DELETE**: רק למשתמשים מחוברים

---

## 🔄 Git & GitHub

### מצב נוכחי
הפרויקט מחובר ל-GitHub:
```
Repository: github.com/barmenahem17/SMT_app
Branch: main
Remote: SSH (git@github.com)
```

### שמירת שינויים
**חשוב**: הפרויקט **לא שומר אוטומטית**!

```bash
# בדוק סטטוס
git status

# הוסף קבצים
git add .

# צור commit
git commit -m "תיאור השינויים"

# דחוף ל-GitHub
git push
```

### כללי Commit
- commit הגיוני אחרי כל תכונה
- הודעות ברורות בעברית
- בדוק שהכל עובד לפני push

---

## 🎓 מדריך מהיר

### הוספת ילד חדש
1. לך ל-`/dashboard/children`
2. לחץ "הוסף ילד"
3. מלא פרטים (שדות עם * חובה)
4. לחץ "הוסף הורה" אם צריך
5. שמור

### חיפוש ילד
1. לך לדף הבית `/dashboard`
2. הקלד שם בשדה החיפוש
3. או לחץ על "ילדים" לסינון
4. ראה תוצאות בטבלה

### הוספת מוסד
1. לך ל-`/dashboard/institutions`
2. לחץ "הוסף מוסד"
3. מלא פרטים
4. הוסף אנשי קשר אם צריך
5. שמור

---

## 🎨 התאמה אישית

### צבעים
ערוך `tailwind.config.ts`:
```typescript
colors: {
  primary: "...",
  secondary: "..."
}
```

### פונטים
ערוך `app/layout.tsx`:
```typescript
import { Heebo } from 'next/font/google'
const heebo = Heebo({ subsets: ['hebrew'] })
```

### קומפוננטות ShadCN
הוסף קומפוננטות:
```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🐛 פתרון בעיות

### הסרוור לא עולה
```bash
# נקה node_modules
rm -rf node_modules
npm install

# נקה .next
rm -rf .next
npm run dev
```

### בעיות עם Supabase
1. בדוק שהמפתחות ב-`.env.local` נכונים
2. בדוק ש-RLS מוגדר נכון
3. בדוק שהמיגרציות רצו

### בעיות RTL
1. וודא ש-`dir="rtl"` ב-`app/layout.tsx`
2. וודא ש-`text-right` בקומפוננטות
3. בדוק את ה-`flex-row-reverse` בתפריטים

---

## 📚 משאבים נוספים

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [ShadCN/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📝 רישיונות

פרויקט פרטי - **מסיעי סמי ומשה**  
כל הזכויות שמורות © 2025

---

## ✅ מה הושלם עד כה

### Phase 1 - תשתית ועיצוב ✅
- [x] הקמת פרויקט Next.js + TypeScript
- [x] התקנת Tailwind CSS + ShadCN/ui
- [x] תמיכה מלאה ב-RTL
- [x] חיבור GitHub
- [x] חיבור Supabase
- [x] דף כניסה מעוצב

### Phase 2 - מסד נתונים ✅
- [x] טבלת ילדים + הורים
- [x] טבלת מוסדות + אנשי קשר
- [x] טבלת גופים + מפקחים
- [x] טבלת נהגים
- [x] טבלת מלווים
- [x] RLS policies
- [x] Triggers לעדכון אוטומטי

### Phase 3 - UI/UX ✅
- [x] Sidebar דינמי
- [x] דף בית עם חיפוש וסינון
- [x] דפי ניהול לכל ישות
- [x] פורמט טלפון אוטומטי
- [x] קומפוננטות דינמיות
- [x] תיקוני RTL מלאים
- [x] הפרדה ויזואלית משופרת

### Phase 4 - הבא בתור 📋
- [ ] קישורים בין ישויות (ילד-מוסד, ילד-נהג וכו')
- [ ] מערכת הסעות
- [ ] לוח שנה ותזמון
- [ ] דוחות וניתוחים
- [ ] ייצוא נתונים
- [ ] מעקב בזמן אמת

---

**מוכן לפיתוח!** 🚀

לשאלות: צור קשר עם מנהל הפרויקט
