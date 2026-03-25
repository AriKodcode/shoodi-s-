import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import RecipesPage from './Pages/RecipesPage'
import RecipeDetailsPage from './Pages/RecipeDetails'

import './App.css'
import ErrorPage from './Pages/ErrorPage'

function App() {

  return (
    <>

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/recipes' element={<RecipesPage/>}/>
      <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
      <Route path='/errorPage' element={<ErrorPage />} />
    </Routes>
    </BrowserRouter>

    
    </>
  )
}

export default App
