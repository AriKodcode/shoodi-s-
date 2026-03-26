# Cache Service Workflow & Integration Guide

מסמך זה מגדיר את מבנה העבודה ושירות ה-Cache (מבוסס Redis) בפרויקט.

## 🏗️ מבנה המערכת (Architecture)

התהליך מבוסס על תבנית **Cache-Aside**:
1. ה-Backend בודק אם המידע קיים ב-Cache.
2. אם קיים (**Hit**) - מחזיר ללקוח.
3. אם לא קיים (**Miss**) - מושך מהמקור (DB/Service), ושולח ל-Cache לשמירה לעתיד.

---

## 🛠️ חלוקת תחומי אחריות

### 🔹 Data Engineer (Infrastructure & Cache Service)
**האחריות:** הקמת התשתית וניהול זרימת הנתונים ב-Redis.
1. **Redis Setup:** הקמת שירות Redis (Docker/Kubernetes).
2. **Cache Service API:** בניית שירות ב-FastAPI/Flask שחשוף ל-Backend ומבצע את הפעולות מול Redis.
3. **Serialization:** הגדרת האופן שבו הנתונים נשמרים (למשל המרת JSON ל-String או שימוש ב-MessagePack ליעילות).
4. **TTL Policy:** הגדרת זמני תפוגה לנתונים כדי למנוע זיכרון מנופח.

### 🔸 Backend Engineer (Integration & Logic)
**האחריות:** מימוש הלוגיקה באפליקציה המרכזית.
1. **Cache Client:** יצירת פונקציית עזר (Utility) שקוראת ל-Cache Service.
2. **Workflow Logic:**
   - קריאה ל-`GET /cache/{key}` לפני כל שאילתא כבדה.
   - אם התשובה היא `null`, ביצוע הלוגיקה הרגילה וקריאה ל-`POST /cache/set`.
3. **Error Handling:** הבטחה שאם שירות ה-Cache למטה, האפליקציה ממשיכה לעבוד מול ה-DB כרגיל (Graceful Degradation).

---

## 📡 API Endpoints (Cache Service)

שירות ה-Cache יחשוף את נקודות הקצה הבאות עבור ה-Backend:

### 1. בדיקת נתונים ב-Cache
* **Method:** `GET`
* **Endpoint:** `/cache/{key}`
* **Response (Hit):** `200 OK` עם ה-Data ב-Body.
* **Response (Miss):** `404 Not Found` (מסמן ל-Backend למשוך מה-DB).

### 2. שמירת נתונים ב-Cache
* **Method:** `POST`
* **Endpoint:** `/cache/set`
* **Payload:**
    ```json
    {
      "key": "unique_identifier",
      "value": { ... data ... },
      "ttl_seconds": 3600
    }
    ```
* **Response:** `201 Created`.

---

## 🔄 Workflow Diagram (Step-by-Step)

1. **Client Request:** הלקוח מבקש מידע (למשל פרופיל משתמש).
2. **Backend Check:** ה-Backend פונה ל-`GET /cache/user_123`.
3. **Branching:**
   - **IF 200 OK:** ה-Backend מחזיר את הנתון מה-Cache ללקוח.
   - **IF 404 NOT FOUND:**
     - ה-Backend מושך נתונים מ-MySQL/PostgreSQL.
     - ה-Backend שולח `POST /cache/set` עם המידע החדש.
     - ה-Backend מחזיר את הנתונים ללקוח.
### 🔑 Key Convention
כדי לשמור על ייחודיות וביצועים, המפתחות ב-Redis ייבנו לפי הפורמט הבא:
`search:v1:params:{type}:{field2}:{field3}:{field4}`

**דוגמה:**
עבור בחירות הלקוח `0, 5, 1`, המפתח יהיה: `search:v1:meat:0:5:1`.

* **Separator:** שימוש ב-`:` מאפשר הפרדה ברורה בין שדות (במיוחד אם ערך יהיה בעתיד > 9).
* **Versioning:** הוספת `v1` בתחילת המפתח מאפשרת לנו "לנקות" את ה-Cache בקלות אם נשנה את מבנה הנתונים בעתיד (פשוט משנים ל-`v2`).