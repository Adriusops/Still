import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './services/auth'
import FeedPage from './pages/FeedPage'
import SourcesPage from './pages/SourcesPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
        <Route path="/sources" element={<PrivateRoute><SourcesPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
