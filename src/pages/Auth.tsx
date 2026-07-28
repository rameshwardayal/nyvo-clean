import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Icons'
import { BackButton } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { Loader2, Check } from 'lucide-react'

export function VerifyOtp() {
  const navigate = useNavigate()
  const { phoneDraft, updateProfile } = useApp()
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(60)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const submit = () => {
    if (otp.length < 4) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      updateProfile({ phone: phoneDraft.trim() || '+91 9942172918' })
      setTimeout(() => navigate('/location'), 700)
    }, 900)
  }

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="brand-logo">
          <BrandMark size={40} />
        </div>
        <div className="brand-name">nyvo clean</div>
        <div className="brand-tagline">We Pick-Clean-Deliver</div>
      </div>

      <div className="auth-card">
        <h2>Verify Code</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 14 }}>
          We've sent a verification code to the number you provided. Please
          enter the code below.
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          {phoneDraft.trim() || '+91 9942172918'}
        </p>
        <button
          type="button"
          className="link-blue caps"
          style={{ marginBottom: 20 }}
          onClick={() => navigate('/signin')}
        >
          Edit Mobile Number
        </button>

        <div className="field">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            marginTop: -8,
          }}
        >
          <button
            type="button"
            className="link-blue"
            disabled={seconds > 0}
            onClick={() => setSeconds(60)}
            style={{ opacity: seconds > 0 ? 0.5 : 1 }}
          >
            Resend OTP
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Resend OTP : 00:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={otp.length < 4 || loading}
          onClick={submit}
        >
          {loading ? (
            <Loader2 size={22} className="spin" style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : done ? (
            <Check size={22} />
          ) : (
            'Sign In'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function SignUp() {
  const navigate = useNavigate()
  const { emailDraft, setEmailDraft, setPhoneDraft, phoneDraft } = useApp()
  const [name, setName] = useState('')

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="brand-logo">
          <BrandMark size={40} />
        </div>
        <div className="brand-name">nyvo clean</div>
        <div className="brand-tagline">We Pick-Clean-Deliver</div>
      </div>

      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-welcome">Join nyvo clean in a few quick steps.</p>

        <div className="field">
          <label>Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ram"
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={emailDraft}
            onChange={(e) => setEmailDraft(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div className="field">
          <label>Mobile number</label>
          <input
            type="tel"
            value={phoneDraft}
            onChange={(e) => setPhoneDraft(e.target.value)}
            placeholder="+91 "
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!name || !emailDraft.includes('@')}
          onClick={() => navigate('/verify-email')}
        >
          Continue
        </button>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="link-blue"
            style={{ fontSize: 15, textDecoration: 'underline' }}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export function VerifyEmail() {
  const navigate = useNavigate()
  const { emailDraft } = useApp()
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <div className="page" style={{ minHeight: '100dvh' }}>
      <div className="page-header">
        <BackButton to="/signup" />
        <div />
        <div />
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
        Verify Your Email Address
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
        We've sent a verification code to the email you provided. Please enter
        the code below.
      </p>

      <p style={{ fontWeight: 700 }}>{emailDraft}</p>
      <button
        type="button"
        className="link-blue caps"
        style={{ margin: '6px 0 24px', alignSelf: 'flex-start' }}
        onClick={() => navigate('/signup')}
      >
        Edit Email Address
      </button>

      <div className="field">
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          inputMode="numeric"
          maxLength={6}
        />
      </div>
      <p
        style={{
          textAlign: 'right',
          fontSize: 13,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          marginTop: -8,
          marginBottom: 28,
        }}
      >
        Resend OTP : 00:{String(seconds).padStart(2, '0')}
      </p>

      <button
        type="button"
        className="btn btn-primary"
        disabled={otp.length < 4}
        onClick={() => navigate('/complete-profile')}
      >
        Signup Account
      </button>

      <button
        type="button"
        className="btn-ghost"
        style={{ marginTop: 20, alignSelf: 'center' }}
        onClick={() => navigate('/complete-profile')}
      >
        Skip
      </button>
    </div>
  )
}
