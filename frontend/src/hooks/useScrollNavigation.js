import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setShowLogin, setRedirectAfterLogin } from '../store/slices/uiSlice'

const HOME_ONLY_SECTIONS = ['home', 'issues']

export const useScrollNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  const handleReportClick = () => {
    if (token) {
      navigate('/report')
    } else {
      dispatch(setShowLogin(true))
      dispatch(setRedirectAfterLogin('/report'))
    }
  }

  const goToSection = (id) => {
    if (id === 'report') {
      if (location.pathname === '/report') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      handleReportClick()
      return
    }

    const needsHomePage = HOME_ONLY_SECTIONS.includes(id)

    if (needsHomePage && location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
      return
    }

    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return { goToSection, handleReportClick }
}