import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Icons'
import { useApp } from '../context/AppContext'

export function SignIn() {
  const navigate = useNavigate()
  const { phoneDraft, setPhoneDraft } = useApp()
  const digits = phoneDraft.replace(/\D/g, '')
  const valid = digits.length >= 12

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
        <h2>Sign In</h2>
        <p className="auth-welcome">Hi! Welcome back, you've been missed.</p>

        <div className="field">
          <label htmlFor="phone">Enter your mobile number</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phoneDraft}
            onChange={(e) => setPhoneDraft(e.target.value)}
            placeholder="+91 "
          />
          <p className="field-hint">
            An OTP will be sent to this number for verification.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!valid}
          onClick={() => navigate('/verify-otp')}
        >
          Get OTP
        </button>

        <div className="auth-footer">
          <p>Don't have an account? Let's fix that!</p>
          <button
            type="button"
            className="link-blue"
            style={{ fontSize: 15, textDecoration: 'underline' }}
            onClick={() => navigate('/signup')}
          >
            Signup Here
          </button>
        </div>
      </div>
    </div>
  )
}
