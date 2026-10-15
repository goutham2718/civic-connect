import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


// Automatically fit the map to Palakkad GeoJSON
const FitPalakkadBounds = ({ palakkadGeoJSON }) => {
  const map = useMap()

  useEffect(() => {
    if (!palakkadGeoJSON) return

    const geoJsonLayer = new L.GeoJSON(palakkadGeoJSON)

    const bounds = geoJsonLayer.getBounds()

    map.setMaxBounds(bounds)
    map.fitBounds(bounds)
  }, [palakkadGeoJSON, map])

  return null
}


const IssueLocationView = ({ coordinates }) => {

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

  if (!coordinates) return null

  const { lat, lng } = coordinates

  return (
    <div className="relative rounded-lg overflow-hidden z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        minZoom={9}
        maxZoom={18}
        maxBoundsViscosity={1}
        style={{
          height: '250px',
          width: '100%'
        }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {palakkadGeoJSON && (
          <>
            <GeoJSON
              data={palakkadGeoJSON}
              style={{
                color: '#2563eb',
                weight: 2,
                fillColor: '#3b82f6',
                fillOpacity: 0.08
              }}
            />

            <FitPalakkadBounds
              palakkadGeoJSON={palakkadGeoJSON}
            />
          </>
        )}

    <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  )
}

export default IssueLocationView