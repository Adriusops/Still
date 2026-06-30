import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch {
      // error est exposé via useAuth
    }
  }

  return (
    <div className={styles.page}>
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
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
        <p className={styles.switch}>
          Pas encore de compte ?{' '}
          <Link to="/register" className={styles.switchLink}>S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
