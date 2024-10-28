import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUpPage from "./pages/signUpPage";
import LandingPage from "./pages/landingPage";
import SignInPage from "./pages/signInPage";
import AdminPage from "./pages/adminDashboard";
import AgentPage from "./pages/agentDashboard";
// import CreateVoucher from "./pages/voucher";
import ViewAllAgents from "./pages/allAgents";
import ViewAllMerchants from "./pages/allMerchats";
import ProfilePage from "./pages/profile";
import TicketPage from "./pages/ticket";
import { AdminTicketPage } from "./pages/adminTicketPage";
import { AdminPayout } from "./pages/adminPayout";
import { Payout } from "./pages/payout";
import  CreateVoucher from './pages/createVoucher';
import "./App.css";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      } />

      <Route path="/agent" element={
        <ProtectedRoute>
          <AgentPage />
        </ProtectedRoute>
      } />

      <Route path="/create-voucher" element={
        <ProtectedRoute>
          <CreateVoucher />
        </ProtectedRoute>
      } />

      <Route path="/view-all-agents" element={
        <ProtectedRoute>
          <ViewAllAgents />
        </ProtectedRoute>
      } />

      <Route path="/view-all-merchants" element={
        <ProtectedRoute>
          <ViewAllMerchants />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/ticket" element={
        <ProtectedRoute>
          <TicketPage />
        </ProtectedRoute>
      } />

      <Route path="/admin_ticket" element={
        <ProtectedRoute>
          <AdminTicketPage />
        </ProtectedRoute>
      } />

      <Route path="/adminPayout" element={
        <ProtectedRoute>
          <AdminPayout />
        </ProtectedRoute>
      } />

      <Route path="/payout" element={
        <ProtectedRoute>
          <Payout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;


