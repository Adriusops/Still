import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import styles from './AddSourceSheet.module.css'

export default function AddSourceSheet({ open, onClose, onAdd }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onAdd(url.trim())
      setUrl('')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.sheet} ${open ? styles.open : ''}`}>
        <div className={styles.handle} />
        <h2 className={styles.title}>Ajouter une source</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            autoFocus={open}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={loading || !url.trim()}>
            {loading ? 'Ajout…' : 'Ajouter'}
          </Button>
        </form>
      </div>
    </>
  )
}
