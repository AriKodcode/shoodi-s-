import React from 'react'
import '../style/ErrorPage.css'
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
  const navigate = useNavigate()
  
  return (
    <div className='error-page'>
      <h1>404</h1>
      <p>מצטערים...</p>
      <p>הדף המבוקש לא נמצא</p>
      
      <button className='error-btn' onClick={()=>navigate('/')}>לחזרה לדף הראשי</button>
    </div>
  )
}

export default ErrorPage
