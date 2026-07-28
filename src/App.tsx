import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { AppProvider } from './context/AppContext'
import { Splash, DesktopAside } from './pages/Splash'
import { Onboarding } from './pages/Onboarding'
import { SignIn } from './pages/SignIn'
import { VerifyOtp, SignUp, VerifyEmail } from './pages/Auth'
import { CompleteProfile, ProfileSuccess } from './pages/Profile'
import { LocationPrompt, SelectLocation } from './pages/Location'
import { Home } from './pages/Home'
import { Services, ServiceDetail } from './pages/Services'
import { Cart, Schedule } from './pages/CartSchedule'
import { Orders, OrderDetail, Account, Refer } from './pages/OrdersAccount'
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminOrders,
  AdminOrderDetail,
  AdminCustomers,
  AdminNotifications,
} from './pages/Admin'

const NAV_ROUTES = ['/home', '/orders', '/cart', '/account', '/services']

function Shell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const showNav = NAV_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(`${r}/`),
  )
  const hideOnDetail =
    location.pathname.startsWith('/orders/') ||
    location.pathname.startsWith('/services/') ||
    location.pathname === '/schedule' ||
    location.pathname === '/refer' ||
    location.pathname === '/complete-profile'

  const withNav = showNav && !hideOnDetail

  if (isAdminRoute) {
    return (
      <div className="app-root admin-root">
        <div className="app-frame admin-frame">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <DesktopAside />
      <div className={`app-frame${withNav ? ' has-nav' : ''}`}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile-success" element={<ProfileSuccess />} />
          <Route path="/location" element={<LocationPrompt />} />
          <Route path="/select-location" element={<SelectLocation />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/refer" element={<Refer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {withNav && <BottomNav />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
