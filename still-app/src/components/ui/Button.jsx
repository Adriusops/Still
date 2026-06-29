import styles from './Button.module.css'

export default function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}
