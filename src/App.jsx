
import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import MoveToTop from './components/MoveToTop';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import FireworksComponent from './components/Fireworks';
import InstallPWA from './components/InstallPWA'; // Import the new component
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/Notification';
import useNotificationPermission from './hooks/useNotifications'; // Import the hook
import Breadcrumb from './components/Breadcrumb'; // Import the Breadcrumb component
import './App.css';
import './styles/AdminLayout.css';
import { createServerClient } from '@supabase/ssr';


// Lazy load all page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Sermons = lazy(() => import('./pages/Sermons'));
const SermonReader = lazy(() => import('./pages/SermonReader'));
const JesusLessons = lazy(() => import('./pages/JesusLessons'));
const LessonReader = lazy(() => import('./pages/LessonReader'));
const Events = lazy(() => import('./pages/Events'));
const EventReader = lazy(() => import('./pages/EventReader'));
const Contact = lazy(() => import('./pages/Contact'));
const Connect = lazy(() => import('./pages/Connect'));
const StatementOfFaith = lazy(() => import('./pages/StatementOfFaith'));
const Prayers = lazy(() => import('./pages/Prayers'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ChurchDepartment = lazy(() => import('./pages/ChurchDepartment'));
const ChurchDepartmentReader = lazy(() => import('./pages/ChurchDepartmentReader'));
const K56GalleryPage = lazy(() => import('./pages/K56Gallery'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Live = lazy(() => import('./components/Live'));
const ChurchImportanceReader = lazy(() => import('./pages/ChurchImportanceReader'));


// Lazy load admin components
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
const AboutAdmin = lazy(() => import('./components/admin/AboutAdmin'));
const ChurchEstablishedAdmin = lazy(() => import('./components/admin/ChurchEstablishedAdmin'));
const ChurchImportanceAdmin = lazy(() => import('./components/admin/ChurchImportanceAdmin'));
const ChurchPurposeAdmin = lazy(() => import('./components/admin/ChurchPurposeAdmin'));
const HomeAdmin = lazy(() => import('./components/admin/HomeAdmin'));
const HeroAdmin = lazy(() => import('./components/admin/HeroAdmin'));
const JesusLessonsAdmin = lazy(() => import('./components/admin/JesusLessonsAdmin'));
const KindnessActs = lazy(() => import('./components/admin/KindnessActs'));
const DataView = lazy(() => import('./components/admin/DataView'));
const AdminChurchDepartment = lazy(() => import('./components/admin/ChurchDepartment'));
const K56GalleryAdmin = lazy(() => import('./components/admin/K56GalleryAdmin'));
const LiveAdmin = lazy(() => import('./components/admin/LiveAdmin'));
const ConnectAdmin = lazy(() => import('./components/admin/ConnectAdmin'));

const AppContent = () => {
  const location = useLocation();
  const [showFireworks, setShowFireworks] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const notificationPermission = useNotificationPermission(); // Use the hook

  useEffect(() => {
    const hasSeenFireworks = sessionStorage.getItem('hasSeenFireworks');
    if (!hasSeenFireworks) {
      setShowFireworks(true);
      sessionStorage.setItem('hasSeenFireworks', 'true');
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 4000); // Hides component after 4s
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleCloseNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const isAdminPage = location.pathname.startsWith('/admin/');
  const isAuthPage = [
    '/login',
    '/admin-login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ].includes(location.pathname);

  // Determine if the breadcrumb should be shown
  const showBreadcrumb = !isAdminPage && !isAuthPage && location.pathname !== '/' && location.pathname !== '/live';


  return (
    <div className={`app-container ${isAdminPage ? 'admin-layout' : ''}`}>
       <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
      {showFireworks && <FireworksComponent options={{ fullscreen: true }} />}
      {!isAuthPage && <Navbar />}
      {showBreadcrumb && (
        <div className="breadcrumb-container">
          <Breadcrumb />
        </div>
      )}
      <main className={!isAuthPage ? 'content-with-navbar' : ''}>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home setNotification={setNotification} />} />
              <Route path="/about" element={<About />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/sermons/:sermonId" element={<SermonReader />} />
              <Route path="/lessons" element={<JesusLessons />} />
              <Route path="/lessons/:lessonId" element={<LessonReader />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventReader />} />
              <Route path="/statement-of-faith" element={<StatementOfFaith />} />
              <Route path="/prayers" element={<Prayers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/church-department" element={<ChurchDepartment />} />
              <Route path="/church-department-reader/:id" element={<ChurchDepartmentReader />} />
              <Route path="/church-importance/:id" element={<ChurchImportanceReader />} />
              <Route path="/k56-gallery" element={<K56GalleryPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/live" element={<Live />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
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
                <Route path="about-page" element={<AboutAdmin />} />
                <Route path="church-established" element={<ChurchEstablishedAdmin />} />
                <Route path="church-importance" element={<ChurchImportanceAdmin />} />
                <Route path="church-purpose" element={<ChurchPurposeAdmin />} />
                <Route path="home-page" element={<HomeAdmin />} />
                <Route path="hero-admin" element={<HeroAdmin />} />
                <Route path="jesus-lessons" element={<JesusLessonsAdmin />} />
                <Route path="kindness-acts" element={<KindnessActs />} />
                <Route path="view-data" element={<DataView />} />
                <Route path="church-department" element={<AdminChurchDepartment />} />
                <Route path="k56-gallery" element={<K56GalleryAdmin />} />
                <Route path="live" element={<LiveAdmin />} />
								<Route path="connect" element={<ConnectAdmin />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
      <MoveToTop />
      <InstallPWA /> {/* Add the new component here */}
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </Router>
  );
}

export default App;
