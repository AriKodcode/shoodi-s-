from app.dal.dal import MealsDAL


class MealsService:

    @staticmethod
    def _format_row(row):
        if not row:
            return None
        
        score = round(row[5] + 1 * 10, 1)
        return {
            "id": row[0],
            "light_score": row[1],
            "health_score": row[2],
            "complex_score": row[3],
            "popularity_score": row[4],
            "score": score
        }

    @staticmethod
    def get_full_meal(request):
        main = MealsDAL.fetch_top_by_category(request, "main")
        side = MealsDAL.fetch_top_by_category(request, "side")
        salad = MealsDAL.fetch_top_by_category(request, "salad")

        return {
            "main": MealsService._format_row(main) if main else None,
            "side": MealsService._format_row(side) if side else None,
            "salad": MealsService._format_row(salad) if salad else None
        }