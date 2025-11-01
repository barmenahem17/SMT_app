# 🚀 הוראות התקנה וחיבור - SMT App

## 📋 מה עשינו עד כה?

✅ יצרנו פרויקט Next.js 14 עם TypeScript  
✅ הגדרנו תמיכה מלאה ב-RTL (עברית)  
✅ התקנו את ShadCN/ui לקומפוננטות מעוצבות  
✅ הגדרנו את Supabase למסד נתונים  
✅ אתחלנו Git repository  
✅ יצרנו דף בית מעוצב ומקצועי  

## 🔗 שלב 1: חיבור GitHub

הפרויקט כבר מאותחל עם Git. כעת צריך לחבר אותו ל-GitHub:

### א. ודא שה-remote מוגדר נכון

```bash
git remote -v
```

אם לא רואה את הכתובת הנכונה, הוסף:

```bash
git remote add origin https://github.com/barmenahem17/SMT_app.git
```

### ב. בצע את ה-commit הראשון

**רק כשאתה מוכן לשמור:**

```bash
# בדוק מה השתנה
git status

# הוסף את כל הקבצים
git add .

# צור commit
git commit -m "Initial commit: תשתית בסיסית עם Next.js, Supabase, RTL"

# בדוק שהכל תקין
git log --oneline
```

### ג. דחוף ל-GitHub

```bash
# דחיפה ראשונה (עם -u לקישור הענף)
git push -u origin main

# אם מקבל שגיאה שהענף צריך להיות master:
git branch -M main
git push -u origin main
```

## 🗄️ שלב 2: חיבור Supabase

### א. קבל את פרטי החיבור

1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. בחר בפרויקט **SMT_app** (או צור אחד חדש)
3. לחץ על **Settings** (הגדרות) בתפריט הצד
4. לחץ על **API**
5. העתק:
   - **Project URL** (תחת "Config")
   - **anon public key** (תחת "Project API keys")

### ב. צור קובץ .env.local

בתיקיית השורש של הפרויקט:

```bash
# צור קובץ חדש
touch .env.local

# או העתק מהדוגמה
cp env.example .env.local
```

### ג. מלא את הפרטים

פתח את `.env.local` והדבק:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**החלף** את הערכים בפרטים האמיתיים מ-Supabase!

### ד. בדוק את החיבור

```bash
# הרץ את האפליקציה
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) - אם הכל עובד, תראה את דף הבית!

## 🧪 שלב 3: בדיקת התקנה

### בדוק שהפונטים עובדים
- פתח את האפליקציה
- בדוק שהטקסט בעברית נראה טוב (פונט Heebo)
- בדוק שהכיוון הוא מימין לשמאל

### בדוק את הקומפוננטות
- לחץ על הכפתורים - צריכים להגיב
- בדוק שהכרטיסים מעוצבים יפה
- בדוק responsive (הקטן את המסך)

## 📁 מבנה הפרויקט

```
SMT_app/
├── app/                      # Next.js pages
│   ├── layout.tsx           # Layout ראשי (RTL, פונט)
│   ├── page.tsx             # דף הבית
│   └── globals.css          # סגנונות
├── components/              
│   └── ui/                  # ShadCN components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── utils.ts            # פונקציות עזר
│   └── supabase/           # Supabase config
│       ├── client.ts       # לקומפוננטים
│       ├── server.ts       # לשרת
│       └── middleware.ts   # לניהול sessions
├── .env.local              # סודות (לא נשמר ב-Git!)
├── env.example             # דוגמה
└── README.md               # תיעוד
```

## 🎯 השלבים הבאים

עכשיו שהתשתית מוכנה, אפשר להתחיל לבנות:

1. **תכנון מסד הנתונים**
   - אילו טבלאות צריך?
   - מה הקשרים ביניהן?
   - אילו שדות בכל טבלה?

2. **בניית תכונות**
   - ניהול ילדים
   - ניהול נהגים
   - תכנון מסלולים
   - דוחות

3. **פיתוח ממשק משתמש**
   - טפסים
   - טבלאות
   - דשבורד
   - ניווט

## 💡 טיפים

### שמירת שינויים (Git)

```bash
# לפני שמתחיל לעבוד
git status
git pull  # אם עובד מכמה מקומות

# אחרי שמסיים תכונה
git add .
git commit -m "תיאור מה עשית"
git push
```

### שימוש ב-Supabase

```typescript
// בקומפוננט (client)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// בשרת (server component/API)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### הוספת קומפוננטות ShadCN

```bash
# רשימת כל הקומפוננטות
npx shadcn-ui@latest add

# הוספת קומפוננטה ספציפית
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
```

## ❓ שאלות נפוצות

### האפליקציה לא עולה?
```bash
# נקה ונסה שוב
rm -rf .next node_modules
npm install
npm run dev
```

### Supabase לא מתחבר?
- בדוק שהקובץ `.env.local` קיים
- בדוק שהערכים נכונים (ללא רווחים)
- בדוק שאין טעויות כתיב

### Git דוחה את ה-push?
```bash
# מרוב זמן צריך לעשות pull קודם
git pull origin main --rebase
git push
```

### רוצה לבטל שינויים?
```bash
# לפני commit
git checkout .

# אחרי commit (זהירות!)
git reset --soft HEAD~1
```

## 🎉 סיימנו!

התשתית מוכנה, הכל עובד, ואפשר להתחיל לבנות את הפיצ'רים!

**זכור**: 
- 💾 שמור שינויים רק כשאתה מוכן
- 🔒 אל תשתף את `.env.local`
- 📝 תעד שינויים חשובים
- ✅ בדוק שהכל עובד לפני commit

---

**מוכן להמשיך?** ספר לי מה הצעד הבא! 🚀

