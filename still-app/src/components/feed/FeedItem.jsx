import styles from './FeedItem.module.css'

function estimateReadingTime(content) {
  if (!content) return null
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return minutes < 1 ? null : `${minutes} min`
}

function typeLabel(type) {
  const map = { Article: 'Article', Video: 'Vidéo', Episode: 'Podcast' }
  return map[type] || null
}

export default function FeedItem({ item, onClick, index = 0 }) {
  const readingTime = estimateReadingTime(item.content)
  const type = typeLabel(item.type)
  const delay = Math.min(index * 40, 400)

  const meta = [type, readingTime].filter(Boolean).join(' · ')

  return (
    <article
      className={styles.item}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick(item)}
    >
      <div className={styles.content}>
        {item.source_name && (
          <span className={styles.source}>{item.source_name}</span>
        )}
        <h2 className={styles.title}>{item.title}</h2>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>
      {item.image_url && (
        <img
          className={styles.thumbnail}
          src={item.image_url}
          alt=""
          width={80}
          height={80}
        />
      )}
    </article>
  )
}
