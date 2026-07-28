import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { CATALOG, TIME_SLOTS } from '../data/dummy'

type DateOption = {
  key: string
  day: string
  num: number
  label: string
  iso: string
  date: Date
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function toIsoDay(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateOption(d: Date): DateOption {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return {
    key: toIsoDay(d),
    day: days[d.getDay()],
    num: d.getDate(),
    label: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    iso: toIsoDay(d),
    date: startOfDay(d),
  }
}

/** Upcoming dates starting from `from` (inclusive). */
function upcomingDates(from: Date, count = 10): DateOption[] {
  const base = startOfDay(from)
  const out: DateOption[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    out.push(formatDateOption(d))
  }
  return out
}

function parseSlotStartHour(slot: string) {
  // e.g. "8:00 AM - 10:00 AM"
  const start = slot.split(' - ')[0]?.trim() || ''
  const match = start.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return 0
  let hour = Number(match[1])
  const minute = Number(match[2])
  const mer = match[3].toUpperCase()
  if (mer === 'PM' && hour !== 12) hour += 12
  if (mer === 'AM' && hour === 12) hour = 0
  return hour + minute / 60
}

function isSlotInPast(dateIso: string, slot: string, now = new Date()) {
  if (dateIso !== toIsoDay(now)) return false
  return parseSlotStartHour(slot) <= now.getHours() + now.getMinutes() / 60
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
  const today = useMemo(() => startOfDay(new Date()), [])
  const pickupDates = useMemo(() => upcomingDates(today, 10), [today])
  const [step, setStep] = useState<'pickup' | 'delivery' | 'confirm'>('pickup')

  const pickupKey = schedule.pickupDate || pickupDates[0]?.key
  const pickupDateObj =
    pickupDates.find((d) => d.key === pickupKey)?.date || today

  // Delivery must be at least 1 day after pickup (and never in the past)
  const minDelivery = useMemo(() => {
    const d = new Date(pickupDateObj)
    d.setDate(d.getDate() + 1)
    return startOfDay(d)
  }, [pickupDateObj])

  const deliveryDates = useMemo(
    () => upcomingDates(minDelivery, 10),
    [minDelivery],
  )

  const deliveryKey =
    schedule.deliveryDate &&
    deliveryDates.some((d) => d.key === schedule.deliveryDate)
      ? schedule.deliveryDate
      : deliveryDates[1]?.key || deliveryDates[0]?.key

  // If stored delivery is before allowed min, clear/reset it
  useEffect(() => {
    if (
      schedule.deliveryDate &&
      !deliveryDates.some((d) => d.key === schedule.deliveryDate)
    ) {
      setSchedule({ deliveryDate: deliveryDates[1]?.key || deliveryDates[0]?.key })
    }
  }, [schedule.deliveryDate, deliveryDates, setSchedule])

  const activeDates = step === 'pickup' ? pickupDates : deliveryDates
  const selectedKey = step === 'pickup' ? pickupKey : deliveryKey

  const availableSlots = TIME_SLOTS.filter(
    (slot) => !isSlotInPast(selectedKey || '', slot),
  )

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

  const pickupLabel =
    pickupDates.find((d) => d.key === pickupKey)?.label || pickupKey
  const deliveryLabel =
    deliveryDates.find((d) => d.key === deliveryKey)?.label || deliveryKey

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
          {step === 'delivery' && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginTop: -4,
                marginBottom: 12,
              }}
            >
              Delivery is available from the day after pickup (
              {minDelivery.toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
              })}
              +).
            </p>
          )}
          <div className="date-strip" style={{ marginBottom: 24 }}>
            {activeDates.map((d) => {
              const selected = d.key === selectedKey
              return (
                <button
                  key={d.key}
                  type="button"
                  className={`date-chip${selected ? ' selected' : ''}`}
                  onClick={() => {
                    if (step === 'pickup') {
                      setSchedule({
                        pickupDate: d.key,
                        pickupSlot: '',
                        deliveryDate: '',
                        deliverySlot: '',
                      })
                    } else {
                      setSchedule({
                        deliveryDate: d.key,
                        deliverySlot: '',
                      })
                    }
                  }}
                >
                  <div className="day">{d.day}</div>
                  <div className="num">{d.num}</div>
                </button>
              )
            })}
          </div>

          <h3 style={{ marginBottom: 12 }}>Time slot</h3>
          {availableSlots.length === 0 ? (
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 14,
                marginBottom: 28,
              }}
            >
              No time slots left for today. Please choose a later date.
            </p>
          ) : (
            <div className="slot-grid" style={{ marginBottom: 28 }}>
              {TIME_SLOTS.map((slot) => {
                const past = isSlotInPast(selectedKey || '', slot)
                const selected =
                  step === 'pickup'
                    ? schedule.pickupSlot === slot
                    : schedule.deliverySlot === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`slot${selected ? ' selected' : ''}${past ? ' disabled' : ''}`}
                    disabled={past}
                    onClick={() =>
                      setSchedule(
                        step === 'pickup'
                          ? { pickupSlot: slot, pickupDate: pickupKey }
                          : { deliverySlot: slot, deliveryDate: deliveryKey },
                      )
                    }
                  >
                    {slot.replace(' - ', '\n').split('\n')[0]}
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 11,
                        marginTop: 2,
                        opacity: 0.8,
                      }}
                    >
                      {slot.split(' - ')[1]}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            disabled={
              availableSlots.length === 0 ||
              (step === 'pickup'
                ? !schedule.pickupSlot && !pickupKey
                : !schedule.deliverySlot && !deliveryKey)
            }
            onClick={() => {
              if (step === 'pickup') {
                const slot =
                  schedule.pickupSlot &&
                  !isSlotInPast(pickupKey, schedule.pickupSlot)
                    ? schedule.pickupSlot
                    : availableSlots[0]
                setSchedule({
                  pickupDate: pickupKey,
                  pickupSlot: slot,
                  deliveryDate: '',
                })
                setStep('delivery')
              } else {
                const slot =
                  schedule.deliverySlot &&
                  !isSlotInPast(deliveryKey || '', schedule.deliverySlot)
                    ? schedule.deliverySlot
                    : availableSlots[0]
                setSchedule({
                  deliveryDate: deliveryKey,
                  deliverySlot: slot,
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
              <strong>{pickupLabel}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {schedule.pickupSlot || TIME_SLOTS[1]}
            </p>
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Delivery</h3>
            <p style={{ fontSize: 14, marginBottom: 4 }}>
              <strong>{deliveryLabel}</strong>
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
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 8,
                }}
              >
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
