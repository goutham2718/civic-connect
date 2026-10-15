import React, { useContext } from 'react'
import {
  AlertTriangle,
  CircleCheck,
  Clock,
  MessageSquare,
  User
} from 'lucide-react'
import { displayDate } from '../utils/dateUtils'

const ResolutionTimeline = ({ history = [] }) => {

  const getIconStyle = (type) => {
    switch (type) {
      case 'resolved':
        return {
          wrapper: 'border-green-200 bg-green-50',
          icon: <CircleCheck className='w-4 h-4 text-green-600' />
        }
      case 'in-progress':
        return {
          wrapper: 'border-blue-200 bg-blue-50',
          icon: <Clock className='w-4 h-4 text-blue-600' />
        }
      case 'acknowledged':
        return {
          wrapper: 'border-yellow-200 bg-yellow-50',
          icon: <AlertTriangle className='w-4 h-4 text-yellow-600' />
        }
      case 'reported':
        return {
          wrapper: 'border-slate-200 bg-slate-50',
          icon: <MessageSquare className='w-4 h-4 text-slate-500' />
        }
      default:
        return {
          wrapper: 'border-slate-200 bg-slate-50',
          icon: <Clock className='w-4 h-4 text-slate-500' />
        }
    }
  }

  const formatStatus = (status) => {
    return status
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className='w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8'>
      
      {/* Header */}
      <h2 className='text-lg font-semibold text-slate-900 mb-6'>
        Resolution Timeline
      </h2>

      {/* Constrained internal wrapper */}
      <div className='max-w-3xl flex flex-col'>
        {history.map((item, i) => {
          const isLast = i === history.length - 1
          const { wrapper, icon } = getIconStyle(item.status)

          return (
            <div key={item._id || i} className='flex gap-4'>
              
              {/* Timeline Icon & Vertical Line */}
              <div className='flex flex-col items-center'>
                <div
                  className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full border ${wrapper}`}
                >
                  {icon}
                </div>

                {!isLast && (
                  <div className='w-0.5 bg-slate-200 flex-grow my-1 min-h-[40px]' />
                )}
              </div>

              {/* Timeline Content Block */}
              <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-6'}`}>
                
                {/* Title + Date */}
                <div className='flex items-baseline justify-between gap-4'>
                  <h3 className='text-base font-semibold text-slate-900'>
                    {formatStatus(item.status)}
                  </h3>

                  <span className='text-xs font-medium text-slate-400 shrink-0'>
                    {displayDate(item.createdAt)}
                  </span>
                </div>

                {/* Updated by */}
                {item.updatedBy?.name && (
                  <div className='flex items-center gap-1.5 mt-1 text-xs text-slate-500'>
                    <User className='w-3.5 h-3.5 text-slate-400' />
                    <span>
                      Updated by{' '}
                      <span className='font-medium text-slate-700'>
                        {item.updatedBy.name}
                      </span>
                    </span>
                  </div>
                )}

                {/* Status Note */}
                {item.note && (
                  <div className='mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed max-w-full'>
                    <p className='text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1'>
                      Update Note
                    </p>
                    {item.note}
                  </div>
                )}

              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default ResolutionTimeline