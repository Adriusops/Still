import styles from './FeedItem.module.css'

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return null }
}

function typeLabel(type) {
  const map = { Article: 'Article', Video: 'Vidéo', Episode: 'Podcast' }
  return map[type] || type
}

function getRelativeDays(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diff === 0) return "aujourd'hui"
  if (diff === 1) return 'hier'
  return `il y a ${diff} j`
}

export default function FeedItem({ item, onClick, index = 0 }) {
  const domain = getDomain(item.url)
  const age = getRelativeDays(item.published_at)
  const imageUrl = item.image_url
  const delay = Math.min(index * 40, 400)

  return (
    <article
      className={styles.item}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick(item)}
    >
      <div className={styles.content}>
        <div className={styles.sourceLine}>
          {domain && (
            <img
              className={styles.favicon}
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
              alt=""
              width={12}
              height={12}
            />
          )}
          {item.source_name && <span className={styles.sourceName}>{item.source_name}</span>}
          {domain && <span className={styles.separator}>·</span>}
          {domain && <span className={styles.domain}>{domain}</span>}
        </div>
        <h2 className={styles.title}>{item.title}</h2>
        <div className={styles.bottomLine}>
          {item.type && <span className={styles.type}>{typeLabel(item.type)}</span>}
          {item.type && age && <span className={styles.separator}>·</span>}
          {age && <span className={styles.age}>{age}</span>}
        </div>
      </div>
      {imageUrl && (
        <img
          className={styles.thumbnail}
          src={imageUrl}
          alt=""
          width={80}
          height={80}
        />
      )}
    </article>
  )
}
