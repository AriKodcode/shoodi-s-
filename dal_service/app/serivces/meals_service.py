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
    def _combine_meal(main, side, salad):
        parts = [(main, 0.5), (side, 0.3), (salad, 0.2)]
        parts = [(p, w) for p, w in parts if p]

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