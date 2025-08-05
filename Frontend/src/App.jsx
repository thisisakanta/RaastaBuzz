import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './components/Layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Forum from './pages/Forum'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum" element={<Forum />} />
          </Routes>
        </Container>
      </div>
    </AuthProvider>
  )
}

export default App
