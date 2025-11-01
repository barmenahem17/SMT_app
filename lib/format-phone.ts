// פונקציה לעיצוב מספר טלפון עם מקפים
export function formatPhoneNumber(value: string): string {
  // הסר כל מה שאינו ספרה
  const numbers = value.replace(/\D/g, "")
  
  // אם אין ספרות, החזר ריק
  if (!numbers) return ""
  
  // פורמט: XXX-XXX-XXXX (050-371-1137)
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }
}

// פונקציה להסיר פורמט (לשמירה במסד הנתונים)
export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, "")
}

