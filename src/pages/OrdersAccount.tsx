import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronRight, Copy, Share2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ServiceGlyph } from '../components/Icons'
import { useApp } from '../context/AppContext'
import { STATUS_STEPS } from '../data/dummy'

export function Orders() {
  const navigate = useNavigate()
  const { orders } = useApp()
  const active = orders.filter((o) => o.status !== 'delivered')
  const past = orders.filter((o) => o.status === 'delivered')

  return (
    <div className="page">
      <PageHeader title="My Orders" blue />

      <h3 style={{ marginBottom: 12 }}>Ongoing</h3>
      {active.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
          No ongoing orders.
        </p>
      )}
      {active.map((o) => (
        <button
          key={o.id}
          type="button"
          className="order-row"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <div className="order-icon">
            <ServiceGlyph id={o.serviceId} size={22} />
          </div>
          <div className="meta">
            <strong>
              {o.serviceName} · {o.id}
            </strong>
            <span>{o.statusLabel}</span>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </button>
      ))}

      <h3 style={{ margin: '24px 0 12px' }}>Past orders</h3>
      {past.map((o) => (
        <button
          key={o.id}
          type="button"
          className="order-row"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <div className="order-icon" style={{ background: '#6b7280' }}>
            <ServiceGlyph id={o.serviceId} size={22} />
          </div>
          <div className="meta">
            <strong>
              {o.serviceName} · {o.id}
            </strong>
            <span>{o.statusLabel}</span>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </button>
      ))}
    </div>
  )
}

export function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getOrder } = useApp()
  const order = getOrder(id || '')
  const justBooked = Boolean(
    (location.state as { justBooked?: boolean } | null)?.justBooked,
  )

  if (!order) {
    return (
      <div className="page">
        <PageHeader title="Order" />
        <p>Order not found.</p>
      </div>
    )
  }

  const activeIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)

  return (
    <div className="page">
      <PageHeader title={order.id} blue />

      {justBooked && (
        <div
          className="card"
          style={{
            marginBottom: 16,
            background: '#dcfce7',
            borderColor: '#86efac',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Check size={20} color="#15803d" />
          <span style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>
            Booking confirmed! We'll pick up your clothes on schedule.
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div className="order-icon">
          <ServiceGlyph id={order.serviceId} size={22} />
        </div>
        <div>
          <strong style={{ fontSize: 18 }}>{order.serviceName}</strong>
          <div>
            <span
              className={`badge ${
                order.status === 'delivered'
                  ? 'badge-green'
                  : order.status === 'out'
                    ? 'badge-amber'
                    : 'badge-blue'
              }`}
            >
              {order.statusLabel}
            </span>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 14 }}>Tracking</h3>
      <div style={{ marginBottom: 28, paddingLeft: 8 }}>
        {STATUS_STEPS.map((s, i) => {
          const done = i <= activeIdx
          return (
            <div
              key={s.key}
              style={{
                display: 'flex',
                gap: 14,
                minHeight: 48,
                position: 'relative',
              }}
            >
              {i < STATUS_STEPS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: 24,
                    bottom: 0,
                    width: 2,
                    background: i < activeIdx ? 'var(--primary)' : 'var(--border)',
                  }}
                />
              )}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: done ? 'var(--primary)' : '#fff',
                  border: `2px solid ${done ? 'var(--primary)' : 'var(--border)'}`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                {done && <Check size={12} strokeWidth={3} />}
              </div>
              <div style={{ paddingBottom: 16 }}>
                <strong
                  style={{
                    fontSize: 14,
                    color: done ? 'var(--text)' : 'var(--text-light)',
                  }}
                >
                  {s.label}
                </strong>
              </div>
            </div>
          )
        })}
      </div>

      <h3 style={{ marginBottom: 12 }}>Items</h3>
      {order.items.map((item) => (
        <div key={item.name} className="price-row">
          <div className="info">
            <strong>{item.name}</strong>
            <span>Qty {item.qty}</span>
          </div>
          <span className="price-tag">₹{item.price * item.qty}</span>
        </div>
      ))}

      <div className="card-soft" style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, marginBottom: 8 }}>
          <strong>Pickup:</strong> {order.pickupDate}
        </p>
        <p style={{ fontSize: 13, marginBottom: 8 }}>
          <strong>Delivery:</strong> {order.deliveryDate}
        </p>
        <p style={{ fontSize: 13 }}>
          <strong>Address:</strong> {order.address}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
          fontSize: 18,
        }}
      >
        <strong>Total</strong>
        <strong style={{ color: 'var(--primary)' }}>₹{order.total}</strong>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 24 }}
        onClick={() => navigate('/home')}
      >
        Back to Home
      </button>
    </div>
  )
}

export function Account() {
  const navigate = useNavigate()
  const { user, locationLabel } = useApp()

  const rows = [
    { label: 'Edit profile', to: '/complete-profile' },
    { label: 'Saved addresses', to: '/select-location' },
    { label: 'My orders', to: '/orders' },
    { label: 'Refer & Earn', to: '/refer' },
    { label: 'Admin portal (Sachin)', to: '/admin/login' },
    { label: 'Help & support', to: '/home' },
  ]

  return (
    <div className="page">
      <PageHeader title="Account" blue />

      <div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          marginBottom: 28,
          padding: 16,
          background: 'var(--primary-pale)',
          borderRadius: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {(user?.name || 'G')[0]}
        </div>
        <div>
          <strong style={{ fontSize: 18 }}>{user?.name || 'Guest'}</strong>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {user?.phone}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {user?.email}
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{locationLabel}</div>
        </div>
      </div>

      {rows.map((r) => (
        <button
          key={r.label}
          type="button"
          className="order-row"
          style={{ width: '100%', textAlign: 'left', background: '#fff', border: '1px solid var(--border)' }}
          onClick={() => navigate(r.to)}
        >
          <div className="meta">
            <strong>{r.label}</strong>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </button>
      ))}

      <button
        type="button"
        className="btn btn-outline"
        style={{ width: '100%', marginTop: 28, minHeight: 48 }}
        onClick={() => navigate('/signin')}
      >
        Sign out
      </button>
    </div>
  )
}

export function Refer() {
  const code = 'NYVO100'
  const navigate = useNavigate()

  return (
    <div className="page">
      <PageHeader title="Refer & Earn" blue />

      <div
        style={{
          textAlign: 'center',
          padding: '32px 16px',
          background: 'linear-gradient(160deg, var(--primary-light), #fff)',
          borderRadius: 20,
          marginBottom: 24,
        }}
      >
        <Share2 size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Invite friends</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Share your code and earn <strong>100 points</strong> for every friend
          who places their first order.
        </p>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Your referral code
          </div>
          <strong style={{ fontSize: 22, letterSpacing: 2 }}>{code}</strong>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigator.clipboard?.writeText(code)}
        >
          <Copy size={16} /> Copy
        </button>
      </div>

      <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
        Share invite link
      </button>
    </div>
  )
}
