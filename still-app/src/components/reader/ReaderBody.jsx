import styles from './ReaderBody.module.css'

export default function ReaderBody({ item }) {
  if (!item) return null

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{item.title}</h1>
      {item.source_name && (
        <p className={styles.source}>{item.source_name}</p>
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: item.content || '' }}
      />
    </div>
  )
}
