import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function usePostRequest() {
    const [meals, setMeals] = useState([]) 
    const navigate = useNavigate()
    
    async function getMeal(url, filters) {
        console.log(url)
        console.log(filters)
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters) 
            })

            if (!res.ok) {
                console.log("here")
                console.log("Response error:", res)
                navigate('/errorPage')
            }
            else {
                const result = await res.json()
                

                // עדכון ה-State המקומי (ליתר ביטחון)
                setMeals(result.meals)

                
                navigate('/recipes')
            }
        } catch (err) {
            console.log("Fetch error:", err)
            navigate('/errorPage')
        }
    }

    return { getMeal, meals }
}

export default usePostRequest