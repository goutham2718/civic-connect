import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../Components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEO
        title="Privacy Policy | CivicConnect"
        description="Learn how CivicConnect handles account information, issue reports, photos, location information and browser storage."
      />
      <div className="w-[92%] max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">CivicConnect</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: October 2026
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
              <p className="mt-2">
                CivicConnect is an independent civic-tech project designed to help
                users report and track local civic issues. This Privacy Policy
                explains what information CivicConnect may collect, why it is
                collected, how it is used, and the choices available to users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
              <p className="mt-2">
                Depending on how you use CivicConnect, we may collect the following
                information:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Name and email address when creating an account.</li>
                <li>Password information, which is stored in hashed form rather than as plain text.</li>
                <li>Issue titles, descriptions, categories, and related information submitted through the platform.</li>
                <li>Photos uploaded as part of an issue report.</li>
                <li>Location information submitted with an issue report.</li>
                <li>Information relating to votes or interactions with reported issues.</li>
                <li>Information necessary to authenticate and maintain your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Why We Use This Information</h2>
              <p className="mt-2">
                We use collected information to operate CivicConnect and provide
                its features, including:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Creating and managing user accounts.</li>
                <li>Authenticating users.</li>
                <li>Allowing users to report civic issues.</li>
                <li>Displaying and tracking reported issues.</li>
                <li>Processing issue votes and interactions.</li>
                <li>Sending password-reset or account-related emails.</li>
                <li>Maintaining the security and reliability of the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Public Issue Information</h2>
              <p className="mt-2">
                CivicConnect is designed around publicly viewable civic issue
                reports. Information submitted as part of an issue report may be
                displayed publicly on the platform.
              </p>
              <p className="mt-2">
                This may include the issue title, description, category, reported
                location, local body, issue photo, status, and other information
                associated with the report.
              </p>
              <p className="mt-2 font-medium text-slate-700">
                Do not include passwords, identification documents, financial
                information, or other sensitive personal information in an issue
                description or uploaded image.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Location Information</h2>
              <p className="mt-2">
                CivicConnect may use location information provided through the
                issue-reporting process to identify where a civic issue has been
                reported. This information may form part of the publicly displayed
                issue report.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Images</h2>
              <p className="mt-2">
                Images uploaded with issue reports may be stored using a third-party
                image hosting service and displayed as part of the corresponding
                public issue report.
              </p>
              <p className="mt-2">
                Users should only upload images that they have the right to share
                and should avoid uploading private or sensitive information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Browser Storage</h2>
              <p className="mt-2">
                CivicConnect may store an authentication token in your browser's
                local storage to maintain your logged-in session. This is different
                from using tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Third-Party Services</h2>
              <p className="mt-2">
                CivicConnect may use third-party services to operate certain parts
                of the platform. These may include:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Cloudinary for storing and serving uploaded issue images.</li>
                <li>Email infrastructure such as Gmail SMTP for account-related emails.</li>
                <li>OpenStreetMap-based map tiles for map functionality.</li>
                <li>Vercel or other hosting infrastructure used to deploy the application.</li>
              </ul>
              <p className="mt-2">
                These services may process information necessary for the functions
                they provide. Their own privacy policies and terms may also apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Data Security</h2>
              <p className="mt-2">
                CivicConnect uses reasonable technical measures intended to protect
                account and application information, including password hashing,
                authentication controls, authorization checks, and protected
                server-side credentials.
              </p>
              <p className="mt-2">
                However, no online service can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Data Retention and Deletion</h2>
              <p className="mt-2">
                Information may be retained for as long as reasonably necessary to
                operate CivicConnect, maintain issue records, provide security, or
                comply with applicable requirements.
              </p>
              <p className="mt-2">
                If you would like to request deletion of your account or personal
                information, contact the CivicConnect operator using the contact
                information provided on the website. Requests may be reviewed before
                action is taken because some information may be necessary for
                legitimate operational or legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. User Responsibilities</h2>
              <p className="mt-2">
                Users should avoid submitting unnecessary personal information,
                confidential information, passwords, identification documents,
                financial information, or other sensitive information through
                public issue reports.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">12. Changes to This Policy</h2>
              <p className="mt-2">
                This Privacy Policy may be updated when CivicConnect's features,
                data practices, or applicable requirements change. The latest
                version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">13. Contact</h2>
              <p className="mt-2">
                For privacy-related questions or requests concerning CivicConnect,
                please use the contact information provided on the website.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to CivicConnect
            </Link>
            <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy;
