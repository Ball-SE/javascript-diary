import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUpPage'
import LogInPage from './pages/LoginPage'
import ViewPosts from './pages/ViewPosts'
import PageNotFound from './pages/PageNotFound'
import { Toaster } from "@/components/ui/sonner"
import ScrollToTop from "./components/scroll/ScrollToTop"
import { AuthProvider } from './context/authentication.jsx'
import jwtInterceptor from './utils/jwtInterceptor.js'

jwtInterceptor();

function App() {

  return (
    <AuthProvider>
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/post/:postId" element={<ViewPosts />} />
        <Route path="*" element={<PageNotFound />} />
        </Routes>
    </AuthProvider>

  )
}

export default App
