import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../style/RecipeDetails.css'
import { useMeals } from "../store/useStore";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mealsData = useMeals((state) => state.mealsData)

  let meal = null;
  for (const group of mealsData) {
    const found = group.meals?.find((item) => item.meal?.id === parseInt(id));
    if (found) { meal = found.meal; break; }
  }

  if (!meal) {
    return (
      <div>
        <p>לא נמצאה מנה עם מזהה זה. חזור לדף הבחירה.</p>
        <button onClick={() => navigate("/recipes")}>חזור</button>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <div className="recipe-header">
        <img src={meal.image} alt={meal.name} />
        <h1>{meal.name}</h1>
      </div>

      <div className="recipe-info">
        <span>{meal.type === 'dairy' ? 'חלבי' : meal.type === 'meat' ? 'בשרי' : 'פרווה'}</span> |
        <span>{meal.style === 'heavy' ? 'כבד' : 'קליל'}</span> |
        <span>{meal.category === 'main' ? 'מנה עיקרית' : 'תוספת'}</span>
      </div>

      <div className="recipe-body">
        <div className="recipe-ingredients">
          <h2>מרכיבים:</h2>
          <ul>
            {meal.ingredients?.map((ing, i) => (
              <li key={i}>
                • {ing.quantity} {ing.unit} {ing.ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h2>אופן ההכנה:</h2>
          <p>{meal.recipe}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
