import { motion } from 'framer-motion'
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
    <motion.div
      className={styles.feed}
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {items.map((item) => (
        <FeedItem key={item.id} item={item} onClick={onSelectItem} />
      ))}
    </motion.div>
  )
}
