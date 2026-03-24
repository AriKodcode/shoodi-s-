def map_preference(value):
    if value == 1:
        return 1, 1
    elif value == 0.5:
        return 0.4, 0.5
    elif value == 0:
        return 1, 0


def build_query(request, category):
    weights = request.weights

    w_light, t_light = map_preference(weights.lightness)
    w_health, t_health = map_preference(weights.health)
    w_complex, t_complex = map_preference(weights.complexity)

    query = f"""
        SELECT 
            m.id,
            m.light_score,
            m.health_score,
            m.complex_score,
            m.popularity_score,
            (
                (1 - POW(m.light_score - {t_light}, 2)) * {w_light} +
                (1 - POW(m.health_score - {t_health}, 2)) * {w_health} +
                (1 - POW(m.complex_score - {t_complex}, 2)) * {w_complex} +
                m.popularity_score * 0.2
            ) AS Score
        FROM meals m
        WHERE m.category = '{category}'
        """
    if category not in ["salad", "side"] and request.type:
        query += f" AND m.type = '{request.type}'"

    if request.include:
        for ing in request.include:
            query += f"""
            AND EXISTS (
                SELECT 1 FROM meal_ingredients mi
                JOIN ingredients i ON i.id = mi.ingredient_id
                WHERE mi.meal_id = m.id AND i.name = '{ing}'
            )
            """
    if request.exclude:
        for ing in request.exclude:
            query += f"""
            AND NOT EXISTS (
                SELECT 1 FROM meal_ingredients mi
                JOIN ingredients i ON i.id = mi.ingredient_id
                WHERE mi.meal_id = m.id AND i.name = '{ing}'
            )
            """
    query += """
    ORDER BY score DESC
    LIMIT 3
    """
    return query