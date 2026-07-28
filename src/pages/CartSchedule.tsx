import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { CATALOG, TIME_SLOTS } from '../data/dummy'

function nextDates(count = 7) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const out: { key: string; day: string; num: number; label: string }[] = []
  const base = new Date(2026, 6, 28)
  for (let i = 0; i < count; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    out.push({
      key: `${d.getDate()} ${months[d.getMonth()]}`,
      day: days[d.getDay()],
      num: d.getDate(),
      label: `${d.getDate()} ${months[d.getMonth()]} 2026`,
    })
  }
  return out
}

export function Cart() {
  const navigate = useNavigate()
  const { cart, setCartQty, cartTotal, clearCart } = useApp()

  const lines = cart
    .map((line) => {
      const item = CATALOG.find((c) => c.id === line.itemId)
      if (!item) return null
      return { ...line, item }
    })
    .filter(Boolean) as {
    itemId: string
    qty: number
    item: (typeof CATALOG)[0]
  }[]

  return (
    <div className="page">
      <PageHeader title="Cart" blue />

      {lines.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 20, maxWidth: 220 }}
            onClick={() => navigate('/services')}
          >
            Browse Services
          </button>
        </div>
      ) : (
        <>
          {lines.map(({ itemId, qty, item }) => (
            <div key={itemId} className="price-row">
              <div className="info">
                <strong>{item.name}</strong>
                <span>
                  ₹{item.price} / {item.unit}
                </span>
              </div>
              <div className="qty-control">
                <button type="button" onClick={() => setCartQty(itemId, qty - 1)}>
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setCartQty(itemId, qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <strong style={{ minWidth: 56, textAlign: 'right' }}>
                ₹{item.price * qty}
              </strong>
            </div>
          ))}

          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: 'var(--bg-soft)',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <span>Subtotal</span>
              <strong>₹{cartTotal}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                color: 'var(--text-muted)',
                fontSize: 14,
              }}
            >
              <span>Pickup fee</span>
              <span>₹0</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                fontSize: 17,
              }}
            >
              <strong>Total</strong>
              <strong style={{ color: 'var(--primary)' }}>₹{cartTotal}</strong>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/schedule')}
            >
              Schedule Pickup
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={clearCart}
            >
              <Trash2 size={16} /> Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function Schedule() {
  const navigate = useNavigate()
  const { schedule, setSchedule, cart, placeOrder, cartTotal } = useApp()
  const dates = useMemo(() => nextDates(), [])
  const [step, setStep] = useState<'pickup' | 'delivery' | 'confirm'>('pickup')

  const pickupKey = schedule.pickupDate || dates[1].key
  const deliveryKey = schedule.deliveryDate || dates[3].key

  const confirm = () => {
    const first = cart[0]
    const catalog = first
      ? CATALOG.find((c) => c.id === first.itemId)
      : undefined
    const serviceId = catalog?.serviceId || 'dry-clean'
    const pretty =
      serviceId === 'dry-clean'
        ? 'Dry Clean'
        : serviceId === 'steam-press'
          ? 'Steam Press'
          : serviceId === 'household'
            ? 'House Hold Cleaning'
            : serviceId === 'shoe'
              ? 'Shoe Laundry'
              : serviceId === 'leather'
                ? 'Leather care'
                : serviceId === 'iron'
                  ? 'Iron'
                  : 'Starching'
    const id = placeOrder(pretty, serviceId)
    navigate(`/orders/${id}`, { state: { justBooked: true } })
  }

  return (
    <div className="page">
      <PageHeader title="Book your slot" blue />

      <div className="steps">
        {(
          [
            ['pickup', 'Pickup'],
            ['delivery', 'Delivery'],
            ['confirm', 'Confirm'],
          ] as const
        ).map(([key, label], i) => {
          const order = ['pickup', 'delivery', 'confirm']
          const activeIdx = order.indexOf(step)
          const done = i < activeIdx
          const active = key === step
          return (
            <div
              key={key}
              className={`step${active ? ' active' : ''}${done ? ' done' : ''}`}
            >
              <div className="step-dot">{i + 1}</div>
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      {step !== 'confirm' && (
        <>
          <h3 style={{ marginBottom: 12 }}>
            Select {step === 'pickup' ? 'pickup' : 'delivery'} date
          </h3>
          <div className="date-strip" style={{ marginBottom: 24 }}>
            {dates.map((d) => {
              const selected =
                step === 'pickup' ? d.key === pickupKey : d.key === deliveryKey
              return (
                <button
                  key={d.key}
                  type="button"
                  className={`date-chip${selected ? ' selected' : ''}`}
                  onClick={() =>
                    setSchedule(
                      step === 'pickup'
                        ? { pickupDate: d.key }
                        : { deliveryDate: d.key },
                    )
                  }
                >
                  <div className="day">{d.day}</div>
                  <div className="num">{d.num}</div>
                </button>
              )
            })}
          </div>

          <h3 style={{ marginBottom: 12 }}>Time slot</h3>
          <div className="slot-grid" style={{ marginBottom: 28 }}>
            {TIME_SLOTS.map((slot) => {
              const selected =
                step === 'pickup'
                  ? schedule.pickupSlot === slot
                  : schedule.deliverySlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  className={`slot${selected ? ' selected' : ''}`}
                  onClick={() =>
                    setSchedule(
                      step === 'pickup'
                        ? { pickupSlot: slot, pickupDate: pickupKey }
                        : { deliverySlot: slot, deliveryDate: deliveryKey },
                    )
                  }
                >
                  {slot.replace(' - ', '\n').split('\n')[0]}
                  <div style={{ fontWeight: 500, fontSize: 11, marginTop: 2, opacity: 0.8 }}>
                    {slot.split(' - ')[1]}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={
              step === 'pickup'
                ? !schedule.pickupSlot && !pickupKey
                : !schedule.deliverySlot && !deliveryKey
            }
            onClick={() => {
              if (step === 'pickup') {
                setSchedule({
                  pickupDate: pickupKey,
                  pickupSlot: schedule.pickupSlot || TIME_SLOTS[1],
                })
                setStep('delivery')
              } else {
                setSchedule({
                  deliveryDate: deliveryKey,
                  deliverySlot: schedule.deliverySlot || TIME_SLOTS[4],
                })
                setStep('confirm')
              }
            }}
          >
            Continue
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Pickup</h3>
            <p style={{ fontSize: 14, marginBottom: 4 }}>
              <strong>{schedule.pickupDate || pickupKey}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {schedule.pickupSlot || TIME_SLOTS[1]}
            </p>
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Delivery</h3>
            <p style={{ fontSize: 14, marginBottom: 4 }}>
              <strong>{schedule.deliveryDate || deliveryKey}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {schedule.deliverySlot || TIME_SLOTS[4]}
            </p>
          </div>
          <div className="card-soft" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated total</span>
              <strong style={{ color: 'var(--primary)' }}>
                ₹{cartTotal || 0}
              </strong>
            </div>
            {cart.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Cart is empty — a sample Dry Clean booking will be created.
              </p>
            )}
          </div>
          <button type="button" className="btn btn-primary" onClick={confirm}>
            Confirm Booking
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{ marginTop: 12 }}
            onClick={() => setStep('pickup')}
          >
            Edit schedule
          </button>
        </>
      )}
    </div>
  )
}
