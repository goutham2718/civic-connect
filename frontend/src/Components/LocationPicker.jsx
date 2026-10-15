import React, { useEffect, useState } from 'react'
import {MapContainer, TileLayer, Marker, useMapEvents, GeoJSON} from 'react-leaflet'
import L from 'leaflet'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const PALAKKAD_CENTER = [10.7867, 76.6548]

// If the browser says it is only accurate to within this many metres,
// the location is a rough guess (usually IP-based), so we don't trust it.
const MAX_ACCURACY_METERS = 5000

function LocationMarker({ position, setPosition, palakkadGeoJSON }) {
  useMapEvents({
    click(e) {
      if (!palakkadGeoJSON) return

      const lat = e.latlng.lat
      const lng = e.latlng.lng
      const selectedPoint = point([lng, lat])

      const isInside = booleanPointInPolygon(
        selectedPoint,
        palakkadGeoJSON.features[0]
      )

      if (!isInside) {
        alert('Please select a location inside Palakkad district.')
        return
      }

      setPosition({ lat, lng })
    }
  })

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          if (!palakkadGeoJSON) return

          const newPosition = e.target.getLatLng()
          const lat = newPosition.lat
          const lng = newPosition.lng

          const selectedPoint = point([lng, lat])

          const isInside = booleanPointInPolygon(
            selectedPoint,
            palakkadGeoJSON.features[0]
          )

          if (!isInside) {
            alert('The selected location must be inside Palakkad district.')
            e.target.setLatLng(position)
            return
          }

          setPosition({ lat, lng })
        }
      }}
    />
  ) : null
}

const LocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)
  const [palakkadGeoJSON, setPalakkadGeoJSON] = useState(null)

  useEffect(() => {
    fetch('/geojson/palakkad.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load Palakkad GeoJSON')
        }
        return response.json()
      })
      .then((data) => {
        setPalakkadGeoJSON(data)
      })
      .catch((error) => {
        console.error('GeoJSON loading error:', error)
      })
  }, [])

  const handleSetPosition = (pos) => {
    setPosition(pos)
    onLocationChange(pos)
  }

  // Check the position and, if it is valid, place the pin
  const handleFoundPosition = (pos) => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    const accuracy = pos.coords.accuracy

    // Rough location (laptop / hotspot / IP-based): don't trust it
    if (accuracy > MAX_ACCURACY_METERS) {
      alert(
        'Your device could only find an approximate location (laptops and hotspots are often inaccurate). Please click on the map to mark the exact spot.'
      )
      setLocating(false)
      return
    }

    const isInside = booleanPointInPolygon(
      point([lng, lat]),
      palakkadGeoJSON.features[0]
    )

    if (!isInside) {
      alert(
        'Your detected location is outside Palakkad district. If you are in Palakkad, please click on the map to mark the exact spot.'
      )
      setLocating(false)
      return
    }

    handleSetPosition({ lat, lng })
    setLocating(false)
  }

  const handleLocationError = (error) => {
    console.log('Geolocation error:', error.code, error.message)

    if (error.code === 1) {
      alert(
        'Location permission is blocked. Allow location for this site in your browser settings (tap the lock icon next to the address), then try again. Or click on the map to select manually.'
      )
    } else if (error.code === 2) {
      alert(
        'Your device could not find its location. Turn on Location/GPS and try again, or click on the map to select manually.'
      )
    } else if (error.code === 3) {
      alert(
        'Finding your location took too long. Please try again, or click on the map to select manually.'
      )
    } else {
      alert('Unable to fetch your location. Please select it manually on the map.')
    }
    setLocating(false)
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    if (!palakkadGeoJSON) {
      alert('Palakkad map is still loading. Please try again.')
      return
    }

    setLocating(true)

    // 1st try: high accuracy (GPS)
    navigator.geolocation.getCurrentPosition(
      handleFoundPosition,
      (error) => {
        // If GPS timed out or was unavailable, retry once with low accuracy.
        // A permission denial (code 1) is not retried.
        if (error.code === 2 || error.code === 3) {
          navigator.geolocation.getCurrentPosition(
            handleFoundPosition,
            handleLocationError,
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          )
        } else {
          handleLocationError(error)
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  return (
    <div className="mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <p className="text-sm text-gray-500">
          Click on the map to mark the exact location or drag the pin.
        </p>

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locating || !palakkadGeoJSON}
          className="text-sm text-blue-600 font-medium hover:underline disabled:text-gray-400 text-left sm:text-right"
        >
          {locating ? 'Locating...' : '📍 Use my current location'}
        </button>
      </div>

      <div className="relative z-0 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={PALAKKAD_CENTER}
          zoom={10}
          minZoom={9}
          maxZoom={18}
          style={{
            height: '300px',
            width: '100%'
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {palakkadGeoJSON && (
            <GeoJSON
              data={palakkadGeoJSON}
              style={{
                color: '#2563eb',
                weight: 2,
                fillColor: '#3b82f6',
                fillOpacity: 0.08
              }}
            />
          )}

          <LocationMarker
            position={position}
            setPosition={handleSetPosition}
            palakkadGeoJSON={palakkadGeoJSON}
          />
        </MapContainer>
      </div>

      {position && (
        <p className="text-xs text-gray-400 mt-1">
          Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </p>
      )}
    </div>
  )
}

export default LocationPicker