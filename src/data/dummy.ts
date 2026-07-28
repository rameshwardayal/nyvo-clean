export type ServiceId =
  | 'dry-clean'
  | 'steam-press'
  | 'household'
  | 'shoe'
  | 'leather'
  | 'iron'
  | 'starching'

export interface Service {
  id: ServiceId
  name: string
  shortName: string
  description: string
}

export interface CatalogItem {
  id: string
  serviceId: ServiceId
  name: string
  price: number
  unit: string
}

export interface CartLine {
  itemId: string
  qty: number
}

export type OrderStatus =
  | 'placed'
  | 'picked'
  | 'processing'
  | 'out'
  | 'delivered'

export interface Order {
  id: string
  serviceId: ServiceId
  serviceName: string
  status: OrderStatus
  statusLabel: string
  items: { name: string; qty: number; price: number }[]
  total: number
  pickupDate: string
  deliveryDate: string
  address: string
  createdAt: string
  customerName: string
  customerPhone: string
  customerEmail: string
  express?: boolean
  expressFee?: number
}

/** Extra charge for same-day / priority return */
export const EXPRESS_DELIVERY_FEE = 99

export interface AdminNotification {
  id: string
  title: string
  message: string
  orderId?: string
  createdAt: string
  read: boolean
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  picked: 'Picked Up',
  processing: 'Processing',
  out: 'Out for Delivery',
  delivered: 'Delivered',
}

export const ADMIN_CREDENTIALS = {
  name: 'Sachin',
  email: 'sachin@nyvoclean.com',
  password: 'admin123',
}

export const SERVICES: Service[] = [
  {
    id: 'dry-clean',
    name: 'Dry Clean',
    shortName: 'Dry Clean',
    description: 'Professional dry cleaning for delicate fabrics and formal wear.',
  },
  {
    id: 'steam-press',
    name: 'Steam Press',
    shortName: 'Steam Press',
    description: 'Crisp steam press finish for shirts, suits, and more.',
  },
  {
    id: 'household',
    name: 'House Hold Cleaning',
    shortName: 'House Hold Cleaning',
    description: 'Curtains, bedsheets, sofa covers, and home textiles.',
  },
  {
    id: 'shoe',
    name: 'Shoe Laundry',
    shortName: 'Shoe Laundry',
    description: 'Deep clean and care for sneakers and leather shoes.',
  },
  {
    id: 'leather',
    name: 'Leather care',
    shortName: 'Leather care',
    description: 'Specialized cleaning and conditioning for leather goods.',
  },
  {
    id: 'iron',
    name: 'Iron',
    shortName: 'Iron',
    description: 'Quick ironing service for everyday clothes.',
  },
  {
    id: 'starching',
    name: 'Starching',
    shortName: 'Starching',
    description: 'Classic starch finish for crisp shirts and uniforms.',
  },
]

