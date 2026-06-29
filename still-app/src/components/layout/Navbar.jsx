import styles from './Navbar.module.css'

export default function Navbar({ onAddSource, hidden }) {
  return (
    <header className={`${styles.navbar} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.inner}>
        <span className={styles.logo}>Still.</span>
        <button className={styles.addBtn} onClick={onAddSource} aria-label="Ajouter une source">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
