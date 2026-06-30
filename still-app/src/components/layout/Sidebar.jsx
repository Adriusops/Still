import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

export default function Sidebar({ hidden }) {
  return (
    <aside className={`${styles.sidebar} ${hidden ? styles.hidden : ''}`}>
      <NavLink to="/" end className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Feed">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h9M3 15h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </NavLink>
      <NavLink to="/sources" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Sources">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 16V8C5 7 5.9 6 7 6h7C15 6 15.8 6.8 15.8 7.8V16l-5.4-2.8L5 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} aria-label="Paramètres">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M16.2 10c0-.3 0-.6-.1-.9l1.9-1.5-1.8-3.1-2.2.9a6.6 6.6 0 0 0-1.6-.9L12 2H8l-.4 2.5c-.6.2-1.1.5-1.6.9l-2.2-.9L2 7.6l1.9 1.5c-.1.3-.1.6-.1.9s0 .6.1.9L2 12.4l1.8 3.1 2.2-.9c.5.4 1 .7 1.6.9L8 18h4l.4-2.5c.6-.2 1.1-.5 1.6-.9l2.2.9 1.8-3.1-1.9-1.5c.1-.3.1-.6.1-.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </NavLink>
    </aside>
  )
}
