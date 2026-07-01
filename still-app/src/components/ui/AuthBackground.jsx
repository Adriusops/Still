import styles from './AuthBackground.module.css'

export default function AuthBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.noise} />
    </div>
  )
}
