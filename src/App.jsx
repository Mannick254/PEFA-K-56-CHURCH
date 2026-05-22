import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Sermons = lazy(() => import('./pages/Sermons'));
const Events = lazy(() => import('./pages/Events'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const ChurchMembers = lazy(() => import('./components/admin/ChurchMembers'));
const Youth = lazy(() => import('./components/admin/Youth'));
const Children = lazy(() => import('./components/admin/Children'));
const SundayService = lazy(() => import('./components/admin/SundayService'));
const Visitors = lazy(() => import('./components/admin/Visitors'));
const AdminSermons = lazy(() => import('./components/admin/Sermons'));
const AdminEvents = lazy(() => import('./components/admin/Events'));
const AdminPrayers = lazy(() => import('./components/admin/Prayers'));
const AdminStatementOfFaith = lazy(() => import('./components/admin/StatementOfFaith'));
const StatementOfFaith = lazy(() => import('./pages/StatementOfFaith'));
const Prayers = lazy(() => import('./pages/Prayers'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/events" element={<Events />} />
                <Route path="/statement-of-faith" element={<StatementOfFaith />} />
                <Route path="/prayers" element={<Prayers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route 
                  path="/admin/*" 
                  element={(
                    <PrivateRoute isAdminRoute={true}>
                      <Admin />
                    </PrivateRoute>
                  )}
                >
                  <Route path="members" element={<ChurchMembers />} />
                  <Route path="youth" element={<Youth />} />
                  <Route path="children" element={<Children />} />
                  <Route path="attendance" element={<SundayService />} />
                  <Route path="visitors" element={<Visitors />} />
                  <Route path="sermons" element={<AdminSermons />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="prayers" element={<AdminPrayers />} />
                  <Route path="statement-of-faith" element={<AdminStatementOfFaith />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
