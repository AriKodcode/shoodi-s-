from .schema import DBResponse, ClientRequest
import logging 

class Orchestrator():
    def __init__(self, db_uri:str):
        self.logger = logging.getLogger(__name__)
        self.db_uri = db_uri 
    
    def process_response(self, recipe:MealsDB, request: ClientRequest):
        result = []
        meals = recipe.model_dump()
        client_choice = request.model_dump()
        for meal in meals:
            result.append(self.calculate_meal_score_percent(meal, client_choice))
        return result 
    
    def calculate_meal_score_percent(self, meal: dict, client: dict):
        
        part_weights = {'main': 0.5, 'side': 0.3, 'salad': 0.2}
        
        total_meal_percent = 0
        dishes_ids = {}
        
        # מילון לצבירת ציונים של קטגוריות לארוחה כולה (עבור התגיות)
        category_totals = {} 

        for part, info in meal.items():
            if part not in part_weights:
                continue
                
            dishes_ids[part] = info.get('id') # שימוש ב-.get למניעת קריסה
            
            raw_score = 0
            max_possible = 0
            min_possible = 0
            
            for category, score in info.items():
                # צבירת ציונים עבור תגיות (ללא קשר לבחירת הלקוח)
                if isinstance(score, (int, float)):
                    category_totals[category] = category_totals.get(category, 0) + (score * part_weights[part])

                if category in client:
                    choice = client[category]
                    weight = -1 if choice == 0 else choice
                    
                    raw_score += score * weight
                    max_possible += score * 1
                    min_possible += score * -1
            
            if max_possible != min_possible:
                part_percent = ((raw_score - min_possible) / (max_possible - min_possible)) * 100
                total_meal_percent += part_percent * part_weights[part]

        # לוגיקת יצירת תגיות (Tags)
        tags = []
        if category_totals.get('health_score', 0) > 0.8:
            tags.append("Healthy")
        if category_totals.get('complexity_score', 0) > 0.7:
            tags.append("High complexity")
        if category_totals.get('light_score', 0) > 0.7:
            tags.append("Light Meal")
        if category_totals.get('popularity_score', 0) > 0.8:
            tags.append("popularity Meal")
            
        return {
            'recipe_ids': dishes_ids,
            'match': round(total_meal_percent, 2),
            'tags': tags 
        }
