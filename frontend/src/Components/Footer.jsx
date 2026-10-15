import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  ShieldAlert
} from 'lucide-react'
import { assets } from '../assets/assets'
import { useScrollNavigation } from '../hooks/useScrollNavigation'
import { Link } from 'react-router-dom'

const Footer = () => {
  const { goToSection } = useScrollNavigation()

  return (
    <footer id='contact' className="mt-12 bg-slate-950 text-white">
      <div className="w-[92%] max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Civic<span className="text-blue-500">Connect</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Raise your voice, report civic issues, and help build a
              better and more connected community.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition"
              >
                <img src={assets.facebook_icon} className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition"
              >
                <img src={assets.twitter_icon} className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Quick Links
            </h2>

            <div className="flex flex-col gap-3 mt-5 items-start">
              <button
                onClick={() => goToSection('home')}
                className="text-sm text-slate-400 hover:text-blue-400 transition"
              >
                Home
              </button>

              <button
                onClick={() => goToSection('issues')}
                className="text-sm text-slate-400 hover:text-blue-400 transition"
              >
                Browse Issues
              </button>

              <button
                onClick={() => goToSection('report')}
                className="text-sm text-slate-400 hover:text-blue-400 transition"
              >
                Report an Issue
              </button>

              <Link
                to="/privacy"
                className="text-sm text-slate-400 hover:text-blue-400 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-sm text-slate-400 hover:text-blue-400 transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Get in Touch
            </h2>
            <div className="flex flex-col gap-4 mt-5">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 shrink-0">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <span>+91 8590874383</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span>contact.civicconnect@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span>Palakkad, Kerala</span>
              </div>
            </div>
          </div>
        </div>

        {/* Government disclaimer — styled as a distinct notice box, not stray text */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3.5 max-w-3xl mx-auto">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-5 text-slate-400">
              <span className="text-slate-300 font-medium">Independent project notice: </span>
              CivicConnect is an independent civic-tech project and is not officially
              affiliated with the Kerala Local Self Government Department, PWD, KWA,
              municipalities, panchayats, or any government authority. Reports submitted
              through CivicConnect are not a substitute for official government grievance
              channels.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 mt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CivicConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer