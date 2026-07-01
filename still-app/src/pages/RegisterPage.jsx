import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import AuthBackground from '../components/ui/AuthBackground'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [matchError, setMatchError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setMatchError('Les mots de passe ne correspondent pas.')
      return
    }
    setMatchError(null)
    try {
      await register(email, password)
      navigate('/')
    } catch {}
  }

  return (
    <div className={styles.page}>
      <AuthBackground />
      <div className={styles.inner}>
        <img src="/logo-black.png" alt="Still." className={styles.logo} />
        <p className={styles.tagline}>Lisez ce qui compte.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          {(error || matchError) && (
            <p className={styles.error}>{matchError || error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              color: 'var(--color-bg)',
              background: 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '14px var(--space-6)',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Création…' : 'Commencer à lire'}
          </button>
        </form>
        <p className={styles.switch}>
          Déjà un compte ?{' '}
          <Link to="/login" className={styles.switchLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
