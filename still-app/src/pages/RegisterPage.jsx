import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import styles from './RegisterPage.module.css'

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
      <div className={styles.left}>
        <div className={styles.brand}>
          <img src="/logo-black.png" alt="Still." className={styles.logo} />
          <p className={styles.claim}>Lisez ce qui compte.<br />Rien de plus.</p>
        </div>
        <ul className={styles.values}>
          <li className={styles.value}>
            <span className={styles.valueIcon}>—</span>
            <span>Pas de compteur de non-lus</span>
          </li>
          <li className={styles.value}>
            <span className={styles.valueIcon}>—</span>
            <span>Pas de notifications non sollicitées</span>
          </li>
          <li className={styles.value}>
            <span className={styles.valueIcon}>—</span>
            <span>Tu ne peux jamais être en retard</span>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        <div className={styles.form_wrap}>
          <h2 className={styles.formTitle}>Créer un compte</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              <Input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Mot de passe</label>
              <Input
                type="password"
                placeholder="6 caractères minimum"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Confirmer le mot de passe</label>
              <Input
                type="password"
                placeholder="Répétez votre mot de passe"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {(error || matchError) && (
              <p className={styles.error}>{matchError || error}</p>
            )}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'Création…' : 'Commencer à lire'}
            </button>
          </form>
          <p className={styles.switch}>
            Déjà un compte ?{' '}
            <Link to="/login" className={styles.switchLink}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
