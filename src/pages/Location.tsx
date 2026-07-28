import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { LocationMap } from '../components/LocationMap'
import { useApp } from '../context/AppContext'

type Place = {
  street: string
  full: string
  lat: number
  lng: number
  city: string
  state: string
}

const PLACES: Place[] = [
  {
    street: 'Tranquil Lane',
    full: '789 Tranquil Lane, Delhi, India',
    lat: 28.5355,
    lng: 77.241,
    city: 'Delhi',
    state: 'Delhi',
  },
  {
    street: 'Magarpatta City',
    full: '12B Tower 5, Magarpatta, Pune',
    lat: 18.5167,
    lng: 73.926,
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    street: 'Koregaon Park',
    full: 'Lane 7, Koregaon Park, Pune',
    lat: 18.5362,
    lng: 73.8939,
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    street: 'Baner Road',
    full: '202 Skyline, Baner, Pune',
    lat: 18.559,
    lng: 73.7868,
    city: 'Pune',
    state: 'Maharashtra',
  },
]

async function reverseGeocode(lat: number, lng: number): Promise<Place> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error('geocode failed')
    const data = (await res.json()) as {
      display_name?: string
      name?: string
      address?: {
        road?: string
        suburb?: string
        neighbourhood?: string
        city?: string
        town?: string
        state?: string
        postcode?: string
      }
    }
    const street =
      data.name ||
      data.address?.road ||
      data.address?.suburb ||
      data.address?.neighbourhood ||
      'Selected location'
    const city =
      data.address?.city || data.address?.town || data.address?.suburb || 'City'
    const state = data.address?.state || ''
    return {
      street,
      full: data.display_name || `${street}, ${city}`,
      lat,
      lng,
      city,
      state,
    }
  } catch {
    return {
      street: 'Selected location',
      full: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lat,
      lng,
      city: 'Pune',
      state: 'Maharashtra',
    }
  }
}

export function LocationPrompt() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ minHeight: '100dvh' }}>
      <PageHeader title="What is Your Location?" />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px 8px',
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'linear-gradient(160deg, #d8f5e8, #e8fff4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50% 50% 50% 0',
              background: 'linear-gradient(135deg, #ff7a3d, #e63946)',
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(230,57,70,0.35)',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#fff',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        </div>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 15,
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          We need to know your location in order to provide you with the best
          service
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('/select-location?auto=1')}
      >
        Select location Automatically
      </button>
      <button
        type="button"
        className="btn-ghost"
        style={{
          marginTop: 16,
          fontWeight: 700,
          color: 'var(--text)',
          alignSelf: 'center',
        }}
        onClick={() => navigate('/select-location?manual=1')}
      >
        Enter Location Manually
      </button>
    </div>
  )
}

export function SelectLocation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setLocationLabel, updateProfile } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Place>(PLACES[1])
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (params.get('auto') !== '1') return
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const place = await reverseGeocode(
          pos.coords.latitude,
          pos.coords.longitude,
        )
        setSelected(place)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [params])

  const suggestions = PLACES.filter(
    (s) =>
      !query ||
      s.street.toLowerCase().includes(query.toLowerCase()) ||
      s.full.toLowerCase().includes(query.toLowerCase()),
  )

  const confirm = () => {
    setLocationLabel(selected.street)
    updateProfile({
      address1: selected.street,
      city: selected.city,
      state: selected.state,
    })
    navigate('/home')
  }

  const onMapPick = async (lat: number, lng: number) => {
    setLocating(true)
    const place = await reverseGeocode(lat, lng)
    setSelected(place)
    setLocating(false)
  }

  return (
    <div
      className="page flush"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '20px 24px 12px', position: 'relative', zIndex: 20 }}>
        <PageHeader title="Select Your Location" />
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search area"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {query && (
          <div
            style={{
              marginTop: 8,
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: 'var(--shadow)',
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s.full}
                type="button"
                onClick={() => {
                  setSelected(s)
                  setQuery('')
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <strong style={{ display: 'block', fontSize: 14 }}>
                  {s.street}
                </strong>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {s.full}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="leaflet-map-host">
        <LocationMap
          lat={selected.lat}
          lng={selected.lng}
          onPick={onMapPick}
        />
        {locating && (
          <div className="map-loading">Updating location…</div>
        )}
      </div>

      <div className="bottom-sheet" style={{ position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <MapPin size={22} color="var(--primary)" />
          <div>
            <strong style={{ display: 'block' }}>{selected.street}</strong>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {selected.full}
            </span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={confirm}>
          Confirm Location
        </button>
        <button
          type="button"
          className="btn-ghost"
          style={{
            marginTop: 14,
            width: '100%',
            fontWeight: 600,
            color: 'var(--text)',
          }}
          onClick={() => navigate('/complete-profile')}
        >
          Enter Location Manually
        </button>
      </div>
    </div>
  )
}
