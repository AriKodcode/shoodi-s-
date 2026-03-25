import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function usePostRequest() {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    async function getMeal(url, filters) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters)
            })

            if (!res.ok) {
                console.log("Response error:", res)
                navigate('/errorPage')
            }
            else {
                const result = await res.json()

                setData(result.meals)

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