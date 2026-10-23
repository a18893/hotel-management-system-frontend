import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AboutUs from "@/pages/common/AboutUs";
import ContactUs from "@/pages/common/ContactUs";
import Profile from "@/pages/user/Profile";

import HomePage from "@/pages/common/HomePage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Unauthorized from "@/pages/common/Unauthorized";
import BookingPage from "@/pages/customer/BookingPage";

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CreateUser from "@/pages/admin/CreateUser";
import CreateHotel from "@/pages/admin/CreateHotel";
import ManageHotels from "@/pages/admin/ManageHotels";
import ManageLocations from "@/pages/admin/ManageLocations";
import ManageFacilities from "@/pages/admin/ManageFacilities";
import UserManagement from "@/pages/admin/UserManagement";
import AllBookings from "@/pages/admin/AllBookings";
import SearchNotification from "@/pages/admin/SearchNotification";
import AssignManager from "@/pages/admin/AssignManager";
import CreateLocation from "@/pages/admin/CreateLocation";
import CreateFacility from "@/pages/admin/CreateFacility";
import HotelDetails from "@/pages/admin/HotelDetails";
import AdminReviews from "@/pages/admin/AdminReviews";

// Customer
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import MyBookings from "@/pages/customer/MyBookings";
import NotificationsPage from "@/pages/customer/NotificationsPage";
import AddReview from "@/pages/customer/AddReview";

// Manager
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ManagerBookings from "@/pages/manager/ManagerBookings";
import ManagerHotel from "@/pages/manager/ManagerHotel";
import ManagerFacilities from "@/pages/manager/ManagerFacilities";
import ManagerReviews from "@/pages/manager/ManagerReviews";

// Payment
import CheckoutPaymentPage from "@/pages/payment/CheckoutPaymentPage";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentDetails from "@/pages/payment/PaymentDetails";

// Others
import NotificationDetails from "@/pages/notification/NotificationDetails";
import ReviewList from "@/pages/review/ReviewList";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const protect = (element, roles) => (
    <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= GENERAL ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/hotel/:hotelId" element={<HotelDetails />} />

        {/* ================= USER ================= */}
        <Route
          path="/profile"
          element={protect(<Profile />, ["CUSTOMER", "MANAGER", "ADMIN"])}
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/dashboard"
          element={protect(<AdminDashboard />, ["ADMIN"])}
        />
        <Route
          path="/admin/assign-manager"
          element={protect(<AssignManager />, ["ADMIN"])}
        />
        <Route
          path="/admin/create-user"
          element={protect(<CreateUser />, ["ADMIN"])}
        />
        <Route
          path="/admin/create-hotel"
          element={protect(<CreateHotel />, ["ADMIN"])}
        />
        <Route
          path="/admin/create-location"
          element={protect(<CreateLocation />, ["ADMIN"])}
        />
        <Route
          path="/admin/create-facility"
          element={protect(<CreateFacility />, ["ADMIN"])}
        />
        <Route
          path="/admin/manage-hotels"
          element={protect(<ManageHotels />, ["ADMIN"])}
        />
        <Route
          path="/admin/manage-locations"
          element={protect(<ManageLocations />, ["ADMIN"])}
        />
        <Route
          path="/admin/manage-facilities"
          element={protect(<ManageFacilities />, ["ADMIN"])}
        />
        <Route
          path="/admin/users"
          element={protect(<UserManagement />, ["ADMIN"])}
        />
        <Route
          path="/admin/bookings"
          element={protect(<AllBookings />, ["ADMIN"])}
        />
        <Route
          path="/admin/search-notification"
          element={protect(<SearchNotification />, ["ADMIN"])}
        />
        <Route
          path="/admin/reviews"
          element={protect(<AdminReviews />, ["ADMIN"])}
        />

        {/* ================= CUSTOMER ================= */}
        <Route
          path="/customer/dashboard"
          element={protect(<CustomerDashboard />, ["CUSTOMER"])}
        />
        <Route
          path="/book/:hotelId"
          element={protect(<BookingPage />, ["CUSTOMER"])}
        />
        <Route
          path="/my-bookings"
          element={protect(<MyBookings />, ["CUSTOMER"])}
        />
        <Route
          path="/review/:hotelId"
          element={protect(<AddReview />, ["CUSTOMER"])}
        />

        {/* ================= MANAGER ================= */}
        <Route
          path="/manager/dashboard"
          element={protect(<ManagerDashboard />, ["MANAGER", "ADMIN"])}
        />
        <Route
          path="/manager/bookings"
          element={protect(<ManagerBookings />, ["MANAGER"])}
        />
        <Route
          path="/manager/hotel"
          element={protect(<ManagerHotel />, ["MANAGER"])}
        />
        <Route
          path="/manager/facilities"
          element={protect(<ManagerFacilities />, ["MANAGER"])}
        />
        <Route
          path="/manager/reviews"
          element={protect(<ManagerReviews />, ["MANAGER"])}
        />

        {/* ================= PAYMENT ================= */}
        <Route
          path="/payment/checkout/:bookingId"
          element={protect(<CheckoutPaymentPage />, ["CUSTOMER"])}
        />
        <Route
          path="/payment/success"
          element={protect(<PaymentSuccess />, ["CUSTOMER"])}
        />
        <Route
          path="/payment/details/:bookingId"
          element={protect(<PaymentDetails />, [
            "CUSTOMER",
            "ADMIN",
            "MANAGER",
          ])}
        />

        {/* ================= SHARED ================= */}
        <Route
          path="/notifications"
          element={protect(<NotificationsPage />, [
            "CUSTOMER",
            "ADMIN",
            "MANAGER",
          ])}
        />
        <Route
          path="/notifications/:id"
          element={protect(<NotificationDetails />, [
            "CUSTOMER",
            "ADMIN",
            "MANAGER",
          ])}
        />
        <Route path="/reviews/:hotelId" element={<ReviewList />} />

        {/* ================= FALLBACK 404 ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
