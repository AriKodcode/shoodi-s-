# shoodi-s-/data-analyze
# 🍽️ Meal Recommendation Orchestrator API

This project is a **FastAPI-based orchestration service** that analyzes client meal preferences, communicates with a database service, and returns matched meal combinations with scoring and insights.

---
## 🛠 טכנולוגיות ליבה
* **FastAPI**: תשתית ה-Web עבור ה-API.
* **Pydantic V2**: אכיפת סכמות נתונים וולידציה קפדנית (כולל שימוש ב-Enums לערכים קבועים של 0, 0.5 ו-1.0).
* **Requests**: תקשורת סינכרונית מול שירות ה-DB.
* **Logging**: מעקב מפורט אחר הצלחות וכשלונות במערכת.

---

## 📂 מבנה הפרויקט

| קובץ | תפקיד |
| :--- | :--- |
| `main.py` | נקודת הכניסה. מגדיר את ה-Lifespan ואת הזרקת ה-`Orchestrator` ל-`app.state`. |
| `routes.py` | מכיל את ה-Endpoint המרכזי ומנהל את הלוגיקה מול ה-DB. |
| `orchestrator.py` | מחלקת הניהול שמבצעת את חישובי הציון (Score) וקביעת הסטטוסים. |
| `schema.py` | מגדיר את המודלים של הנתונים: `ClientRequest`, `DBResponse`, וטיפוסי ה-`Enum`. |
| `config.py` | מנהל את הגדרות השרתים דרך משתני סביבה (Environment Variables). |

---

## 📦 Project Overview

The system:

1. Receives client preferences (meal type + weights).
2. Sends them to a DB service.
3. Processes the returned recipes.
4. Calculates match scores and returns structured results.

---

## 🚀 API Endpoint

### `POST /analyze_client_choice`

Analyze a client's meal preferences and return matching meal combinations.

---

## 📥 Request

### Body: `ClientRequest`

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
| `type`               | enum (`meat`, `dairy`, `fur`) | Meal category             |
| `weights.lightness`  | float (0, 0.5, 1.0)           | Importance of light meals |
| `weights.health`     | float (0, 0.5, 1.0)           | Importance of healthiness |
| `weights.complexity` | float (0, 0.5, 1.0)           | Importance of complexity  |

---

## 📤 Response

### Success Response

```json
{
  "result": [
    {
      "recipe_ids": {
        "main_id": 1,
        "side_id": 2,
        "salad_id": 3
      },
      "match": 87,
      "tags": ["health", "light"]
    }
  ]
}
```

### Fields

| Field         | Type   | Description             |
| ------------- | ------ | ----------------------- |
| `result`      | list   | Request result          |


#### Each item in `result`:

| Field                 | Type         | Description                                       |
| --------------------- | ------------ | ------------------------------------------------- |
| `recipe_ids`          | dict[string] | ids of dishes in meal
| `match`               | float      | Match percentage                                  |
| `tags`         | list[string] | Tags like `health`, `light`, `protein`, `popular` |
#### Each fields in `recipe_ids`:
| Field                 | Type         | Description                                       |
| --------------------- | ------------ | ------------------------------------------------- |
| `main_id`  | int          | Main dish ID                                      |
| `side_id`  | int          | Side dish ID                                      |
| `salad_id` | int          | Salad ID   
---

## 🔄 Internal Flow

1. Client sends request → `/analyze_client_choice`
2. Service forwards request to DB (`manager.db_uri`)
3. DB returns list of recipes (`DBResponse`)
4. Orchestrator:

   * Calculates weighted scores
   * Extracts dish IDs
   * Determines tags
5. Returns structured response

---

## 🧠 Core Logic

### Weighted Score Calculation

Each meal consists of:

* `main`
* `side`
* `salad`

---

## 🧩 Data Models

### `ClientRequest`

```json
{
  "type": "meat",
  "weights": {
    "lightness": 1.0,
    "health": 0.5,
    "complexity": 0.0
  }
}
```

---

### `DBResponse`

```json
{
  "main": { ResponsePart },
  "side": { ResponsePart },
  "salad": { ResponsePart }
}
```

---

### `ResponsePart`

```json
{
  "id": 1,
  "score": 0.8,
  "light_score": 0.7,
  "health_score": 0.9,
  "complexity_score": 0.6,
  "popularity_score": 0.8
}
```

---

## ⚠️ Error Handling

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| `400`       | processing error |
| `522`       | Invalid/unexpected data from DB          |
| `521`       | Failed request to DB          |

---

## 🛠️ Setup Notes

* Requires a running DB service endpoint (`db_uri`)
* Uses `requests` to communicate with DB
* FastAPI dependency injection for orchestrator (`manager`)

---

## 📌 Future Improvements
* Add caching layer
* Add authentication

---

## 👨‍💻 Author Notes

This service acts as a **logic layer** between client preferences and raw recipe data, focusing on:

* Personalization
* Scoring
* Clean structured responses

---
## 🚀 הוראות הרצה
### 1. הגדרת סביבה
השירות משתמש במשתני סביבה:
* `DB_HOST`: כתובת שרת מסד הנתונים (דיפולט: `db`).
* `DB_PORT`: פורט שרת מסד הנתונים (דיפולט: `8001`).
* `CLIENT_HOST`: פורט שרת לקוח (דיפולט: `CLIENT`).
* `CLIENT_PORT`: פורט שרת ךקוח (דיפולט: `8001`).

### 2. התקנה והרצה
```bash
pip install fastapi uvicorn requests pydantic
uvicorn main:app --reload
