import { useState } from 'react'
import '../style/SelectFood.css'
import foodImage from '../assets/hero-food.jpg'
import Card from './Card';
import usePostRequest from '../customHooks/PostRequest';

function SelectFood() {
  const [currentStep, setCurrentStep] = useState(0);
  const [type, setType] = useState(null)
  const [lightness, setLightness] = useState(null)
  const [health, setHealth] = useState(null)
  const [complexity, setComplexity] = useState(null)
  const [isLoading, setIsLoading] = useState(false);


  const HOST = import.meta.env.VITE_BACKEND_HOST
  const PORT = import.meta.env.VITE_BACKEND_PORT
  const ROUTE = import.meta.env.VITE_BACKEND_ROUTE

  const { getMeal } = usePostRequest()


  const steps = ["מה בא לך?", "מה הקצב שלך היום?", "כמה בריא הולכים היום?", "כמה בא לך להשקיע?"];

  const typeMeal = [
    { text: "חלבי", icon: "🧀", value: "dairy" },
    { text: "פרווה", icon: "🥗", value: "vegan" },
    { text: "בשרי", icon: "🥩", value: "meat" }
  ]
  const preferTime = [
    { text: "זריז", icon: "⚡", value: 1 },
    { text: "בכיף", icon: "🕐", value: 0.5 },
    { text: "כשיש זמן", icon: "🔥", value: 0 }
  ]
  const foodHealth = [
    { text: "קליל ובריא", icon: "🥑", value: 1 },
    { text: "מאוזן", icon: "🍽️", value: 0.5 },
    { text: "מתפנק עד הסוף", icon: "🍔", value: 0 }
  ]
  const complexityPrefer = [
    { text: "בקטנה", icon: "🥄", value: 0 },
    { text: "זורם", icon: "🍳", value: 0.5 },
    { text: "למתקדמים", icon: "👨‍🍳", value: 1 }
  ]

  function handleSelect(setter, value) {
    setter(value);
    setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      }
    }, 280);
  }



  async function handleSubmit() {
    const filters = {
      type,
      weights: { lightness, health, complexity }
    };

    setIsLoading(true);
    try {
      await getMeal(`http://${HOST}:${PORT}/${ROUTE}`, filters);
     
    } catch (error) {
      console.error("Error fetching meal:", error);
      setIsLoading(false); 
    }
  }

  const currentData = [
    { item: typeMeal, state: type, set: (v) => handleSelect(setType, v) },
    { item: preferTime, state: lightness, set: (v) => handleSelect(setLightness, v) },
    { item: foodHealth, state: health, set: (v) => handleSelect(setHealth, v) },
    {
      item: complexityPrefer, state: complexity, set: (v) => {
        setComplexity(v);
      }
    },
  ][currentStep];

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loader-content">
          <div className="spinner">🍳</div>
          <h2>השף שלנו כבר מרכיב לך תפריט...</h2>
          <p>זה ייקח רק כמה שניות</p>
        </div>
      </div>
    );
  }


  return (
    <div className='select-food'>

      <div className="title">
        <img src={foodImage} alt="photo" />
        <h1>MEAL MATCHER</h1>
        <h2>בחר את הארוחה שלך</h2>
        <h3>מצא את המנה שמתאימה לך</h3>
        <div className="gradient-overlay" />
      </div>

      <div className="stepper-container">
        <div className="stepper">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className={`step-line ${index <= currentStep ? 'active' : ''}`} />
              <span className={`step-text ${index === currentStep ? 'active-text' : ''}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card
        key={currentStep}
        item={currentData.item}
        state={currentData.state}
        set={currentData.set}
      />

      <div className="buttons">
        {currentStep === 3 && (
          <button
            disabled={complexity === null}
            onClick={handleSubmit}
            className="btn-primary"
          >
            מצאו לי מנה 🍽️
          </button>
        )}
        {currentStep !== 0 && (
          <button
            className="btn-secondary"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            חזרה
          </button>
        )}
      </div>

    </div>
  )
}

export default SelectFood
