import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/signUpPage'
import LandingPage from './pages/landingPage';
import SignInPage from './pages/signInPage';
import AdminPage from './pages/adminDashboard';
import AgentPage from './pages/agentDashboard';
import CreateVoucher from './pages/voucher';
import ViewAllAgents from './pages/allAgents';
import ViewAllMerchants from './pages/allMerchats';
import ProfilePage from './pages/profile';
import TicketPage from './pages/ticket';
import { AdminTicketPage } from './pages/adminTicketPage';
import { AdminPayout } from './pages/adminPayout';
import { Payout } from './pages/payout';
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
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/create-voucher" element={<CreateVoucher />} />
        <Route path="/view-all-agents" element={<ViewAllAgents />} />
        <Route path="/view-all-merchants" element={<ViewAllMerchants />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/admin_ticket" element={<AdminTicketPage />} />
        <Route path="/adminPayout" element={<AdminPayout />} />
        <Route path="/payout" element={<Payout />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
