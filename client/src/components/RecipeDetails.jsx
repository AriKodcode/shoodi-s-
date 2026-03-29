import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import '../style/RecipeDetails.css'

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mealsData = JSON.parse(localStorage.getItem("meals"))
  let meal = null;
  let nextMeal = null;
  let prevMeal = null;

  for (const group of mealsData) {
    const dishes = group.meals || [];
    const foundIndex = dishes.findIndex((item) => item.meal?.id === parseInt(id));
    if (foundIndex !== -1) {
      meal = dishes[foundIndex].meal;
      if (dishes[foundIndex + 1]) nextMeal = dishes[foundIndex + 1].meal;
      if (dishes[foundIndex - 1]) prevMeal = dishes[foundIndex - 1].meal;
      break;
    }
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

        <div className="recipe-actions">
          <button className="btn-secondary" onClick={() => navigate("/recipes")}>
            → חזרה לכל הארוחות
          </button>
          {prevMeal && (
            <button className="btn-outline" onClick={() => navigate(`/recipe/${prevMeal.id}`)}>
              ← המנה הקודמת
            </button>
          )}
          {nextMeal && (
            <button className="btn-primary" onClick={() => navigate(`/recipe/${nextMeal.id}`)}>
              המנה הבאה →
            </button>
          )}
        </div>
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
                {ing.quantity} {ing.unit} {ing.ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h2>אופן ההכנה:</h2>

          <div className="markdown">
            <ReactMarkdown>
              {meal.recipe}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;