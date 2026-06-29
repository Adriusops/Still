import styles from './SourcesList.module.css'

export default function SourcesList({ sources, onUpdate }) {
  return (
    <ul className={styles.list}>
      {sources.map(source => (
        <li key={source.id} className={styles.item}>
          <div className={styles.info}>
            <span className={styles.name}>{source.name || source.url}</span>
            {source.url && source.name && (
              <span className={styles.url}>{source.url}</span>
            )}
          </div>
          <button
            className={`${styles.toggle} ${source.archived ? styles.archived : ''}`}
            onClick={() => onUpdate(source.id, { archived: !source.archived })}
          >
            {source.archived ? 'Réactiver' : 'Archiver'}
          </button>
        </li>
      ))}
    </ul>
  )
}
