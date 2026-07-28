import { useMemo, useState, type ReactNode } from 'react'
import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  Users,
} from 'lucide-react'
import { BrandMark, ServiceGlyph } from '../components/Icons'
import { CallButton } from '../components/CallButton'
import { useApp } from '../context/AppContext'
import {
  ADMIN_CREDENTIALS,
  STATUS_STEPS,
  type OrderStatus,
} from '../data/dummy'

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useApp()
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return children
}

export function AdminLogin() {
  const navigate = useNavigate()
  const { loginAdmin } = useApp()
  const [email, setEmail] = useState(ADMIN_CREDENTIALS.email)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      loginAdmin()
      navigate('/admin')
      return
    }
    setError('Invalid credentials. Use sachin@nyvoclean.com / admin123')
  }

  return (
    <div className="page" style={{ minHeight: '100dvh', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <BrandMark size={48} />
        <h1
          style={{
            fontFamily: 'var(--font-brand)',
            color: 'var(--primary)',
            marginTop: 12,
            fontSize: 26,
          }}
        >
          nyvo clean
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Admin Portal</p>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Admin email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sachin@nyvoclean.com"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary">
          Sign in as Sachin
        </button>
      </form>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        Demo: <strong>sachin@nyvoclean.com</strong> / <strong>admin123</strong>
      </p>
      <button
        type="button"
        className="btn-ghost"
        style={{ marginTop: 12, alignSelf: 'center' }}
        onClick={() => navigate('/')}
      >
        Back to customer app
      </button>
    </div>
  )
}

function AdminShell() {
  const { adminName, unreadCount, logoutAdmin } = useApp()
  const navigate = useNavigate()

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/notifications', label: 'Alerts', icon: Bell },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <BrandMark size={32} />
          <div>
            <strong>nyvo clean</strong>
            <span>Admin · {adminName}</span>
          </div>
        </div>
        <nav className="admin-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
              {to === '/admin/notifications' && unreadCount > 0 && (
                <span className="admin-badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="admin-nav-link"
          style={{ marginTop: 'auto' }}
          onClick={() => {
            logoutAdmin()
            navigate('/admin/login')
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Hello, {adminName}</h1>
            <p>Manage orders, customers & notifications</p>
          </div>
          <button
            type="button"
            className="btn-circle"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              position: 'relative',
            }}
            onClick={() => navigate('/admin/notifications')}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 99,
                  background: 'var(--danger)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <nav className="admin-mobile-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `nav-item${isActive ? ' active' : ''}`
            }
          >
            <span style={{ position: 'relative' }}>
              <Icon size={20} />
              {to === '/admin/notifications' && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    background: 'var(--danger)',
                    color: '#fff',
                    fontSize: 9,
                    minWidth: 14,
                    height: 14,
                    borderRadius: 99,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function AdminLayout() {
  return (
    <RequireAdmin>
      <AdminShell />
    </RequireAdmin>
  )
}

export function AdminDashboard() {
  const { orders, notifications, unreadCount } = useApp()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'delivered').length
    const placed = orders.filter((o) => o.status === 'placed').length
    const revenue = orders.reduce((s, o) => s + o.total, 0)
    const customers = new Set(orders.map((o) => o.customerEmail)).size
    return { active, placed, revenue, customers, total: orders.length }
  }, [orders])

  return (
    <>
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total orders</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="admin-stat">
          <span>Active</span>
          <strong>{stats.active}</strong>
        </div>
        <div className="admin-stat">
          <span>New / placed</span>
          <strong>{stats.placed}</strong>
        </div>
        <div className="admin-stat">
          <span>Customers</span>
          <strong>{stats.customers}</strong>
        </div>
        <div className="admin-stat">
          <span>Revenue</span>
          <strong>₹{stats.revenue}</strong>
        </div>
      </div>

      <div className="admin-panel">
        <div className="section-head">
          <h3>Latest notifications</h3>
          <button
            type="button"
            className="link-blue"
            onClick={() => navigate('/admin/notifications')}
          >
            {unreadCount} unread
          </button>
        </div>
        {notifications.slice(0, 3).map((n) => (
          <button
            key={n.id}
            type="button"
            className={`admin-alert${n.read ? '' : ' unread'}`}
            onClick={() =>
              n.orderId
                ? navigate(`/admin/orders/${n.orderId}`)
                : navigate('/admin/notifications')
            }
          >
            <div>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
            {!n.read && <span className="dot-new" />}
          </button>
        ))}
      </div>

      <div className="admin-panel" style={{ marginTop: 16 }}>
        <div className="section-head">
          <h3>Recent orders</h3>
          <button
            type="button"
            className="link-blue"
            onClick={() => navigate('/admin/orders')}
          >
            View all
          </button>
        </div>
        {orders.slice(0, 5).map((o) => (
          <button
            key={o.id}
            type="button"
            className="order-row"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => navigate(`/admin/orders/${o.id}`)}
          >
            <div className="order-icon">
              <ServiceGlyph id={o.serviceId} size={20} />
            </div>
            <div className="meta">
              <strong>
                {o.id} · {o.customerName}
              </strong>
              <span>
                {o.serviceName} · {o.statusLabel}
              </span>
            </div>
            <strong style={{ color: 'var(--primary)' }}>₹{o.total}</strong>
          </button>
        ))}
      </div>
    </>
  )
}

