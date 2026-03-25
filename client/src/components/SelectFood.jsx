import React, { useContext, useState } from 'react'
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

  const HOST = import.meta.env.VITE_BACKEND_HOST
  const PORT = import.meta.env.VITE_BACKEND_PORT
  const ROUTE = import.meta.env.VITE_BACKEND_ROUTE

  const { getMeal } = usePostRequest()

  const steps = ["סוג ארוחה", "זמן עשייה", "בריאות", "רמת מורכבות"];
  const typeMeal = [{ text: "חלבי", icon: "🍕", value: "dairy" }, { text: "פרווה", icon: "🥪", value: "vegan" }, { text: "בשרי", icon: "🍔", value: "meat" }]
  const preferTime = [{ text: "מהיר", icon: "⚡", value: 0 }, { text: "בינוני", icon: "🍳", value: 0.5 }, { text: "ארוך", icon: "⏳", value: 1 }]
  const foodHealth = [{ text: "בריא", icon: "🥦", value: 1 }, { text: "קלאסי", icon: "🍲", value: 0.5 }, { text: "ג'אנק", icon: "🍟", value: 0 }]
  const complexityPrefer = [{ text: "קשה", icon: "🥣", value: 0 }, { text: "רגיל", icon: "🍳", value: 0.5 }, { text: "קל", icon: "👨‍🍳", value: 1 },]

  function isValid() {
    if (currentStep === 0) return type === null
    if (currentStep === 1) return lightness === null
    if (currentStep === 2) return health === null
    if (currentStep === 3) return complexity === null
  }

  async function handleSubmit() {
    const filters = {
      type: type,
      weights: {
        lightness: lightness,
        health: health,
        complexity: complexity
      }
    }
    await getMeal(`http://${HOST}:${PORT}/${ROUTE}`, filters)
  }


return (
  <div className='select-food'>
    <div className="title">
      <img src={foodImage} alt="photo" />
      <h1>בחר את הארוחה שלך</h1>
      <h3>ספרו לנו מה בא לכם ונמצא את ההתאמה המושלמת עבורכם</h3>
      <div className="gradient-overlay"></div>

    </div>
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className={`step-line ${index === currentStep ? 'active' : ''}`}></div>
            <span className={`step-text ${index === currentStep ? 'active-text' : ''}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
    {currentStep === 0 ? <Card item={typeMeal} state={type} set={setType} /> : currentStep === 1 ? <Card item={preferTime} state={lightness} set={setLightness} />
      : currentStep === 2 ? <Card item={foodHealth} state={health} set={setHealth} /> : <Card item={complexityPrefer} state={complexity} set={setComplexity} />}
    <div className="buttons">
      {currentStep !== 3 && <button disabled={isValid()} onClick={() => setCurrentStep(currentStep + 1)}>המשך</button>}
      {currentStep === 3 && <button disabled={isValid()} onClick={handleSubmit}>מצאו לי מנה</button>}
      {currentStep !== 0 && <button onClick={() => setCurrentStep(currentStep - 1)}>חזרה</button>}
    </div>
  </div>
)
}

export default SelectFood
