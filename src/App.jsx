import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUpPage'
import LogInPage from './pages/LoginPage'
import ViewPosts from './pages/ViewPosts'
import PageNotFound from './pages/PageNotFound'

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/post/:postId" element={<ViewPosts />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