export function AdminOrders() {
  const { orders } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase()
    const matchQ =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.serviceName.toLowerCase().includes(q)
    const matchF = filter === 'all' || o.status === filter
    return matchQ && matchF
  })

  return (
    <>
      <div className="search-bar" style={{ marginBottom: 12 }}>
        <Search size={18} />
        <input
          placeholder="Search order, customer, phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="admin-filters">
        {(
          [
            ['all', 'All'],
            ['placed', 'Placed'],
            ['picked', 'Picked'],
            ['processing', 'Processing'],
            ['out', 'Out'],
            ['delivered', 'Delivered'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.map((o) => (
        <div key={o.id} className="admin-order-card">
          <button
            type="button"
            style={{ width: '100%', textAlign: 'left', background: 'transparent' }}
            onClick={() => navigate(`/admin/orders/${o.id}`)}
          >
            <div className="admin-order-card-top">
              <div>
                <strong>{o.id}</strong>
                <span className="badge badge-blue">{o.statusLabel}</span>
                {o.express && (
                  <span className="badge badge-amber">Express</span>
                )}
              </div>
              <strong style={{ color: 'var(--primary)' }}>₹{o.total}</strong>
            </div>
            <p>
              <strong>{o.customerName}</strong> · {o.customerPhone}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {o.serviceName} · {o.address}
            </p>
          </button>
          <div className="admin-card-actions">
            <CallButton phone={o.customerPhone} label={`Call ${o.customerName}`} variant="outline" />
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-muted)', padding: 24, textAlign: 'center' }}>
          No orders match your filters.
        </p>
      )}
    </>
  )
}

export function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrder, updateOrderStatus } = useApp()
  const order = getOrder(id || '')

  if (!order) {
    return (
      <div>
        <p>Order not found.</p>
        <button type="button" className="link-blue" onClick={() => navigate('/admin/orders')}>
          Back to orders
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="link-blue"
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/admin/orders')}
      >
        ← All orders
      </button>

      <div className="admin-panel">
        <div className="section-head">
          <h3>{order.id}</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {order.express && (
              <span className="badge badge-amber">Express</span>
            )}
            <span className="badge badge-blue">{order.statusLabel}</span>
          </div>
        </div>

        <h4 style={{ marginBottom: 8 }}>Customer</h4>
        <div className="card-soft" style={{ marginBottom: 16 }}>
          <p>
            <strong>{order.customerName}</strong>
          </p>
          <p style={{ fontSize: 14 }}>{order.customerPhone}</p>
          <p style={{ fontSize: 14 }}>{order.customerEmail}</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            {order.address}
          </p>
          <CallButton
            phone={order.customerPhone}
            label={`Call ${order.customerName}`}
            className="call-btn-block"
          />
        </div>

        <h4 style={{ marginBottom: 8 }}>Update status</h4>
        <div className="admin-filters" style={{ marginBottom: 20 }}>
          {STATUS_STEPS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`chip${order.status === s.key ? ' active' : ''}`}
              onClick={() => updateOrderStatus(order.id, s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <h4 style={{ marginBottom: 8 }}>Items</h4>
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
          <p style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>Pickup:</strong> {order.pickupDate}
          </p>
          <p style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>Delivery:</strong> {order.deliveryDate}
          </p>
          <p style={{ fontSize: 13 }}>
            <strong>Total:</strong>{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
              ₹{order.total}
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export function AdminCustomers() {
  const { orders } = useApp()
  const navigate = useNavigate()

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string
        phone: string
        email: string
        orders: number
        spent: number
        lastOrderId: string
      }
    >()
    for (const o of orders) {
      const key = o.customerEmail
      const existing = map.get(key)
      if (existing) {
        existing.orders += 1
        existing.spent += o.total
      } else {
        map.set(key, {
          name: o.customerName,
          phone: o.customerPhone,
          email: o.customerEmail,
          orders: 1,
          spent: o.total,
          lastOrderId: o.id,
        })
      }
    }
    return [...map.values()].sort((a, b) => b.spent - a.spent)
  }, [orders])

  return (
    <>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 14 }}>
        {customers.length} customers from order history
      </p>
      {customers.map((c) => (
        <div key={c.email} className="admin-order-card">
          <button
            type="button"
            style={{ width: '100%', textAlign: 'left', background: 'transparent' }}
            onClick={() => navigate(`/admin/orders/${c.lastOrderId}`)}
          >
            <div className="admin-order-card-top">
              <strong style={{ fontSize: 17 }}>{c.name}</strong>
              <strong style={{ color: 'var(--primary)' }}>₹{c.spent}</strong>
            </div>
            <p style={{ fontSize: 14 }}>{c.phone}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.email}</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>{c.orders} order(s)</p>
          </button>
          <div className="admin-card-actions">
            <CallButton phone={c.phone} label={`Call ${c.name}`} variant="outline" />
          </div>
        </div>
      ))}
    </>
  )
}

export function AdminNotifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp()
  const navigate = useNavigate()

  return (
    <>
      <div className="section-head">
        <h3>Notifications</h3>
        <button
          type="button"
          className="link-blue"
          onClick={markAllNotificationsRead}
        >
          Mark all read
        </button>
      </div>
      {notifications.map((n) => (
        <button
          key={n.id}
          type="button"
          className={`admin-alert${n.read ? '' : ' unread'}`}
          onClick={() => {
            markNotificationRead(n.id)
            if (n.orderId) navigate(`/admin/orders/${n.orderId}`)
          }}
        >
          <div>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
            <span style={{ fontSize: 11, color: 'var(--text-light)' }}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
          {!n.read && <span className="dot-new" />}
        </button>
      ))}
    </>
  )
}
