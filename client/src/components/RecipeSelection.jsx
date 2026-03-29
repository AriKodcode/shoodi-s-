import React, { useState } from "react";
import "../style/RecipeSelection.css";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../store/useStore";

const mealTypeLabel = (type) => {
  if (type === "dairy") return "חלבי";
  if (type === "meat") return "בשרי";
  return "פרווה";
};
const styleLabel = (style) => style === "heavy" ? "עשיר" : "קליל";
const categoryLabel = (category) => category === "main" ? "מנה עיקרית" : "תוספת";

const difficultyLabel = (d) => {
  if (d === "easy") return "קל";
  if (d === "medium") return "בינוני";
  return "קשה";
};




function normalizeMeals(data) {
  return data.meals.map((group, i) => ({
    id: group.id,
    name: `ארוחה ${i + 1}`,
    match: group.match,
    tags: group.tags || [],
    dishes: group.meals.map((item) => item.meal),
  }));
}

function RecipeSelection() {
  const navigate = useNavigate();

  // const mealsData = useMeals((state) => state.mealsData)
  const mealsData = JSON.parse(localStorage.getItem("meals"))


  const meals = mealsData && mealsData.length > 0 ? normalizeMeals({ meals: mealsData }) : [];
  const [step, setStep] = useState("meals");
  const [activeMeal, setActiveMeal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isExiting, setIsExiting] = useState(false);


  if (!meals || meals.length === 0) {
    return (
      <div className="page">
        <div className="header">
          <h1>לא נמצאו ארוחות</h1>
          <p>חזור לדף הראשי ותנסה שוב</p>
          <button className="home-btn" onClick={() => navigate("/")} >
          לדף הראשי
          </button>
        </div>
      </div>
    );
  }

  const handleMealSelect = (meal) => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveMeal(meal);
      setSelectedDish(null);
      setStep("dishes");
      setIsExiting(false);
    }, 320);
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      setStep("meals");
      setActiveMeal(null);
      setSelectedDish(null);
      setIsExiting(false);
    }, 320);
  };

  const handleNavigate = () => {
    if (selectedDish) navigate(`/recipe/${selectedDish.id}`);
  };


  if (step === "meals") {
    return (
      <div className="page">
        <button className="home-btn" onClick={() => navigate("/")}>
          🏠 ראשי
        </button>

        <div className="header">
          <h1>מה תרצה לאכול היום?</h1>
          <p>בחר ארוחה ונציג לך את האפשרויות</p>
        </div>

        <div className={`cards-wrapper ${isExiting ? "exit" : ""}`}>
          <div className="meal-select-grid">
            {meals.map((meal, i) => (
              <div
                key={meal.id}
                className="meal-hero-card"
                style={{ animationDelay: `${i * 0.12}s` }}
                onClick={() => handleMealSelect(meal)}
              >
                <div className="meal-hero-img">
                  <p className="meal-match-badge">{meal.match}% התאמה של</p>
                  {meal.dishes.slice(0, 3).map((dish, di) => (
                    <div key={di} className="meal-hero-img-slice">
                      <img src={dish.image} alt={dish.name} />
                    </div>
                  ))}
                  <div className="meal-hero-overlay" />
                </div>
                <div className="meal-hero-body">
                  <div className="meal-hero-num">{i + 1}</div>
                  <div className="meal-hero-info">
                    <h2>{meal.name}</h2>
                    <div className="meal-tags-row">
                      {meal.tags.map((tag, ti) => (
                        <span key={ti} className="meal-group-badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="meal-hero-arrow">←</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="page">
      <button className="home-btn" onClick={() => navigate("/")}>
        🏠 ראשי
      </button>

      <div className={`header ${isExiting ? "exit" : ""}`}>
        <button className="back-btn" onClick={handleBack}>
          → חזרה לארוחות
        </button>
        <h1>{activeMeal?.name}</h1>
        <p>איזו מנה הכי עושה לך חשק עכשיו?</p>
      </div>

      <div className={`cards-wrapper ${isExiting ? "exit" : ""}`}>
        <div className="cards-container">
          {activeMeal?.dishes?.map((dish, i) => {
            const isSelected = selectedDish?.id === dish.id;
            return (
              <div
                key={dish.id}
                className={`card ${isSelected ? "selected" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => setSelectedDish(dish)}
              >
                <div className="card-image">
                  <img src={dish.image} alt={dish.name} />

                  {isSelected && <div className="check">✔</div>}

                  <div className="card-img-badges">
                    {dish.calories && (
                      <span className="img-badge">
                        <span className="badge-icon">🔥</span>
                        {dish.calories} קלוריות
                      </span>
                    )}
                    {dish.prep_time_minutes && (
                      <span className="img-badge">
                        <span className="badge-icon">⏱</span>
                        {dish.prep_time_minutes} דק׳
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <h3>{dish.name}</h3>

                  {dish.description && (
                    <p className="card-description">{dish.description}</p>
                  )}

                  <div className="tags">
                    {dish.tags?.map((tag, ti) => (
                      <span key={ti}>{tag}</span>
                    ))}
                    {!dish.tags?.length && (
                      <>
                        <span>{mealTypeLabel(dish.type)}</span>
                        <span>{styleLabel(dish.style)}</span>
                        <span>{categoryLabel(dish.category)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <span className="tag-difficulty">
                    רמה: {difficultyLabel(dish.difficulty)}
                  </span>
                  <div className="footer-right">
                    {dish.calories && (
                      <span className="footer-item">
                        {dish.calories} קלוריות <span>🔥</span>
                      </span>
                    )}
                    {dish.prep_time_minutes && (
                      <span className="footer-item">
                        {dish.prep_time_minutes} דק׳ <span>⏱</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {selectedDish && (
        <div className="bottom-bar">
          <div className="bottom-content">
            <div className="name">
              <span>{selectedDish.name}</span>
              <span>🔥 בחירה מעולה</span>
            </div>
            <button onClick={handleNavigate}>יאללה, בוא נבשל</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default RecipeSelection;