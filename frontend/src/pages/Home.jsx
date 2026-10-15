import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import HeroBanner from '../Components/HeroBanner'
import Issues from '../Components/Issues'
import SEO from '../Components/SEO'

const Home = () => {
  const location = useLocation()
  const lastHandledTarget = useRef(null)

  useEffect(() => {
    const target = location.state?.scrollTo

    // Only scroll if this is a *new* target we haven't already handled —
    // avoids re-scrolling on re-renders, and avoids touching location.state at all
    if (target && target !== lastHandledTarget.current) {
      lastHandledTarget.current = target

      const timer = setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [location.state])


  return (
    <div id='home'>
      <SEO
        title="CivicConnect – Report Civic Issues in Palakkad"
        description="CivicConnect helps citizens report and track civic issues such as potholes, garbage, streetlights, drainage and other local problems in Palakkad."
      />
      <HeroBanner />
      <section>
        <Issues />
      </section>
    </div>
  )
}

export default Home