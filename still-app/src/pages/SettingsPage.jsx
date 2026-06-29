import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import SourcesList from '../components/sources/SourcesList'
import AddSourceSheet from '../components/sources/AddSourceSheet'
import { useSources } from '../hooks/useSources'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const { sources, loading, addSource, updateSource } = useSources()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className={styles.page}>
      <Navbar onAddSource={() => setSheetOpen(true)} hidden={false} />
      <main className={styles.main}>
        <h1 className={styles.heading}>Sources</h1>
        {loading ? (
          <p className={styles.loading}>Chargement…</p>
        ) : (
          <SourcesList sources={sources} onUpdate={updateSource} />
        )}
      </main>
      <BottomBar hidden={false} />
      <AddSourceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addSource}
      />
    </div>
  )
}
