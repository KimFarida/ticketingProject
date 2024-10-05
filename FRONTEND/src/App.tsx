import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/signUpPage'
import LandingPage from './pages/landingPage';
import SignInPage from './pages/signInPage';
import AdminPage from './pages/adminDashboard';
import './App.css'

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
