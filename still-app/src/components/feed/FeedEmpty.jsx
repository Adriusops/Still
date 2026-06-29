import Button from '../ui/Button'
import styles from './FeedEmpty.module.css'

export default function FeedEmpty({ onAddSource }) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>Votre espace de lecture vous attend.</p>
      <Button onClick={onAddSource}>Ajouter une source</Button>
    </div>
  )
}
