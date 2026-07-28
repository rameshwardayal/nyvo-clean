import {
  Home,
  ClipboardList,
  ShoppingCart,
  User,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const items = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/account', label: 'Account', icon: User },
]

export function BottomNav() {
  const { cartCount } = useApp()

  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span style={{ position: 'relative' }}>
            <Icon size={22} strokeWidth={2.2} />
            {to === '/cart' && cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: 10,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
