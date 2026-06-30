import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import Sidebar from '../components/layout/Sidebar'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <Sidebar hidden={false} />
      <Navbar hidden={false} />
      <main className={styles.main}>
        <section>
          <h2 className={styles.sectionTitle}>Compte</h2>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user?.email || '—'}</span>
          </div>
        </section>
        <section className={styles.section}>
          <Button variant="ghost" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </section>
      </main>
      <BottomBar hidden={false} />
    </div>
  )
}
