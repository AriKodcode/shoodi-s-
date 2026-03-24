import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './Pages/MainPage'

import './App.css'
import ErrorPage from './Pages/ErrorPage'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/errorPage' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
