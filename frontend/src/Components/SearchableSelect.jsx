// Components/SearchableSelect.jsx
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

const SearchableSelect = ({
  options,          // now an array of objects, e.g. [{ _id, name }, ...]
  value,            // now the selected _id (or whatever getValue returns)
  onChange,
  placeholder = 'Search...',
  name,
  hasError = false,
  getLabel = (opt) => opt.name,   // what to display
  getValue = (opt) => opt._id,    // what to store / send in onChange
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Find the option object that matches the current value (an id)
  const selectedOption = options.find((opt) => getValue(opt) === value)
  const selectedLabel = selectedOption ? getLabel(selectedOption) : ''

  const filtered = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (opt) => {
    onChange(getValue(opt))   // <-- returns the _id now, not the name
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlightedIndex]) handleSelect(filtered[highlightedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <div
        className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-700 outline-none transition flex items-center gap-2 cursor-text ${
          hasError
            ? 'border-red-300 bg-red-50 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
            : 'border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
        }`}
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        <Search className={`w-4 h-4 shrink-0 ${hasError ? 'text-red-400' : 'text-slate-400'}`} />

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : selectedLabel}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlightedIndex(0)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
        />

        {value && !isOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-2.5 text-sm text-slate-400">No matches found</p>
          ) : (
            filtered.map((opt) => {
              const optValue = getValue(opt)
              const optLabel = getLabel(opt)
              const index = filtered.indexOf(opt)
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition ${
                    index === highlightedIndex
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  } ${optValue === value ? 'font-semibold' : ''}`}
                >
                  {optLabel}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableSelect