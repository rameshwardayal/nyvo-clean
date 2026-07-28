import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { ServiceGlyph } from '../components/Icons'
import { CATALOG, SERVICES, type ServiceId } from '../data/dummy'
import { useApp } from '../context/AppContext'
import { Minus, Plus } from 'lucide-react'

export function Services() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <PageHeader title="Services" blue />

      <div className="service-grid" style={{ marginTop: 12, marginBottom: 32 }}>
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="service-item"
            onClick={() => navigate(`/services/${s.id}`)}
          >
            <div className="service-icon">
              <ServiceGlyph id={s.id} />
            </div>
            <span>{s.shortName}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 'auto' }}
        onClick={() => navigate('/schedule')}
      >
        Book your slot
      </button>
    </div>
  )
}

export function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, setCartQty, addToCart } = useApp()
  const service = SERVICES.find((s) => s.id === id)
  const items = CATALOG.filter((c) => c.serviceId === id)

  if (!service) {
    return (
      <div className="page">
        <PageHeader title="Service" />
        <p>Service not found.</p>
      </div>
    )
  }

  const qtyOf = (itemId: string) =>
    cart.find((l) => l.itemId === itemId)?.qty ?? 0

  return (
    <div className="page">
      <PageHeader title={service.name} blue />
      <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
        {service.description}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          padding: 16,
          background: 'var(--primary-pale)',
          borderRadius: 14,
        }}
      >
        <div className="service-icon" style={{ width: 56, height: 56 }}>
          <ServiceGlyph id={service.id as ServiceId} size={24} />
        </div>
        <div>
          <strong>{service.name}</strong>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Select items to add to cart
          </div>
        </div>
      </div>

      {items.map((item) => {
        const qty = qtyOf(item.id)
        return (
          <div key={item.id} className="price-row">
            <div className="info">
              <strong>{item.name}</strong>
              <span>per {item.unit}</span>
            </div>
            <span className="price-tag">₹{item.price}</span>
            {qty === 0 ? (
              <button
                type="button"
                className="btn btn-outline"
                style={{ minHeight: 36, padding: '0 12px' }}
                onClick={() => addToCart(item.id)}
              >
                Add
              </button>
            ) : (
              <div className="qty-control">
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={() => setCartQty(item.id, qty - 1)}
                >
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={() => setCartQty(item.id, qty + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )
      })}

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/cart')}
        >
          Go to Cart
        </button>
        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '100%', minHeight: 48 }}
          onClick={() => navigate('/schedule')}
        >
          Book your slot
        </button>
      </div>
    </div>
  )
}
