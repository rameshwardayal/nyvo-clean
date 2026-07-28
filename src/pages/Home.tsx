import { Bell, Gift, ChevronRight, CalendarDays, Menu, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark, ServiceGlyph } from '../components/Icons'
import { useApp } from '../context/AppContext'
import { SERVICES } from '../data/dummy'

export function Home() {
  const navigate = useNavigate()
  const { user, locationLabel, orders } = useApp()
  const ongoing = orders.filter((o) => o.status !== 'delivered')
  const previewServices = SERVICES.slice(0, 4)

  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={36} />
          <div>
            <strong
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--primary)',
                fontSize: 18,
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              nyvo clean
            </strong>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              We Pick-Clean-Deliver
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-circle"
            aria-label="Account"
            onClick={() => navigate('/account')}
          >
            <User size={18} />
          </button>
          <button type="button" className="btn-circle" aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Location</div>
          <button
            type="button"
            onClick={() => navigate('/select-location')}
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              textAlign: 'left',
            }}
          >
            {locationLabel} ›
          </button>
        </div>
        <button
          type="button"
          className="btn-circle"
          style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
          aria-label="Notifications"
        >
          <span style={{ position: 'relative' }}>
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--primary)',
              }}
            />
          </span>
        </button>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        Hello! {user?.name?.split(' ')[0] || 'Guest'}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
        What do you need today?
      </p>

      <div className="hero-banner">
        <CalendarDays size={28} />
        <p>Book your laundry pickup in just a few taps!</p>
        <button
          type="button"
          className="btn"
          onClick={() => navigate('/schedule')}
        >
          Schedule
        </button>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Gift size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ color: 'var(--primary)', display: 'block' }}>
            Refer & Earn
          </strong>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Refer friends, earn 100 points each! Share now for rewards.
          </span>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/refer')}
        >
          Invite
        </button>
      </div>

      <div className="section-head">
        <h3>Services</h3>
        <Link to="/services" className="link-blue">
          see all
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 28,
          scrollbarWidth: 'none',
        }}
      >
        {previewServices.map((s) => (
          <button
            key={s.id}
            type="button"
            className="service-item"
            style={{ minWidth: 84 }}
            onClick={() => navigate(`/services/${s.id}`)}
          >
            <div className="service-icon" style={{ width: 64, height: 64 }}>
              <ServiceGlyph id={s.id} size={26} />
            </div>
            <span>{s.shortName}</span>
          </button>
        ))}
      </div>

      <div className="section-head">
        <h3>Ongoing Orders</h3>
        <Link to="/orders" className="link-blue">
          view all
        </Link>
      </div>

      {ongoing.length === 0 ? (
        <div className="empty-state" style={{ padding: 24 }}>
          No ongoing orders. Book a pickup to get started.
        </div>
      ) : (
        ongoing.map((o) => (
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
              <strong>{o.serviceName}</strong>
              <span>{o.statusLabel}</span>
            </div>
            <ChevronRight size={18} color="var(--text-light)" />
          </button>
        ))
      )}
    </div>
  )
}
