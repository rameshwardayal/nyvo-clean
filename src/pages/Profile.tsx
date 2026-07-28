import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { INDIAN_STATES } from '../data/dummy'
import { Check } from 'lucide-react'

export function CompleteProfile() {
  const navigate = useNavigate()
  const { user, updateProfile, emailDraft, phoneDraft } = useApp()
  const [form, setForm] = useState({
    name: user?.name || 'Ram',
    email: user?.email || emailDraft,
    address1: user?.address1 || '',
    address2: user?.address2 || '',
    city: user?.city || '',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '',
    landmark: user?.landmark || '',
    referral: '',
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = () => {
    updateProfile({
      ...form,
      phone: user?.phone || phoneDraft,
    })
    navigate('/profile-success')
  }

  return (
    <div className="page" style={{ paddingBottom: 32 }}>
      <PageHeader title="Complete Profile" />

      {(
        [
          ['name', 'Name', 'Ram'],
          ['email', 'Email', 'ram@email.com'],
          ['address1', 'Address Line 1', 'Eg: Door No, Flat No, Building name or No'],
          ['address2', 'Address Line 2', 'Eg: Street name or No'],
          ['city', 'City', 'Enter City'],
          ['state', 'State', 'Select State'],
          ['pincode', 'Pincode', 'Enter Pincode'],
          ['landmark', 'Landmark', 'Enter Land Mark or Flat No, or other details'],
          ['referral', 'Referral (optional)', 'Enter Refer'],
        ] as const
      ).map(([key, label, placeholder]) => (
        <div className="field" key={key}>
          <label htmlFor={key}>{label}</label>
          {key === 'state' ? (
            <select
              id={key}
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={key}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              inputMode={key === 'pincode' ? 'numeric' : undefined}
            />
          )}
        </div>
      ))}

      <button type="button" className="btn btn-primary" onClick={submit}>
        Save Profile
      </button>
    </div>
  )
}

export function ProfileSuccess() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ minHeight: '100dvh' }}>
      <div className="success-center">
        <div className="success-icon">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
          Congratulations!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
          You've successfully completed your profile.
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('/location')}
      >
        Continue
      </button>
    </div>
  )
}
