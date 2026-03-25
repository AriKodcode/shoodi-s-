import React, { useState } from "react";
import meals from "../DB/example.json";
import "../style/RecipeSelection.css";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../store/MealsStore";

function RecipeSelection() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();
  const {meals} = useMeals()
  console.log(meals)
  const handleSelect = (meal) => {
   
    setSelectedMeal(meal);
   
  };

  const handleNavigate = () => {
    if (selectedMeal) {
      navigate(`/recipe/${selectedMeal.id}`);
    }
  };

  return (
    <div className="page">

      {/* כותרת ימנית */}
      <div className="header">
        <h1>מצאנו לך 3 אפשרויות מעולות!</h1>
        <p>איזו מנה הכי עושה לך חשק עכשיו?</p>
      </div>

      {/* כרטיסים באמצע */}
      <div className="cards-wrapper">
        <div className="cards-container">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`card ${selectedMeal?.id === meal.id ? "selected" : ""}`}
              onClick={() => handleSelect(meal)}
            >
              {/* תמונה */}
              <div className="card-image">
                <img src={meal.image} alt={meal.name} />
                {selectedMeal?.id === meal.id && <div className="check">✔</div>}
              </div>

              {/* תוכן */}
              <div className="card-content">
                <h3>{meal.name}</h3>
                <div className="tags">
                  <span>{meal.type === 'dairy' ? 'חלבי': meal.type === 'meat' ? 'בשרי' : 'פרווה'  }</span>
                  <span>{meal.style === 'heavy' ? 'כבד': 'קליל'  }</span>
                  <span>{meal.category ==='main' ? 'מנה עיקרית' : 'מנה צדדית'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {selectedMeal && (
        <div className="bottom-bar">
          <div className="bottom-content">
            <span>🔥 בחירה מעולה</span>
            <button onClick={handleNavigate}>יאללה, בוא נבשל</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default RecipeSelection;