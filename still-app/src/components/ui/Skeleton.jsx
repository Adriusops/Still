import styles from './Skeleton.module.css'

export default function Skeleton({ width = '100%', height = '16px' }) {
  return <div className={styles.skeleton} style={{ width, height }} />
}
