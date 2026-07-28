import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Icons'
import { CheckCircle2, MapPin, Sparkles } from 'lucide-react'

export function Splash() {
  const navigate = useNavigate()

  return (
    <div className="splash-bg">
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <BrandMark size={56} />
        <h1
          className="brand-name"
          style={{ color: 'var(--primary)', marginTop: 12, fontSize: 32 }}
        >
          nyvo clean
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 14, marginTop: 4 }}>
          We Pick-Clean-Deliver
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '24px 0',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 280,
            aspectRatio: '1',
            borderRadius: 28,
            background:
              'linear-gradient(160deg, #dce8ff 0%, #f5f8ff 50%, #e8f0ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'var(--primary)',
              opacity: 0.15,
              position: 'absolute',
              top: 20,
              right: -20,
            }}
          />
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,71,186,0.15)',
              zIndex: 1,
            }}
          >
            <BrandMark size={48} />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              zIndex: 1,
              marginTop: 8,
            }}
          >
            {['Pickup', 'Clean', 'Deliver'].map((t) => (
              <span
                key={t}
                className="badge badge-blue"
                style={{ fontSize: 11 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.25 }}>
          Welcome to{' '}
          <span style={{ color: 'var(--primary)' }}>nyvo clean</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 28px' }}>
          Your Convenient Laundry Solution
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/onboarding')}
        >
          Get Started
        </button>
        <button
          type="button"
          className="btn-ghost"
          style={{ marginTop: 14, fontWeight: 600, color: 'var(--primary)' }}
          onClick={() => navigate('/admin/login')}
        >
          Admin login (Sachin)
        </button>
      </div>
    </div>
  )
}

export function DesktopAside() {
  return (
    <aside className="desktop-aside">
      <h1>Laundry, done right.</h1>
      <p>
        Book pickup, track cleaning, and get clothes delivered — all from nyvo
        clean.
      </p>
      <ul>
        <li>
          <Sparkles size={18} /> Premium dry cleaning
        </li>
        <li>
          <MapPin size={18} /> Doorstep pickup & delivery
        </li>
        <li>
          <CheckCircle2 size={18} /> Live order tracking
        </li>
      </ul>
    </aside>
  )
}
