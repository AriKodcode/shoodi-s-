import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PostRequest(url, filters) {
    const [data, setData] = useState([]) // הstate הזה בשביל כל הדאטה שחוזרת מהשרת
    const navigate = useNavigate()
    async function getMeal() {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filters })
            })
            if (!res.ok) {
                console.log(res)
                navigate('/errorPage')
            }
            else {
                const data = await res.json()
                setData(data.meals)
                navigate('/')// תכניס פה ניתוב לדף שלך 
            }
        } catch (err) {
            navigate('/errorPage')
            console.log(err)
        }
    }
    return { getMeal, data }
}

export default PostRequest
