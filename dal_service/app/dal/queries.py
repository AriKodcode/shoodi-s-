def map_preference(value):
    if value == 1:
        return 1, 1
    elif value == 0.5:
        return 0.6, 0.5
    elif value == 0:
        return 0.3, 0


def build_query(request, category):
    weights = request.weights

    w_time, t_time = map_preference(weights.lightness)
    w_health, t_health = map_preference(weights.health)
    w_complex, t_complex = map_preference(weights.complexity)

    if category == "salad":
        w_complex *= 0.1  
        w_time *= 1.2     
        w_health *= 1.3   
    else:
        w_time *= 1.3
        w_health *= 1.0
        w_complex *= 0.7

    query = f"""
    SELECT 
        m.id,

        (1 - LEAST(m.prep_time_minutes, 90) / 90.0) AS light_score,
        (1 - LEAST(m.calories, 800) / 800.0) AS health_score,
        ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0) AS complex_score,

        m.popularity_score,

        (1 - POW(ABS((1 - LEAST(m.prep_time_minutes, 90) / 90.0) - {t_time}), 2)) AS time_fit,

        (1 - POW(ABS((1 - LEAST(m.calories, 800) / 800.0) - {t_health}), 2)) AS health_fit,

        (1 - POW(ABS(
            ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0)
            - {t_complex}
        ), 2)) AS complexity_fit,

        ROUND((1 - POW(ABS((1 - LEAST(m.prep_time_minutes, 90) / 90.0) - {t_time}), 2)) * 100) AS time_percent,

        ROUND((1 - POW(ABS((1 - LEAST(m.calories, 800) / 800.0) - {t_health}), 2)) * 100) AS health_percent,

        ROUND((1 - POW(ABS(
            ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0)
            - {t_complex}
        ), 2)) * 100) AS complexity_percent,

    
        (
            (1 - POW(ABS((1 - LEAST(m.prep_time_minutes, 90) / 90.0) - {t_time}), 2)) * {w_time}
            +
            (1 - POW(ABS((1 - LEAST(m.calories, 800) / 800.0) - {t_health}), 2)) * {w_health}
            +
            (1 - POW(ABS(
                ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0)
                - {t_complex}
            ), 2)) * {w_complex}
        ) / ({w_time} + {w_health} + {w_complex}) AS base_score,

        ROUND(
            (
                (
                    (1 - POW(ABS((1 - LEAST(m.prep_time_minutes, 90) / 90.0) - {t_time}), 2)) * {w_time}
                    +
                    (1 - POW(ABS((1 - LEAST(m.calories, 800) / 800.0) - {t_health}), 2)) * {w_health}
                    +
                    (1 - POW(ABS(
                        ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0)
                        - {t_complex}
                    ), 2)) * {w_complex}
                ) / ({w_time} + {w_health} + {w_complex})
            ) * 100
        ) AS match_percent,

        (
            EXISTS (
                SELECT 1
                FROM meal_tags mt
                JOIN tags t ON t.id = mt.tag_id
                WHERE mt.meal_id = m.id
                AND t.name IN ('בריא','דל פחמימות','עשיר בסיבים','עשיר בחלבון')
            )
            -
            EXISTS (
                SELECT 1
                FROM meal_tags mt
                JOIN tags t ON t.id = mt.tag_id
                WHERE mt.meal_id = m.id
                AND t.name IN ('מטוגן','קרמי','אוכל מנחם')
            )
        ) * (2 * {t_health} - 1) * 0.1 AS tag_bonus,

        (
            (
                (1 - POW(ABS((1 - LEAST(m.prep_time_minutes, 90) / 90.0) - {t_time}), 2)) * {w_time}
                +
                (1 - POW(ABS((1 - LEAST(m.calories, 800) / 800.0) - {t_health}), 2)) * {w_health}
                +
                (1 - POW(ABS(
                    ((FIELD(m.difficulty, 'easy','medium','hard') - 1) / 2.0)
                    - {t_complex}
                ), 2)) * {w_complex}
            ) / ({w_time} + {w_health} + {w_complex})
            +
            (
                EXISTS (
                    SELECT 1
                    FROM meal_tags mt
                    JOIN tags t ON t.id = mt.tag_id
                    WHERE mt.meal_id = m.id
                    AND t.name IN ('בריא','דל פחמימות','עשיר בסיבים','עשיר בחלבון')
                )
                -
                EXISTS (
                    SELECT 1
                    FROM meal_tags mt
                    JOIN tags t ON t.id = mt.tag_id
                    WHERE mt.meal_id = m.id
                    AND t.name IN ('מטוגן','קרמי','אוכל מנחם')
                )
            ) * (2 * {t_health} - 1) * 0.1
            +
            m.popularity_score * 0.1
        ) AS score

    FROM meals m

    WHERE m.category = '{category}'
    AND m.prep_time_minutes <= 120
    

    AND NOT EXISTS (
        SELECT 1
        FROM meal_ingredients mi
        JOIN ingredients i ON i.id = mi.ingredient_id
        WHERE mi.meal_id = m.id
        AND (
            i.name LIKE '%שרימפס%'
            OR i.name LIKE '%בייקון%'
            OR i.name LIKE '%צלפות%'
            OR i.name LIKE '%ספרינג%'
        )
    )
    """

    if request.type:
        if request.type == "meat":
            query += " AND m.type IN ('meat', 'vegan')"
        elif request.type == "dairy":
            query += " AND m.type IN ('dairy', 'vegan')"
        elif request.type == "vegan":
            query += " AND m.type = 'vegan'"


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


    if weights.health == 1:
        query += " AND m.calories <= 500"
    elif weights.health == 0.5:
        query += " AND m.calories <= 700"


    if weights.lightness == 1:
        if weights.complexity == 1:
            query += " AND m.prep_time_minutes <= 45"
        else:
            query += " AND m.prep_time_minutes <= 30"
    elif weights.lightness == 0.5:
        query += " AND m.prep_time_minutes <= 60"

    if category != "salad":
        if not (weights.lightness == 1 and weights.complexity == 1):
            if weights.complexity == 1:
                query += " AND m.difficulty IN ('medium','hard')"
            elif weights.complexity == 0:
                query += " AND m.difficulty IN ('easy','medium')"
    else:
        query += " AND m.difficulty IN ('easy','medium')"

    query += """
    ORDER BY score DESC, RAND()
    LIMIT 5
    """

    return query