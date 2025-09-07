import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUp from './pages/SignUpPage.jsx'
import LogInPage from './pages/LogInPage.jsx'
import ViewPosts from './pages/ViewPosts.jsx'
import PageNotFound from './pages/PageNotFound.jsx'

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
