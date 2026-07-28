import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Shirt, Heart, Award } from 'lucide-react'

const SLIDES = [
  {
    title: 'Premium Care',
    subtitle: 'Experience the Next Level of Laundry Service',
    icon: Shirt,
    gradient: 'linear-gradient(160deg, #dbe8ff 0%, #f0f5ff 100%)',
    accent: '#0047ba',
  },
  {
    title: 'We Care of your clothes',
    subtitle: 'Handled with expertise, returned with love',
    icon: Heart,
    gradient: 'linear-gradient(160deg, #e0ecff 0%, #f7f9ff 100%)',
    accent: '#1a50c4',
  },
  {
    title: 'The best Service in India',
    subtitle: 'Redefining Laundry Convenience in India',
    icon: Award,
    gradient: 'linear-gradient(160deg, #cfdfff 0%, #eef3ff 100%)',
    accent: '#003bc2',
  },
]

export function Onboarding() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const slide = SLIDES[index]
  const Icon = slide.icon

  const next = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1)
    else navigate('/signin')
  }

  const back = () => {
    if (index > 0) setIndex(index - 1)
    else navigate('/')
  }

  return (
    <div className="page" style={{ minHeight: '100dvh' }}>
      <div className="onboarding-hero">
        <div className="illus" style={{ background: slide.gradient }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: slide.accent,
              opacity: 0.12,
              position: 'absolute',
              top: 24,
              right: 16,
            }}
          />
          {[12, 28, 44].map((s, i) => (
            <div
              key={s}
              style={{
                position: 'absolute',
                width: s,
                height: s,
                borderRadius: '50%',
                background: 'rgba(0,71,186,0.12)',
                bottom: 40 + i * 18,
                left: 24 + i * 36,
              }}
            />
          ))}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: slide.accent,
              boxShadow: '0 12px 32px rgba(0,71,186,0.18)',
              zIndex: 1,
            }}
          >
            <Icon size={56} strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 8px' }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: 8,
          }}
        >
          {slide.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          {slide.subtitle}
        </p>
      </div>

      <div className="dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot${i === index ? ' active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="onboarding-nav">
        <button type="button" className="btn-circle" onClick={back} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate('/signin')}
        >
          Skip
        </button>
        <button
          type="button"
          className="btn-circle filled"
          onClick={next}
          aria-label="Next"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
