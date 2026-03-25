
# Meal Candidate Service 🍽️

שירות API מבוסס **FastAPI** המיועד להפקת הצעות לארוחות מותאמות אישית. המערכת מחשבת ציון (Score) לכל מנה על בסיס העדפות משתמש (בריאות, קלילות, מורכבות ופופולריות) ושולפת את המנות המתאימות ביותר ממסד נתונים **MySQL**.

## 🚀 תכונות עיקריות
* **דירוג חכם:** אלגוריתם SQL לחישוב התאמה לפי משקלים (Weights).
* **סינון מתקדם:** אפשרות לכלול (Include) או להחריג (Exclude) רכיבים ספציפיים.
* **מבנה שכבות:** הפרדה ברורה בין ה-API (Routes), הלוגיקה העסקית (Services), והגישה לנתונים (DAL).
* **עמידות:** מנגנון חיבור למסד הנתונים עם ניסיונות חוזרים (Retries) במידת הכישלון.

---

## 🛠 טכנולוגיות
* **Python 3.x**
* **FastAPI** (Web Framework)
* **MySQL Connector** (Database Driver)
* **Pydantic** (Data Validation)
* **Uvicorn** (ASGI Server)

---

## 📂 מבנה הפרויקט
```text
app/
├── api/
│   └── routes.py          # הגדרת נקודות הקצה (Endpoints)
├── dal/
│   ├── dal.py             # שכבת הגישה לבסיס הנתונים (Data Access Layer)
│   └── queries.py         # בניית שאילתות SQL דינמיות
├── db/
│   └── connection.py      # ניהול החיבור ל-MySQL
├── models/
│   └── request_model.py   # מודלים של Pydantic לבדיקת קלט
├── services/
│   └── meals_service.py   # לוגיקה עסקית ופורמט נתונים
└── main.py                # נקודת הכניסה לאפליקציה
```
### ⚙️ הגדרות (Environment Variables)
לפני ההרצה, יש לוודא שמשתני הסביבה הבאים מוגדרים (או להשתמש בברירת המחדל של localhost בקובץ connection.py):

MYSQL_HOST

MYSQL_PORT

MYSQL_USER

MYSQL_PASSWORD

MYSQL_DB

🖥 הרצה
התקן את הדרישות (מומלץ בתוך Virtual Environment):

Bash
pip install fastapi uvicorn mysql-connector-python pydantic
הרץ את השרת:

Bash
python main.py
השרת יהיה זמין בכתובת: http://127.0.0.1:8000

📑 דוגמה לשימוש (API Endpoint)
POST /candidates
שליפת מועמדים לארוחה לפי העדפות.

Request Body:

JSON
{
  "type": "meat",
  "weights": {
    "lightness": 1.0,
    "health": 0.5,
    "complexity": 0
  },
  "include": ["garlic"],
  "exclude": ["onions"]
}
Response:
השירות יחזיר רשימה של 3 ארוחות, כאשר כל ארוחה מורכבת ממנה עיקרית (main), תוספת (side) וסלט (salad).

📝 הערות פיתוח
חישוב ציון: השאילתה ב-queries.py משתמשת בנוסחה ריבועית לבדיקת קרבה ליעד (Target) שנקבע לפי המשקלים.

טיפול בשגיאות: המערכת תנסה להתחבר למסד הנתונים עד 5 פעמים עם השהיה של 2 שניות בין ניסיון לניסיון.


האם תרצה שאוסיף סעיף ספציפי על מבנה טבלאות ה-SQL הנדרשות כדי שהפרויקט יעבוד?
## 🚀 API Endpoint

### `POST /candidates`

Analyze a client's meal preferences and return matching meal combinations.

---

## 📥 Request

### Body: `CandidateRequest`

```json
{
  "type": "meat",
  "weights": {
    "lightness": 1.0,
    "health": 0.5,
    "complexity": 0
  }
}
```

### Fields

| Field                | Type                          | Description               |
| -------------------- | ----------------------------- | ------------------------- |
| `type`               | Literal (`meat`, `dairy`, `vegan`) | Meal category             |
| `weights.lightness`  | float (0 < 1.0)           | Importance of light meals |
| `weights.health`     | float (0 < 1.0)           | Importance of healthiness |
| `weights.complexity` | float (0 < 1.0)           | Importance of complexity  |

---

## 📤 Response

### Success Response

```json
{
  "meals": [
    {
      "main": {
        "id": 3,
        "light_score": 0.1,
        "health_score": 0.35,
        "complex_score": 0.6,
        "popularity_score": 0.92,
        "score": 12.7
      },
      "side": {
        "id": 199,
        "light_score": 0.18,
        "health_score": 0.28,
        "complex_score": 0.22,
        "popularity_score": 0.88,
        "score": 13
      },
      "salad": {
        "id": 184,
        "light_score": 0.88,
        "health_score": 0.78,
        "complex_score": 0.38,
        "popularity_score": 0.8,
        "score": 11.6
      }
    }... 3 times
  ]
}
```

### Fields

| Field         | Type   | Description             |
| ------------- | ------ | ----------------------- |
| `meals`      | list   | Request result          |


#### Each item in `meals`:

| Field                 | Type         | Description                                       |
| --------------------- | ------------ | ------------------------------------------------- |
| `main`          | dict[string] | information about main dish
| `side`               | dict[string]       |information about side dish                               |
| `salad`         | dict[string] | information about salad dish |
#### Each fields in `main, side, salad`:
| Field                 | Type         | Description                                       |
| --------------------- | ------------ | ------------------------------------------------- |
| `id`  | int          | dish ID                                      |
| `light_score`  | float          |   light score                                    |
| `health_score` | float         |    health score
| `complex_score` | float         |   complex score
| `popularity_score` | float          |    popularity score
| `score` | float          | score
---