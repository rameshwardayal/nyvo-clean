import {
  Shirt,
  Wind,
  SprayCan,
  Footprints,
  Layers,
  Flame,
  SquareStack,
  type LucideIcon,
} from 'lucide-react'
import type { ServiceId } from '../data/dummy'

const ICONS: Record<ServiceId, LucideIcon> = {
  'dry-clean': Shirt,
  'steam-press': Wind,
  household: SprayCan,
  shoe: Footprints,
  leather: Layers,
  iron: Flame,
  starching: SquareStack,
}

export function ServiceGlyph({
  id,
  size = 28,
}: {
  id: ServiceId
  size?: number
}) {
  const Icon = ICONS[id] ?? Shirt
  return <Icon size={size} strokeWidth={2} />
}

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#0047BA" />
      <circle cx="24" cy="22" r="10" stroke="#fff" strokeWidth="2.5" />
      <circle cx="24" cy="22" r="4" fill="#fff" />
      <path
        d="M18 36h12"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 14l6 4-2 3"
        stroke="#8EB4FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
