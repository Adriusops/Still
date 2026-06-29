import FeedItem from './FeedItem'
import FeedEmpty from './FeedEmpty'
import FeedSkeleton from './FeedSkeleton'
import styles from './Feed.module.css'

export default function Feed({ items, loading, onSelectItem, onAddSource }) {
  if (loading) return <FeedSkeleton />

  if (!items || items.length === 0) {
    return <FeedEmpty onAddSource={onAddSource} />
  }

  return (
    <div className={styles.feed}>
      {items.map(item => (
        <FeedItem key={item.id} item={item} onClick={onSelectItem} />
      ))}
    </div>
  )
}
