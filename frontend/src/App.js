import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ChoreList from './pages/ChoreList';
import ChoreDetails from './pages/ChoreDetails';
import CompletedChores from './pages/CompletedChores';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import HouseholdSettings from './pages/HouseholdSettings';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="/chores" element={<ChoreList />} />
            <Route path="/chores/:id" element={<ChoreDetails />} />
            <Route path="/completed" element={<CompletedChores />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="household" element={<HouseholdSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
