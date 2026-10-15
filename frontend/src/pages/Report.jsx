import React, { useState } from 'react'
import { ImagePlus, MapPin, Send, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../Components/LocationPicker'
import SearchableSelect from '../Components/SearchableSelect'
import DuplicateIssuesModal from '../Components/DuplicateIssuesModal'
import { useGetLocalBodiesQuery } from '../store/api/localBodyApi'
import { useCreateIssueMutation, useCheckNearbyIssuesMutation } from '../store/api/issueApi'
import SEO from '../Components/SEO'

const Report = () => {
  const navigate = useNavigate()

  const { data: localBodies = [] } = useGetLocalBodiesQuery()
  const [createIssue, { isLoading: isSubmitting }] = useCreateIssueMutation()
  const [checkNearbyIssues, { isLoading: isCheckingDuplicates }] = useCheckNearbyIssuesMutation()

  const [image, setImage] = useState(null)
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [duplicateIssues, setDuplicateIssues] = useState(null) // null = no modal shown; array = modal open with results

  const [issueData, setIssueData] = useState({
    title: '',
    category: '',
    roadType: 'local',
    localbody: '',
    description: '',
    address: ''
  })

  const onChangeHandler = (e) => {
    setIssueData(data => ({ ...data, [e.target.name]: e.target.value }))
  }

  // Central validation — returns an errors object, empty = valid
  const getErrors = () => {
    const errors = {}
    if (!image) errors.image = 'Please upload a photo'
    if (!issueData.title.trim()) errors.title = 'Title is required'
    if (!issueData.category) errors.category = 'Please select a category'
    if (!issueData.localbody) errors.localbody = 'Please select a Panchayat / Municipality'
    if (!issueData.description.trim()) errors.description = 'Description is required'
    if (!location.lat || !location.lng) errors.location = 'Please select the issue location on the map'
    return errors
  }

  const errors = submitAttempted ? getErrors() : {}

  // Builds the FormData payload — extracted so both the normal submit path
  // and the "continue anyway" path (after the duplicate modal) can reuse it
  const buildFormData = () => {
    const formData = new FormData()
    formData.append('title', issueData.title)
    formData.append('category', issueData.category)
    formData.append('localbody', issueData.localbody)
    formData.append('address', issueData.address)
    formData.append('description', issueData.description)
    formData.append('lat', location.lat)
    formData.append('lng', location.lng)

    if (issueData.category === 'pothole') {
      formData.append('roadType', issueData.roadType || 'local')
    }

    if (image) formData.append('image', image)
    return formData
  }

  // Actually creates the issue — called either directly (no duplicates found)
  // or after the user dismisses the duplicate modal with "Continue anyway"
  const submitIssue = async () => {
    try {
      await createIssue(buildFormData()).unwrap()

      setIssueData({
        title: '',
        category: '',
        roadType: 'local',
        localbody: '',
        description: '',
        address: ''
      })
      setImage(null)
      setLocation({ lat: null, lng: null })
      setSubmitAttempted(false)
      setDuplicateIssues(null)
      toast.success('Issue reported successfully')
      navigate('/')
    } catch (error) {
      console.log(error.data || error)
      toast.error(error.data?.message || 'Failed to create issue')
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitAttempted(true)

    const currentErrors = getErrors()
    if (Object.keys(currentErrors).length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    // Pre-flight check: look for similar open issues nearby before creating a new one
    try {
      const response = await checkNearbyIssues({
        category: issueData.category,
        lat: location.lat,
        lng: location.lng,
        radius: 200
      }).unwrap()

      if (response.success && response.data.length > 0) {
        setDuplicateIssues(response.data) // opens the modal, submission pauses here
        return
      }
    } catch (error) {
      // If the duplicate check itself fails, don't block the citizen from reporting —
      // just proceed to normal submission
      console.log('Duplicate check failed, proceeding anyway:', error)
    }

    await submitIssue()
  }

  // Called when the user picks "This is a different issue — Continue" in the modal
  const handleContinueAnyway = async () => {
    await submitIssue()
  }

  // Reusable error message
  const FieldError = ({ message }) => (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <SEO
        title="Report a Civic Issue in Palakkad | CivicConnect"
        description="Report potholes, garbage, streetlight, water, sanitation, drainage and other civic issues in Palakkad using CivicConnect."
      />
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Report an Issue
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto">
          Help improve your community by reporting civic problems in your neighbourhood.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} noValidate className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Issue Details</h2>
          <p className="text-xs text-slate-500 mt-1">
            Provide accurate information so the issue can be resolved quickly.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-7">
          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Photo Evidence <span className="text-red-500">*</span>
            </label>
            <label htmlFor="image" className="block cursor-pointer w-fit">
              <div className={`w-full sm:w-64 h-44 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center overflow-hidden ${
                errors.image
                  ? 'border-red-300 bg-red-50 hover:bg-red-50'
                  : 'border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300'
              }`}>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${errors.image ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <ImagePlus className={`w-5 h-5 ${errors.image ? 'text-red-500' : 'text-blue-600'}`} />
                    </div>
                    <p className={`text-sm font-medium ${errors.image ? 'text-red-500' : 'text-slate-700'}`}>Upload photo</p>
                    <p className="text-xs text-slate-400 mt-1">Click to choose an image</p>
                  </>
                )}
              </div>
            </label>
            <input id="image" type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
            {errors.image && <FieldError message={errors.image} />}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={issueData.title}
                onChange={onChangeHandler}
                placeholder="e.g. Street light not working"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-700 outline-none focus:ring-2 transition ${
                  errors.title
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.title && <FieldError message={errors.title} />}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={issueData.category}
                onChange={onChangeHandler}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-700 outline-none focus:ring-2 transition ${
                  errors.category
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100'
                }`}
              >
                <option value="">Select category</option>
                <option value="pothole">Pothole</option>
                <option value="streetlight">Street Light</option>
                <option value="garbage">Waste Disposal</option>
                <option value="water">Water</option>
                <option value="drainage">Drainage</option>
                <option value="sanitation">Sanitation</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <FieldError message={errors.category} />}
            </div>
          </div>

          {issueData.category === 'pothole' && (
            <div className='mt-4'>
              <label className='font-medium text-base text-gray-600 mt-2'>Road type</label><br />
              <select
                className='outline-gray-400 border border-gray-200 px-4 py-2 w-full mt-2 font-medium text-base text-gray-600 rounded-lg'
                name='roadType'
                onChange={onChangeHandler}
                value={issueData.roadType || 'local'}
              >
                <option value="local">Local road (Panchayat/Municipality maintained)</option>
                <option value="pwd">Main/State road (PWD maintained)</option>
              </select>
              <p className='text-xs text-gray-400 mt-1'>Not sure? Leave as "Local road" — it can be reassigned later.</p>
            </div>
          )}

          {/* Local Body */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Panchayat / Municipality <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              name="localbody"
              options={localBodies}
              value={issueData.localbody}
              onChange={(val) =>
                setIssueData((data) => ({ ...data, localbody: val }))
              }
              placeholder="Search Panchayat / Municipality"
              hasError={!!errors.localbody}
            />
            {errors.localbody && <FieldError message={errors.localbody} />}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <label className="text-sm font-semibold text-slate-700">
                Issue Location <span className="text-red-500">*</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Click on the map to mark the exact location or use your current location.
            </p>
            <div className={`rounded-xl overflow-hidden border-2 transition ${
              errors.location ? 'border-red-300' : 'border-slate-200'
            }`}>
              <LocationPicker onLocationChange={(position) => setLocation(position)} />
            </div>
            {errors.location && <FieldError message={errors.location} />}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address / Landmark <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              name="address"
              value={issueData.address}
              onChange={onChangeHandler}
              placeholder="Enter a nearby landmark, street name, or other location details"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Issue Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              name="description"
              value={issueData.description}
              onChange={onChangeHandler}
              placeholder="Describe the problem in detail..."
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-700 outline-none resize-none focus:ring-2 transition ${
                errors.description
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.description ? (
              <FieldError message={errors.description} />
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Provide enough details to help authorities understand the issue.
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-slate-400">
              {submitAttempted && Object.keys(errors).length > 0
                ? `${Object.keys(errors).length} field${Object.keys(errors).length > 1 ? 's' : ''} need${Object.keys(errors).length > 1 ? '' : 's'} attention`
                : 'Please make sure the information provided is accurate.'}
            </p>
            <button
              type="submit"
              disabled={isSubmitting || isCheckingDuplicates}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm transition ${
                (isSubmitting || isCheckingDuplicates) ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isCheckingDuplicates ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Checking for similar issues...
                </>
              ) : isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {duplicateIssues && (
        <DuplicateIssuesModal
          issues={duplicateIssues}
          onContinueAnyway={handleContinueAnyway}
          onClose={() => setDuplicateIssues(null)}
        />
      )}
    </div>
  )
}

export default Report