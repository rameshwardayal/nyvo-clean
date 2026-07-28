import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function BackButton({ to }: { to?: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="btn-circle"
      aria-label="Go back"
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowLeft size={18} />
    </button>
  )
}

export function PageHeader({
  title,
  blue,
  right,
}: {
  title: string
  blue?: boolean
  right?: ReactNode
}) {
  return (
    <header className={`page-header${blue ? ' blue' : ''}`}>
      <BackButton />
      <h1>{title}</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </header>
  )
}
