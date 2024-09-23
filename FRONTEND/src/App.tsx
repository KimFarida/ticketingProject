import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/signInPage'
import './App.css'

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        {/* <Route path="/signin" element={<SignInPage />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
