import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AlertCircleIcon, KeyRound, LayoutDashboard, LogOut, Menu, Shield, X } from 'lucide-react'
import { assets } from '../assets/assets'
import { baseApi } from '../store/api/baseApi'
import { setShowLogin } from '../store/slices/uiSlice'
import { clearToken } from '../store/slices/authSlice'
import { useGetMeQuery } from '../store/api/userApi'
import { useScrollNavigation } from '../hooks/useScrollNavigation'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'issues', label: 'Issues' },
  { id: 'report', label: 'Report' },
  { id: 'contact', label: 'Contact' },
  { id: 'analytics', label: 'Analytics', path: '/analytics' }
]

// True only on devices whose main input can hover (mouse/trackpad).
// Phones and tablets return false, so they use tap-to-toggle instead.
const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

const menuItemClass =
  'w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-slate-700 hover:text-blue-400 focus-visible:bg-slate-700 focus-visible:text-blue-400 focus-visible:outline-none transition'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { goToSection } = useScrollNavigation()

  const token = useSelector((state) => state.auth.token)
  const { data: meData } = useGetMeQuery(undefined, { skip: !token })
  const user = meData?.data
  const isSuperAdmin = user?.role === 'super_admin'
  const isDeptAdmin = user?.role === 'dept_admin'

  const [activeMenu, setActiveMenu] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close the profile menu on outside click/tap or Escape
  useEffect(() => {
    if (!profileOpen) return

    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileOpen])

  const goTo = (path) => {
    setProfileOpen(false)
    navigate(path)
  }

  const logout = () => {
    setProfileOpen(false)
    dispatch(clearToken())
    dispatch(baseApi.util.resetApiState())
    navigate('/')
  }

  useEffect(() => {
    if (location.pathname === '/report') {
      setActiveMenu('report')
    } else if (location.pathname === '/analytics') {
      setActiveMenu('analytics')
    } else if (location.pathname === '/') {
      setActiveMenu(location.state?.scrollTo || 'home')
    }
  }, [location])

  const handleNavClick = (item) => {
    setActiveMenu(item.id)
    setMobileOpen(false)

    if (item.path) {
      navigate(item.path)
    } else {
      goToSection(item.id)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-800 text-white">
      <div className="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 md:px-10">
        <div className="shrink-0">
          <Link to='/' className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer">
            Civic<span className="text-blue-500">Connect</span>
          </Link>
          <p className="text-slate-200 text-xs sm:text-sm md:text-[16px]">
            Your Voice. Our Priority
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="list-none font-semibold flex items-center gap-8 lg:gap-12">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`transition-colors ${
                    activeMenu === item.id ? 'text-blue-400' : 'text-white hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!token ? (
            <button
              onClick={() => dispatch(setShowLogin(true))}
              className="px-3 py-2 sm:px-4 text-sm md:text-base font-medium border border-slate-600 rounded-lg text-white hover:bg-slate-700 hover:border-slate-500 transition"
            >
              Sign in
            </button>
          ) : (
            <div
              ref={profileRef}
              className="relative"
              onMouseEnter={() => canHover() && setProfileOpen(true)}
              onMouseLeave={() => canHover() && setProfileOpen(false)}
            >
              <button
                onClick={() =>
                  // Hover devices: hover already opens it, so click just keeps it open
                  // (prevents "hover opens, click closes" flicker). Touch: normal toggle.
                  canHover() ? setProfileOpen(true) : setProfileOpen((prev) => !prev)
                }
                aria-label="Toggle profile menu"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition overflow-hidden"
              >
                <img src={assets.profile_icon} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
              </button>

              {profileOpen && (
                // pt-2 (not margin) bridges the gap so the cursor can travel from
                // the avatar to the menu without triggering mouseleave
                <div className="absolute right-0 top-full pt-2 z-50">
                  <ul className="flex flex-col min-w-[190px] py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl text-slate-200 overflow-hidden">
                    {user?.name && (
                      <li className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
                        Signed in as <span className="text-slate-200 font-medium">{user.name}</span>
                      </li>
                    )}

                    <li>
                      <button onClick={() => goTo('/myissues')} className={menuItemClass}>
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>My Issues</span>
                      </button>
                    </li>

                    <li>
                      <button onClick={() => goTo('/change-password')} className={menuItemClass}>
                        <KeyRound className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                    </li>

                    {(isDeptAdmin || isSuperAdmin) && (
                      <li>
                        <button onClick={() => goTo('/admin')} className={menuItemClass}>
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                      </li>
                    )}

                    {isSuperAdmin && (
                      <li>
                        <button onClick={() => goTo('/admin/manage-admins')} className={menuItemClass}>
                          <Shield className="w-4 h-4" />
                          <span>Manage Admins</span>
                        </button>
                      </li>
                    )}

                    <li aria-hidden="true" className="h-px bg-slate-700 mx-2 my-1" />

                    <li>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:bg-red-500/10 hover:text-red-400 focus-visible:bg-red-500/10 focus-visible:text-red-400 focus-visible:outline-none transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition"
            onClick={() => {
              setProfileOpen(false)
              setMobileOpen((v) => !v)
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 bg-gray-800 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeMenu === item.id ? 'bg-slate-700 text-blue-400' : 'text-white hover:bg-slate-700 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar