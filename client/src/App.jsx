import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import RecipesPage from './Pages/RecipesPage'
import RecipeDetailsPage from './Pages/CookRecipePage'



function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/recipes' element={<RecipesPage/>}/>
      <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
