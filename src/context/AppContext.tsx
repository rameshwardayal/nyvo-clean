import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CATALOG,
  EXPRESS_DELIVERY_FEE,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  STATUS_LABELS,
  type AdminNotification,
  type CartLine,
  type Order,
  type OrderStatus,
} from '../data/dummy'

export interface UserProfile {
  name: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  pincode: string
  landmark: string
  referral?: string
}

interface ScheduleDraft {
  pickupDate: string
  pickupSlot: string
  deliveryDate: string
  deliverySlot: string
  express: boolean
}

interface AppState {
  user: UserProfile | null
  phoneDraft: string
  emailDraft: string
  locationLabel: string
  cart: CartLine[]
  orders: Order[]
  schedule: ScheduleDraft
  isAdmin: boolean
  adminName: string
  notifications: AdminNotification[]
  unreadCount: number
  setPhoneDraft: (v: string) => void
  setEmailDraft: (v: string) => void
  setLocationLabel: (v: string) => void
  setUser: (u: UserProfile | null) => void
  updateProfile: (partial: Partial<UserProfile>) => void
  addToCart: (itemId: string, qty?: number) => void
  setCartQty: (itemId: string, qty: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  placeOrder: (serviceName: string, serviceId: string) => string
  getOrder: (id: string) => Order | undefined
  setSchedule: (s: Partial<ScheduleDraft>) => void
  loginAdmin: () => void
  logoutAdmin: () => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

const defaultSchedule: ScheduleDraft = {
  pickupDate: '',
  pickupSlot: '',
  deliveryDate: '',
  deliverySlot: '',
  express: false,
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Ram',
    email: 'ram@email.com',
    phone: '+91 9942172918',
    address1: '12B, Tower 5',
    address2: 'Magarpatta City',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411028',
    landmark: 'Near Destination Center',
  })
  const [phoneDraft, setPhoneDraft] = useState('+91 9942172918')
  const [emailDraft, setEmailDraft] = useState('ram@email.com')
  const [locationLabel, setLocationLabel] = useState('Magarpatta, Pune')
  const [cart, setCart] = useState<CartLine[]>([
    { itemId: 'dc-shirt', qty: 2 },
    { itemId: 'dc-pant', qty: 1 },
  ])
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [schedule, setScheduleState] = useState<ScheduleDraft>(defaultSchedule)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName] = useState('Sachin')
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    INITIAL_NOTIFICATIONS,
  )

  const addToCart = useCallback((itemId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.itemId === itemId)
      if (existing) {
        return prev.map((l) =>
          l.itemId === itemId ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [...prev, { itemId, qty }]
    })
  }, [])

  const setCartQty = useCallback((itemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((l) => l.itemId !== itemId)
      const existing = prev.find((l) => l.itemId === itemId)
      if (!existing) return [...prev, { itemId, qty }]
      return prev.map((l) => (l.itemId === itemId ? { ...l, qty } : l))
    })
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty, 0),
    [cart],
  )

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, line) => {
      const item = CATALOG.find((c) => c.id === line.itemId)
      return sum + (item ? item.price * line.qty : 0)
    }, 0)
  }, [cart])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : (partial as UserProfile)))
  }, [])

  const setSchedule = useCallback((s: Partial<ScheduleDraft>) => {
    setScheduleState((prev) => ({ ...prev, ...s }))
  }, [])

  const loginAdmin = useCallback(() => setIsAdmin(true), [])
  const logoutAdmin = useCallback(() => setIsAdmin(false), [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const placeOrder = useCallback(
    (serviceName: string, serviceId: string) => {
      const items = cart
        .map((line) => {
          const item = CATALOG.find((c) => c.id === line.itemId)
          if (!item) return null
          return { name: item.name, qty: line.qty, price: item.price }
        })
        .filter(Boolean) as { name: string; qty: number; price: number }[]

      const formatScheduleDay = (iso?: string) => {
        if (!iso) return ''
        const d = new Date(`${iso}T00:00:00`)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      }

      const expressFee = schedule.express ? EXPRESS_DELIVERY_FEE : 0
      const orderTotal = cartTotal + expressFee
      const customerName = user?.name || 'Ram'
      const id = `ORD-${1000 + orders.length + 5}`
      const order: Order = {
        id,
        serviceId: serviceId as Order['serviceId'],
        serviceName,
        status: 'placed',
        statusLabel: 'Order Placed',
        items,
        total: orderTotal,
        pickupDate: `${formatScheduleDay(schedule.pickupDate) || 'Next available'} · ${schedule.pickupSlot || '10:00 AM - 12:00 PM'}`,
        deliveryDate: `${formatScheduleDay(schedule.deliveryDate) || 'After pickup'} · ${schedule.deliverySlot || '4:00 PM - 6:00 PM'}`,
        address: user
          ? `${user.address1}, ${user.city}`
          : locationLabel,
        createdAt: new Date().toISOString().slice(0, 10),
        customerName,
        customerPhone: user?.phone || '+91 9942172918',
        customerEmail: user?.email || 'ram@email.com',
        express: schedule.express,
        expressFee: expressFee || undefined,
      }
      setOrders((prev) => [order, ...prev])
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: schedule.express
            ? 'New EXPRESS order received'
            : 'New order received',
          message: `${id} · ${serviceName} from ${customerName} (₹${orderTotal || 0})${schedule.express ? ' · Express' : ''}`,
          orderId: id,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ])
      setCart([])
      setScheduleState(defaultSchedule)
      return id
    },
    [cart, cartTotal, orders.length, schedule, user, locationLabel],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status, statusLabel: STATUS_LABELS[status] }
            : o,
        ),
      )
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: 'Order status updated',
            message: `${orderId} · ${STATUS_LABELS[status]} · ${order.customerName}`,
            orderId,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ])
      }
    },
    [orders],
  )

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  )

  const value: AppState = {
    user,
    phoneDraft,
    emailDraft,
    locationLabel,
    cart,
    orders,
    schedule,
    isAdmin,
    adminName,
    notifications,
    unreadCount,
    setPhoneDraft,
    setEmailDraft,
    setLocationLabel,
    setUser,
    updateProfile,
    addToCart,
    setCartQty,
    clearCart,
    cartCount,
    cartTotal,
    placeOrder,
    getOrder,
    setSchedule,
    loginAdmin,
    logoutAdmin,
    updateOrderStatus,
    markNotificationRead,
    markAllNotificationsRead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
