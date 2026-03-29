from app.dal.dal import MealsDAL
import random


class MealsService:

    @staticmethod
    def _format_row(row):
        if not row:
            return None

        return {
            "id": row[0][0] if isinstance(row[0], (list, tuple)) else row[0],
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
    def get_full_meals(request):
        mains = MealsDAL.fetch_top_by_category(request, "main")
        sides = MealsDAL.fetch_top_by_category(request, "side")
        salads = MealsDAL.fetch_top_by_category(request, "salad")

        # רק ערבוב – בלי לחתוך
        random.shuffle(mains)
        random.shuffle(sides)
        random.shuffle(salads)

        meals = []

        max_len = max(len(mains), len(sides), len(salads))

        for i in range(max_len):
            main = MealsService._format_row(mains[i]) if i < len(mains) else None
            side = MealsService._format_row(sides[i]) if i < len(sides) else None
            salad = MealsService._format_row(salads[i]) if i < len(salads) else None

            combined = MealsService._combine_meal(main, side, salad)

            meals.append({
                "meal": combined,
                "items": {
                    "main": main["id"] if main else None,
                    "side": side["id"] if side else None,
                    "salad": salad["id"] if salad else None,
                }
            })

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
        parts = [(main, 0.5), (side, 0.3), (salad, 0.2)]
        parts = [(p, w) for p, w in parts if p]

        if not parts:
            return None

        def weighted_avg(key):
            return round(
                sum(p["match"]["breakdown"][key] * w for p, w in parts) /
                sum(w for _, w in parts)
            )

        time = weighted_avg("time")
        health = weighted_avg("health")
        complexity = weighted_avg("complexity")

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