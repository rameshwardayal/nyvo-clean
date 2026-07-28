import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

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
        onClick={() => navigate('/select-location')}
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
  const { setLocationLabel, updateProfile } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState({
    street: 'Tranquil Lane',
    full: '789 Tranquil Lane, Delhi, India',
  })

  const suggestions = [
    { street: 'Tranquil Lane', full: '789 Tranquil Lane, Delhi, India' },
    { street: 'Magarpatta City', full: '12B Tower 5, Magarpatta, Pune' },
    { street: 'Koregaon Park', full: 'Lane 7, Koregaon Park, Pune' },
    { street: 'Baner Road', full: '202 Skyline, Baner, Pune' },
  ].filter(
    (s) =>
      !query ||
      s.street.toLowerCase().includes(query.toLowerCase()) ||
      s.full.toLowerCase().includes(query.toLowerCase()),
  )

  const confirm = () => {
    setLocationLabel(selected.street)
    updateProfile({
      address1: selected.street,
      city: selected.full.includes('Pune') ? 'Pune' : 'Delhi',
      state: selected.full.includes('Pune') ? 'Maharashtra' : 'Delhi',
    })
    navigate('/home')
  }

  return (
    <div className="page flush" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px 12px' }}>
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

      <div className="map-placeholder">
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            fontSize: 11,
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          Starbucks
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 48,
            fontSize: 11,
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          Hotel Royal
        </div>
        <MapPin size={48} className="map-pin" fill="var(--primary)" color="#fff" strokeWidth={1.5} />
      </div>

      <div className="bottom-sheet">
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
