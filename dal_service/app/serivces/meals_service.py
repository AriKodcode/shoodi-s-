from app.dal.dal import MealsDAL
import random


class MealsService:

    @staticmethod
    def _format_row(row):
        if not row:
            return None

        return {
            "id": [0],

            "scores": {
                "light": row[1],
                "health": row[2],
                "complex": row[3],
                "popularity": row[4],
            },

            "match": {
                "percent": row[12],
                "breakdown": {
                    "time": row[8],
                    "health": row[9],
                    "complexity": row[10],
                }
            },

            "final_score": round(row[14], 3)
        }

    @staticmethod
    def _pick_random(rows, k=3):
        if not rows:
            return []
        if len(rows) <= k:
            return rows
        return random.sample(rows, k)

    @staticmethod
    def get_full_meals(request):
        mains = MealsDAL.fetch_top_by_category(request, "main")
        sides = MealsDAL.fetch_top_by_category(request, "side")
        salads = MealsDAL.fetch_top_by_category(request, "salad")

    
        mains = MealsService._pick_random(mains, 3)
        sides = MealsService._pick_random(sides, 3)
        salads = MealsService._pick_random(salads, 3)

        meals = []

        for i in range(3):
            meal = {
                "main": MealsService._format_row(mains[i]) if i < len(mains) else None,
                "side": MealsService._format_row(sides[i]) if i < len(sides) else None,
                "salad": MealsService._format_row(salads[i]) if i < len(salads) else None,
            }
            meals.append(meal)

        return meals
    

    @staticmethod
    def _label_match(p):
        if p >= 90:
            return "התאמה גבוהה מאוד"
        elif p >= 75:
            return "התאמה טובה"
        elif p >= 60:
            return "התאמה סבירה"
        return "התאמה נמוכה"
    
    @staticmethod
    def _combine_meal(main, side, salad):
        parts = [p for p in [main, side, salad] if p]

        if not parts:
            return None

        def avg(key):
            return round(sum(p["match"]["breakdown"][key] for p in parts) / len(parts))

        time = avg("time")
        health = avg("health")
        complexity = avg("complexity")

        total = round((time + health + complexity) / 3)

        return {
            "match": {
                "percent": total,
                "breakdown": {
                    "time": time,
                    "health": health,
                    "complexity": complexity
                }
            }
        }