import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import Sidebar from '../components/layout/Sidebar'
import AddSourceSheet from '../components/sources/AddSourceSheet'
import { useSources } from '../hooks/useSources'
import styles from './SourcesPage.module.css'

export default function SourcesPage() {
  const { sources, loading, addSource, updateSource } = useSources()
  const [sheetOpen, setSheetOpen] = useState(false)

  const active = sources.filter(s => s.status !== 'archived')
  const archived = sources.filter(s => s.status === 'archived')

  return (
    <div className={styles.page}>
      <Sidebar hidden={false} />
      <Navbar onAddSource={() => setSheetOpen(true)} hidden={false} />
      <main className={styles.main}>
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Actives</h2>
            <span className={styles.quota}>{active.length} / 10</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${(active.length / 10) * 100}%` }}
            />
          </div>
          {loading ? (
            <p className={styles.loading}>Chargement…</p>
          ) : active.length === 0 ? (
            <p className={styles.empty}>Aucune source active.</p>
          ) : (
            <ul className={styles.list}>
              {active.map(source => (
                <li key={source.id} className={styles.item}>
                  <div className={styles.info}>
                    <span className={styles.name}>{source.name || source.url}</span>
                    <span className={styles.url}>{source.url}</span>
                  </div>
                  <button
                    className={styles.action}
                    onClick={() => updateSource(source.id, { status: 'archived' })}
                  >
                    Archiver
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {archived.length > 0 && (
          <section className={styles.archivedSection}>
            <h2 className={styles.sectionTitle}>Archivées</h2>
            <ul className={styles.list}>
              {archived.map(source => (
                <li key={source.id} className={styles.item}>
                  <div className={styles.info}>
                    <span className={`${styles.name} ${styles.nameArchived}`}>{source.name || source.url}</span>
                    <span className={styles.url}>{source.url}</span>
                  </div>
                  <button
                    className={styles.action}
                    onClick={() => updateSource(source.id, { status: 'active' })}
                  >
                    Réactiver
                  </button>
                </li>
              ))}
            </ul>
          </section>
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
