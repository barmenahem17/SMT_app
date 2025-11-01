-- הוספת שדה מוגבלות ועיר לטבלת ילדים
ALTER TABLE children ADD COLUMN IF NOT EXISTS disability TEXT;
ALTER TABLE children ADD COLUMN IF NOT EXISTS city TEXT;

-- שינוי שם העמודה הישנה (אופציונלי - אם רוצים לשמור נתונים קיימים)
-- אפשר להריץ סקריפט להעביר נתונים אם יש

