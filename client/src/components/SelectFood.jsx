import  { useState } from 'react'
import '../style/SelectFood.css'
import foodImage from '../assets/hero-food.jpg'
import Card from './Card';
import usePostRequest from '../customHooks/PostRequest';

function SelectFood() {
  const [currentStep, setCurrentStep] = useState(0);
  const [type,        setType]        = useState(null)
  const [lightness,   setLightness]   = useState(null)
  const [health,      setHealth]      = useState(null)
  const [complexity,  setComplexity]  = useState(null)

  const HOST  = import.meta.env.VITE_BACKEND_HOST
  const PORT  = import.meta.env.VITE_BACKEND_PORT
  const ROUTE = import.meta.env.VITE_BACKEND_ROUTE

  const { getMeal } = usePostRequest()


const steps = ["סוג ארוחה", "זמן עשייה", "בריאות", "רמת מורכבות"];

  const typeMeal = [
    { text: "חלבי",  icon: "🧀", value: "dairy" },
    { text: "פרווה", icon: "🥗", value: "vegan" },
    { text: "בשרי",  icon: "🥩", value: "meat"  }
  ]
  const preferTime = [
    { text: "מהיר",  icon: "⚡", value: 1   },
    { text: "בינוני", icon: "🕐", value: 0.5 },
    { text: "ארוך",  icon: "🔥", value: 0   }
  ]
  const foodHealth = [
    { text: "בריא",  icon: "🥑",  value: 1   },
    { text: "קלאסי", icon: "🍽️", value: 0.5 },
    { text: "ג'אנק", icon: "🍔",  value: 0   }
  ]
  const complexityPrefer = [
    { text: "קל",   icon: "🥄",   value: 0   },
    { text: "רגיל", icon: "🍳",   value: 0.5 },
    { text: "קשה",  icon: "👨‍🍳", value: 1   }
  ]

  // בחירה אוטומטית — לוחצים על קארד ועוברים לשלב הבא
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
    }
    await getMeal(`http://${HOST}:${PORT}/${ROUTE}`, filters)
  }

  const currentData = [
    { item: typeMeal,         state: type,       set: (v) => handleSelect(setType,       v) },
    { item: preferTime,       state: lightness,  set: (v) => handleSelect(setLightness,  v) },
    { item: foodHealth,       state: health,     set: (v) => handleSelect(setHealth,     v) },
    { item: complexityPrefer, state: complexity, set: (v) => {
        setComplexity(v);
      }
    },
  ][currentStep];

  return (
    <div className='select-food'>

      {/* ── Hero ── */}
      <div className="title">
        <img src={foodImage} alt="photo" />
        <h1>בחר את הארוחה שלך</h1>
        <h3>ספרו לנו מה בא לכם ונמצא את ההתאמה המושלמת עבורכם</h3>
        <div className="gradient-overlay" />
      </div>

      {/* ── Stepper ── */}
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

      {/* ── Cards ── */}
      <Card
        key={currentStep}
        item={currentData.item}
        state={currentData.state}
        set={currentData.set}
      />

      {/* ── Buttons ── */}
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
