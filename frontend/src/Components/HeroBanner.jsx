import React, { useContext } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { useScrollNavigation } from '../hooks/useScrollNavigation'

const HeroBanner = () => {
  const { handleReportClick } = useScrollNavigation()

  return (
    <div className='mx-3 my-3 sm:mx-6 md:mx-16 min-h-[480px] sm:min-h-[440px] md:min-h-[500px] h-auto bg-banner bg-cover bg-center bg-no-repeat relative rounded-2xl shadow-xl overflow-hidden flex items-center'>

      {/* Gradient overlay adjusted for mobile to ensure text readability */}
      <div className='absolute inset-0 bg-gradient-to-r from-white via-white/70 sm:via-white/70 to-transparent sm:to-transparent' />

      <div className='relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 w-full lg:w-7/12 xl:w-6/12 gap-3 sm:gap-4 md:gap-5 py-8 sm:py-6'>

        <div className='flex gap-2 items-center px-3 w-fit py-1.5 rounded-md bg-[#0F1B2D] text-[#F5A623] text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em]'>
          <MapPin className='w-4 h-4 fill-yellow-400 shrink-0' />
          Palakkad Civic Network
        </div>

        <div>
          <h1 className='font-display text-blue-950 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight'>
            EMPOWERING CITIZENS,
          </h1>
          <h1 className='font-display text-green-800 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight'>
            FIXING OUR CITIES
          </h1>
        </div>

        <p className='text-[#0F1B2D]/70 text-sm md:text-base max-w-md'>
          Report civic issues, upvote what matters, and track them to resolution.
        </p>

        <div className='flex items-center gap-1.5 sm:gap-2 my-1 flex-wrap' style={{ fontFamily: "'Inter', sans-serif" }}>
          {['Report', 'Upvote', 'Resolve'].map((step, i) => (
            <React.Fragment key={step}>
              <span className='px-2.5 sm:px-3 py-1 rounded-full border border-[#0F1B2D]/15 bg-white/70 text-[#0F1B2D] text-xs sm:text-sm font-semibold'>
                {step}
              </span>
              {i < 2 && <span className='text-[#0F1B2D]/30 text-sm'>→</span>}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={handleReportClick}
          className='group w-fit flex items-center gap-2 bg-[#1C7A4C] hover:bg-[#166B41] transition-colors px-4 py-2.5 md:px-6 md:py-3.5 text-white text-sm sm:text-base font-semibold rounded-xl shadow-md'
        >
          Report an issue
          <ArrowUpRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
        </button>

      </div>
    </div>
  )
}

export default HeroBanner