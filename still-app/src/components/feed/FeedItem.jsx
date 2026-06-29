import styles from './FeedItem.module.css'

export default function FeedItem({ item, onClick }) {
  return (
    <article className={styles.item} onClick={() => onClick(item)}>
      <div className={styles.content}>
        <span className={styles.source}>{item.source_name}</span>
        <h2 className={styles.title}>{item.title}</h2>
        <span className={styles.meta}>
          {item.duration && `${item.duration} · `}{item.type}
        </span>
      </div>
      {item.thumbnail && (
        <img
          className={styles.thumbnail}
          src={item.thumbnail}
          alt=""
          width={80}
          height={80}
        />
      )}
    </article>
  )
}
