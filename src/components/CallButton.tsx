import { Phone } from 'lucide-react'

/** Opens the device dialer with the given number (works on mobile / desktop with phone support). */
export function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}

export function CallButton({
  phone,
  label = 'Call',
  variant = 'primary',
  className = '',
}: {
  phone: string
  label?: string
  variant?: 'primary' | 'icon' | 'outline'
  className?: string
}) {
  const href = toTelHref(phone)

  if (variant === 'icon') {
    return (
      <a
        href={href}
        className={`btn-circle call-btn ${className}`}
        aria-label={`Call ${phone}`}
        title={`Call ${phone}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Phone size={18} />
      </a>
    )
  }

  if (variant === 'outline') {
    return (
      <a
        href={href}
        className={`btn btn-outline call-btn ${className}`}
        style={{ minHeight: 40, gap: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Phone size={16} />
        {label}
      </a>
    )
  }

  return (
    <a
      href={href}
      className={`btn btn-primary call-btn ${className}`}
      style={{ gap: 8 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Phone size={18} />
      {label}
    </a>
  )
}
