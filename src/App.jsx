import { Routes, Route } from "react-router";
import { useState } from "react";
import { useAuth } from "./context/authContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import ChatBotToggle from "./components/ChatBotToggle";

function App() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* Admin routes */}
        {isAdmin && <Route path="/admin" element={<Admin />} />}
      </Routes>
      
      {/* Chatbot toggle button and component */}
      {!isChatBotOpen && <ChatBotToggle onClick={() => setIsChatBotOpen(true)} />}
      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </>
  );
}

export default App;