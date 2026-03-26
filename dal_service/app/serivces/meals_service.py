from app.dal.dal import MealsDAL
import random


class MealsService:

    @staticmethod
    def _format_row(row):
        if not row:
            return None
        
        score = round(row[5] * 10, 1) 
        return {
            "id": row[0],
            "light_score": row[1],
            "health_score": row[2],
            "complex_score": row[3],
            "popularity_score": row[4],
            "score": score
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