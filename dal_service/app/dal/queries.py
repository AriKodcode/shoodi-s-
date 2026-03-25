def map_preference(value):
    if value == 1:
        return 1, 1
    elif value == 0.5:
        return 0.5, 0.5 
    elif value == 0:
        return 0.7, 0 


def build_query(request, category):
    weights = request.weights

    w_time, t_time = map_preference(weights.lightness)

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
            -- זמן (פחות זמן = יותר טוב)
            (1 - ABS((1 - m.prep_time_minutes / 120.0) - {t_time})) * {w_time}

            +

            -- בריאות (פחות קלוריות = יותר טוב)
            (1 - ABS((1 - m.calories / 1000.0) - {t_health})) * {w_health}

            +

            -- מורכבות (easy=1, hard=0 בלי CASE)
            (1 - ABS(
                (1 - ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0))
                - {t_complex}
            )) * {w_complex}

        ) / ({w_time} + {w_health} + {w_complex})

        +

        m.popularity_score * 0.1

        AS score

    FROM meals m

    WHERE m.category = '{category}'

    AND NOT EXISTS (
        SELECT 1
        FROM meal_ingredients mi
        JOIN ingredients i ON i.id = mi.ingredient_id
        WHERE mi.meal_id = m.id
        AND (
            i.name LIKE '%שרימפס%'
            OR i.name LIKE '%בייקון%'
            OR i.name LIKE '%צלפות%'
        )
    )
    """

    if category not in ["salad", "side"] and request.type:
        query += f" AND m.type = '{request.type}'"

    if request.include:
        for ing in request.include:
            query += f"""
            AND EXISTS (
                SELECT 1
                FROM meal_ingredients mi
                JOIN ingredients i ON i.id = mi.ingredient_id
                WHERE mi.meal_id = m.id AND i.name = '{ing}'
            )
            """

    if request.exclude:
        for ing in request.exclude:
            query += f"""
            AND NOT EXISTS (
                SELECT 1
                FROM meal_ingredients mi
                JOIN ingredients i ON i.id = mi.ingredient_id
                WHERE mi.meal_id = m.id AND i.name = '{ing}'
            )
            """

    query += """
    ORDER BY score + RAND() * 0.1 DESC
    LIMIT 10
    """

    return query