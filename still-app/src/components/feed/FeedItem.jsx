import { useState } from 'react'
import { motion } from 'framer-motion'
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

function faviconUrl(sourceUrl) {
  if (!sourceUrl) return null
  try {
    const { origin } = new URL(sourceUrl)
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`
  } catch {
    return null
  }
}

export default function FeedItem({ item, onClick }) {
  const [tapped, setTapped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const readingTime = estimateReadingTime(item.content)
  const type = typeLabel(item.type)
  const meta = [type, readingTime].filter(Boolean).join(' · ')
  const favicon = faviconUrl(item.source_url)

  function handleClick() {
    setTapped(true)
    setTimeout(() => setTapped(false), 600)
    onClick(item)
  }

  return (
    <motion.article
      className={styles.item}
      onClick={handleClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ x: 0 }}
      transition={{ x: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] } }}
      whileHover={{ x: 3 }}
      whileTap={{ x: 6, transition: { duration: 0.08 } }}
    >
      <div className={styles.content}>
        {item.source_name && (
          <span className={styles.source}>
            {favicon && (
              <motion.img
                src={favicon}
                alt=""
                className={styles.favicon}
                animate={tapped
                  ? { scale: [1, 0.7, 1.15, 1], filter: ['grayscale(0)', 'grayscale(0)', 'grayscale(0)', 'grayscale(0)'] }
                  : { scale: 1, filter: hovered ? 'grayscale(0)' : 'grayscale(1)' }
                }
                transition={{ duration: tapped ? 0.4 : 0.2, ease: 'easeOut' }}
              />
            )}
            {item.source_name}
          </span>
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
    </motion.article>
  )
}
