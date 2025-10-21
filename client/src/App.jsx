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
import Profile from './pages/Profile.jsx'
import { ResetPassForm } from './components/forms/ResetPassForm.jsx'
import Admin from './pages/Admin.jsx'
import AdminRoute from './pages/AdminRoutes.jsx'
import CreateArticle from './components/admin/CreateArticle.jsx'
import CreatCategory from './components/admin/CreatCategory.jsx'
import EditArticle from './components/admin/EditArticle.jsx'

jwtInterceptor();

function App() {

  return (
    <AuthProvider>
      <Toaster />
      <ScrollToTop />
      <div className="h-screen flex flex-col">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/post/:postId" element={<ViewPosts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassForm />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/create-article" 
          element={
            <AdminRoute>
              <CreateArticle />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/edit-article/:postId" 
          element={
            <AdminRoute>
              <EditArticle />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/create-category" 
          element={
            <AdminRoute>
              <CreatCategory />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </AuthProvider>

  )
}

export default App
