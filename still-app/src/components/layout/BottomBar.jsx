import { NavLink } from 'react-router-dom'
import styles from './BottomBar.module.css'

export default function BottomBar({ hidden }) {
  return (
    <nav className={`${styles.bar} ${hidden ? styles.hidden : ''}`}>
      <NavLink to="/" end className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Feed">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 6h14M4 11h10M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </NavLink>
      <NavLink to="/sources" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Sources">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M6 17V8.5C6 7.4 6.9 6.5 8 6.5h6.5C15.3 6.5 16 7.2 16 8V17l-5-3-5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Paramètres">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 4v1.5M11 16.5V18M4 11h1.5M16.5 11H18M5.93 5.93l1.06 1.06M14.01 14.01l1.06 1.06M5.93 16.07l1.06-1.06M14.01 7.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </NavLink>
    </nav>
  )
}
