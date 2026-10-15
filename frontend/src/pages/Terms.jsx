import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../Components/SEO';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEO
        title="Terms & Conditions | CivicConnect"
        description="Read the Terms & Conditions for using the CivicConnect civic issue reporting and tracking platform."
      />
      <div className="w-[92%] max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">CivicConnect</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Terms & Conditions</h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: October 2026
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. About CivicConnect</h2>
              <p className="mt-2">
                CivicConnect is an independent civic-tech project that provides a
                platform for users to report, view, and track local civic issues.
              </p>
              <p className="mt-2 font-medium text-slate-700">
                CivicConnect is not an official government website or government
                grievance portal and is not officially affiliated with the Kerala
                Local Self Government Department, Public Works Department, Kerala
                Water Authority, municipalities, panchayats, or other government
                authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Use of the Platform</h2>
              <p className="mt-2">
                You agree to use CivicConnect only for legitimate purposes and in a
                manner that does not interfere with the operation or security of the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Issue Reports</h2>
              <p className="mt-2">
                Users are responsible for the information they submit through
                CivicConnect. Reports should be accurate and relevant to the purpose
                of reporting civic issues.
              </p>
              <p className="mt-2">
                Users should not intentionally submit false, misleading, abusive,
                fraudulent, or malicious reports.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Uploaded Images</h2>
              <p className="mt-2">
                Users should only upload images that they have the right to share.
                Do not upload private documents, identity documents, passwords,
                financial information, or other sensitive personal information.
              </p>
              <p className="mt-2">
                Uploaded images may be publicly displayed as part of an issue report.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Prohibited Activities</h2>
              <p className="mt-2">Users must not:</p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Submit intentionally false or fraudulent reports.</li>
                <li>Upload illegal, abusive, threatening, or harmful content.</li>
                <li>Upload content that infringes another person's rights.</li>
                <li>Attempt to gain unauthorized access to accounts or administrative functions.</li>
                <li>Attempt to disrupt or overload the platform or its APIs.</li>
                <li>Use the platform to distribute spam or malicious content.</li>
                <li>Attempt to manipulate issue votes or other platform functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Accounts</h2>
              <p className="mt-2">
                Users are responsible for maintaining the security of their account
                credentials and should not share their passwords or authentication
                information with others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Issue Status and Resolution</h2>
              <p className="mt-2">
                Issue statuses shown on CivicConnect are based on updates made
                through the platform's administrative workflows. CivicConnect does
                not guarantee that a reported issue will be inspected, accepted,
                repaired, or resolved by a government authority.
              </p>
              <p className="mt-2">
                CivicConnect should not be treated as a replacement for official
                government grievance channels or emergency services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Availability</h2>
              <p className="mt-2">
                CivicConnect is provided on an ongoing development basis. Features
                may be changed, temporarily unavailable, or removed as the project
                evolves.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Content Removal</h2>
              <p className="mt-2">
                CivicConnect may remove or restrict content that violates these
                Terms, creates security or safety concerns, or is otherwise
                inappropriate for the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Privacy</h2>
              <p className="mt-2">
                Information about how CivicConnect collects and uses information is
                described in our Privacy Policy.
              </p>
              <Link to="/privacy" className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium">
                Read the Privacy Policy
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. Changes to These Terms</h2>
              <p className="mt-2">
                These Terms may be updated as CivicConnect's features or policies
                change. The latest version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">12. Contact</h2>
              <p className="mt-2">
                Questions regarding these Terms can be directed to the CivicConnect
                operator using the contact information provided on the website.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to CivicConnect
            </Link>
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms;
