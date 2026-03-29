# Cache Service Workflow & Integration Guide

מסמך זה מגדיר את מבנה העבודה ושירות ה-Cache (מבוסס Redis) בפרויקט.

## 🏗️ מבנה המערכת (Architecture)

התהליך מבוסס על תבנית **Cache-Aside**:
1. ה-Backend בודק אם המידע קיים ב-Cache.
2. אם קיים (**Hit**) - מחזיר ללקוח.
3. אם לא קיים (**Miss**) - מושך מהמקור (DB/Service), ושולח ל-Cache לשמירה לעתיד.



# 🚀 Recipe Selection Cache Service

שירות מטמון (Cache) בעל ביצועים גבוהים המבוסס על **FastAPI** ו-**Redis Cloud**. השירות תוכנן במטרה לצמצם זמני המתנה ארוכים ולשפר את חווית המשתמש על ידי אחסון תוצאות חישובים מורכבים בזיכרון.

## 📊 הישגי ביצועים (Benchmarks)
* **ללא Cache:** ~25 שניות (גישה ל-DB + עיבוד נתונים כבד).
* **עם Cache:** **~1 שניה** (שליפה ישירה מ-Redis).
* **שיפור:** האצה של פי 25 במהירות התגובה של המערכת.

---

## 🏗️ ארכיטקטורה (Architecture)

השירות פועל כ-Microservice עצמאי במערך ה-Docker של הפרויקט:

* **FastAPI**: מנהל את נקודות הקצה (Endpoints) וולידציית הנתונים.
* **Orchestrator**: ליבת השירות. מנהל את החיבור ל-Redis ומבצע נרמול (Normalization) של בקשות הלקוח ליצירת מפתחות ייחודיים.
* **Redis Cloud**: מסד נתונים In-memory לאחסון מהיר בפורמט Key-Value.

---

## 🛠️ זרימת עבודה (Workflow)

1.  **נרמול (Normalization)**: השירות מקבל `ClientRequest` והופך אותו למפתח (Key) סטנדרטי המבוסס על סוג האוכל והמשקולות.
    * פורמט המפתח: `search:v1:params:{type}:{lightness}:{health}:{complexity}`.
### 🔑 Key Convention
כדי לשמור על ייחודיות וביצועים, המפתחות ב-Redis ייבנו לפי הפורמט הבא:
`search:v1:params:{type}:{field2}:{field3}:{field4}`

**דוגמה:**
עבור בחירות הלקוח `0, 5, 1`, המפתח יהיה: `search:v1:meat:0:5:1`.

* **Separator:** שימוש ב-`:` מאפשר הפרדה ברורה בין שדות (במיוחד אם ערך יהיה בעתיד > 9).
* **Versioning:** הוספת `v1` בתחילת המפתח מאפשרת לנו "לנקות" את ה-Cache בקלות אם נשנה את מבנה הנתונים בעתיד (פשוט משנים ל-`v2`).

2.  **בדיקה (`POST /cache_get`)**: ה-Backend בודק אם קיים מידע ב-Cache עבור המפתח שנוצר.
3.  **ניהול Miss**: אם המידע לא קיים (404), ה-Backend מבצע את השאילתה מול ה-DB/Service המנתח.
4.  **עדכון (`POST /cache_set`)**: ה-Backend שולח את התוצאות החדשות לשמירה ב-Redis יחד עם פרמטרי החיפוש המקוריים לשימוש עתידי.

---

## 📡 נקודות קצה (API Endpoints)

### 1. שליפת נתונים מהמטמון
* **Method**: `POST`
* **Route**: `/cache_get`
* **Payload**: אובייקט `ClientRequest` (כולל `type` ו-`weights`).
* **Responses**:
    * `200 OK`: מחזיר את הנתונים (JSON).
    * `404 Not Found`: המידע לא קיים ב-Cache.

### 2. שמירת נתונים במטמון
* **Method**: `POST`
* **Route**: `/cache_set`
* **Body**: מקבל שני אובייקטים בתוך ה-JSON (שימוש ב-FastAPI `Body`):
    * `meals`: המידע לשמירה (רשימת מתכונים).
    * `data`: אובייקט ה-`ClientRequest` המקורי ליצירת המפתח.

---

## ⚙️ הגדרות (Configuration)

הגדרות השירות מנוהלות דרך קובץ `.env` ונטענות במחלקה `Configuration`:

* **`REDIS_HOST`**: כתובת ה-URI לחיבור ל-Redis (למשל: `redis://localhost:6379/0`).
* **`TTL_CACHE`**: זמן תפוגה לנתונים בשניות (ברירת מחדל: 600 , שניות).
* **`decode_responses`**: מוגדר כ-`True` כדי להבטיח עבודה עם מחרוזות טקסט ולא בייטים.

---

## 🐳 הרצה ב-Docker

השירות מוגדר ב-`compose.yaml` תחת `cache-service`:

```yaml
cache-service:
  build: ./cache-service
  container_name: cache
  ports:
    - "8002:8002"
  env_file:
    - .env




    