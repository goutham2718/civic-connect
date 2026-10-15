import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import IssueDetails from './pages/IssueDetails'
import Report from './pages/Report'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import LoginPopup from './Components/LoginPopup'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './Components/ScrollToTop'
import MyIssues from './pages/MyIssues'
import AdminDashboard from './pages/AdminDashboard'
import ManageAdmins from './pages/ManageAdmins'
import ChangePassword from './pages/ChangePassword'
import ProtectedRoute from './Components/ProtectedRoute'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

function App() {
  const showLogin = useSelector((state) => state.ui.showLogin)

  return (
    <div className='bg-slate-100'>
      <ToastContainer autoClose={3000} />
      {showLogin && <LoginPopup />}
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/issue/:id' element={<IssueDetails />} />
        <Route path='/report' element={<Report />} />
        <Route path='/myissues' element={<MyIssues />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['dept_admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/manage-admins'
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <ManageAdmins />
            </ProtectedRoute>
          }
        />
        <Route path='/analytics' element={<AnalyticsDashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App