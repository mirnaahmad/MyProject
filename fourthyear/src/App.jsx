import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import AboutUs from "./pages/AboutUs";
import EventDetailPage from "./pages/EventDetailPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEvents from "./pages/admin/AdminEvents";

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/events"
          element={
            <PublicLayout>
              <EventsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PublicLayout>
              <EventDetailPage />
            </PublicLayout>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/AboutUs"
          element={
            <PublicLayout>
              <AboutUs />
            </PublicLayout>
          }
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
