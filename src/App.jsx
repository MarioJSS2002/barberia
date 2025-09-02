import React from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
import Booking from "./components/booking/Booking.jsx";
import AdminLayout from "./components/admin/AdminLayout/AdminLayout.jsx";
import AdminAppointments from "./components/admin/Appointments/AdminAppointments.jsx";
import AdminClients from "./components/admin/Clients/AdminClients";
import "./style/variables.css";
import "./style/global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="page">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin/appointments" element={ <AdminLayout> <AdminAppointments /> </AdminLayout>}/>
            <Route path="/admin/clients" element={ <AdminLayout> <AdminClients /></AdminLayout> }/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
