-- הוספת שדה עיר לטבלת מוסדות
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS city TEXT;

