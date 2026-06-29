import styles from './ReaderHeader.module.css'

export default function ReaderHeader({ onClose }) {
  return (
    <header className={styles.header}>
      <button className={styles.back} onClick={onClose} aria-label="Retour">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M14 4l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </header>
  )
}