export const CATALOG: CatalogItem[] = [
  { id: 'dc-shirt', serviceId: 'dry-clean', name: 'Shirt', price: 89, unit: 'pc' },
  { id: 'dc-pant', serviceId: 'dry-clean', name: 'Trousers', price: 99, unit: 'pc' },
  { id: 'dc-suit', serviceId: 'dry-clean', name: 'Suit (2pc)', price: 349, unit: 'set' },
  { id: 'dc-dress', serviceId: 'dry-clean', name: 'Dress', price: 199, unit: 'pc' },
  { id: 'dc-blazer', serviceId: 'dry-clean', name: 'Blazer', price: 249, unit: 'pc' },
  { id: 'sp-shirt', serviceId: 'steam-press', name: 'Shirt Press', price: 39, unit: 'pc' },
  { id: 'sp-pant', serviceId: 'steam-press', name: 'Pant Press', price: 45, unit: 'pc' },
  { id: 'sp-kurta', serviceId: 'steam-press', name: 'Kurta Press', price: 49, unit: 'pc' },
  { id: 'hh-sheet', serviceId: 'household', name: 'Bedsheet', price: 129, unit: 'pc' },
  { id: 'hh-curtain', serviceId: 'household', name: 'Curtain', price: 179, unit: 'pc' },
  { id: 'hh-sofa', serviceId: 'household', name: 'Sofa Cover', price: 159, unit: 'pc' },
  { id: 'sh-sneaker', serviceId: 'shoe', name: 'Sneakers', price: 249, unit: 'pair' },
  { id: 'sh-formal', serviceId: 'shoe', name: 'Formal Shoes', price: 299, unit: 'pair' },
  { id: 'lt-jacket', serviceId: 'leather', name: 'Leather Jacket', price: 599, unit: 'pc' },
  { id: 'lt-bag', serviceId: 'leather', name: 'Leather Bag', price: 399, unit: 'pc' },
  { id: 'ir-shirt', serviceId: 'iron', name: 'Shirt Iron', price: 25, unit: 'pc' },
  { id: 'ir-pant', serviceId: 'iron', name: 'Pant Iron', price: 30, unit: 'pc' },
  { id: 'st-shirt', serviceId: 'starching', name: 'Shirt Starch', price: 55, unit: 'pc' },
  { id: 'st-uniform', serviceId: 'starching', name: 'Uniform Starch', price: 65, unit: 'pc' },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    serviceId: 'dry-clean',
    serviceName: 'Dry Clean',
    status: 'processing',
    statusLabel: 'Processing',
    items: [
      { name: 'Shirt', qty: 3, price: 89 },
      { name: 'Trousers', qty: 2, price: 99 },
    ],
    total: 465,
    pickupDate: '26 Jul 2026, 10:00 AM',
    deliveryDate: '28 Jul 2026, 6:00 PM',
    address: '12B, Magarpatta City, Pune',
    createdAt: '2026-07-25',
    customerName: 'Ram',
    customerPhone: '+91 9942172918',
    customerEmail: 'ram@email.com',
    express: false,
  },
  {
    id: 'ORD-1038',
    serviceId: 'steam-press',
    serviceName: 'Steam Press',
    status: 'out',
    statusLabel: 'Out for Delivery',
    items: [
      { name: 'Shirt Press', qty: 5, price: 39 },
      { name: 'Pant Press', qty: 3, price: 45 },
    ],
    total: 429,
    pickupDate: '24 Jul 2026, 2:00 PM',
    deliveryDate: '24 Jul 2026, 8:00 PM',
    address: '12B, Magarpatta City, Pune',
    createdAt: '2026-07-24',
    customerName: 'Ram',
    customerPhone: '+91 9942172918',
    customerEmail: 'ram@email.com',
    express: true,
    expressFee: 99,
  },
  {
    id: 'ORD-1021',
    serviceId: 'shoe',
    serviceName: 'Shoe Laundry',
    status: 'delivered',
    statusLabel: 'Delivered',
    items: [{ name: 'Sneakers', qty: 1, price: 249 }],
    total: 249,
    pickupDate: '18 Jul 2026, 11:00 AM',
    deliveryDate: '20 Jul 2026, 4:00 PM',
    address: '12B, Magarpatta City, Pune',
    createdAt: '2026-07-18',
    customerName: 'Ram',
    customerPhone: '+91 9942172918',
    customerEmail: 'ram@email.com',
  },
  {
    id: 'ORD-1015',
    serviceId: 'household',
    serviceName: 'House Hold Cleaning',
    status: 'placed',
    statusLabel: 'Order Placed',
    items: [
      { name: 'Bedsheet', qty: 2, price: 129 },
      { name: 'Curtain', qty: 1, price: 179 },
    ],
    total: 437,
    pickupDate: '28 Jul 2026, 9:00 AM',
    deliveryDate: '30 Jul 2026, 5:00 PM',
    address: '45 Palm Grove, Koregaon Park, Pune',
    createdAt: '2026-07-27',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543210',
    customerEmail: 'priya.sharma@email.com',
  },
  {
    id: 'ORD-1009',
    serviceId: 'leather',
    serviceName: 'Leather care',
    status: 'picked',
    statusLabel: 'Picked Up',
    items: [{ name: 'Leather Jacket', qty: 1, price: 599 }],
    total: 599,
    pickupDate: '27 Jul 2026, 3:00 PM',
    deliveryDate: '29 Jul 2026, 6:00 PM',
    address: '801 Skyline, Baner Road, Pune',
    createdAt: '2026-07-26',
    customerName: 'Rahul Mehta',
    customerPhone: '+91 9123456780',
    customerEmail: 'rahul.mehta@email.com',
  },
]

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'n1',
    title: 'New order received',
    message: 'ORD-1015 · House Hold Cleaning from Priya Sharma (₹437)',
    orderId: 'ORD-1015',
    createdAt: '2026-07-27T09:12:00',
    read: false,
  },
  {
    id: 'n2',
    title: 'New order received',
    message: 'ORD-1042 · Dry Clean from Ram (₹465)',
    orderId: 'ORD-1042',
    createdAt: '2026-07-25T10:20:00',
    read: false,
  },
  {
    id: 'n3',
    title: 'Out for delivery',
    message: 'ORD-1038 · Steam Press for Ram is out for delivery',
    orderId: 'ORD-1038',
    createdAt: '2026-07-27T11:05:00',
    read: true,
  },
]

export const TIME_SLOTS = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
]

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Maharashtra',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
]

export const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'placed', label: 'Placed' },
  { key: 'picked', label: 'Picked Up' },
  { key: 'processing', label: 'Processing' },
  { key: 'out', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]
