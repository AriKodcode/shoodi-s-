import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 1. שינוי שם ל-usePostRequest
function usePostRequest() {
    const [data, setData] = useState([]) 
    const navigate = useNavigate()
    
    // 2. הוספת פרמטרים לפונקציה כדי שתהיה גמישה
    async function getMeal(url, filters) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters) // שליחת הפילטרים בצורה ישירה
            })

            if (!res.ok) {
                console.log("Response error:", res)
                navigate('/errorPage')
            }
            else {
                const result = await res.json()
                
                // עדכון ה-State המקומי (ליתר ביטחון)
                setData(result.meals)
                
                // 3. הניווט הקריטי: מעבירים את המידע לדף הבא
                // שים לב: שיניתי את הניתוב ל- /recipe (או השם של דף התוצאה שלך)
                navigate('/recipe', { state: { mealData: result.meals } })
            }
        } catch (err) {
            console.log("Fetch error:", err)
            navigate('/errorPage')
        }
    }

    return { getMeal, data }
}

export default usePostRequest