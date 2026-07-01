import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import Sidebar from '../components/layout/Sidebar'
import Feed from '../components/feed/Feed'
import Reader from '../components/reader/Reader'
import AddSourceSheet from '../components/sources/AddSourceSheet'
import { useFeed } from '../hooks/useFeed'
import { useSources } from '../hooks/useSources'
import styles from './FeedPage.module.css'

const ease = [0.4, 0, 0.2, 1]

export default function FeedPage() {
  const { items, loading, refresh } = useFeed()
  const { addSource } = useSources()
  const [selectedItem, setSelectedItem] = useState(null)
  const [readerOpen, setReaderOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [feedReveal, setFeedReveal] = useState(0)

  function handleSelectItem(item) {
    setSelectedItem(item)
    setReaderOpen(true)
  }

  function handleCloseReader() {
    setReaderOpen(false)
    setFeedReveal(n => n + 1)
  }

  async function handleAddSource(url) {
    await addSource(url)
    refresh()
  }

  return (
    <div className={styles.page}>
      <Sidebar hidden={readerOpen} />
      <Navbar onAddSource={() => setSheetOpen(true)} hidden={readerOpen} />
      <motion.main
        className={styles.main}
        animate={{ opacity: readerOpen ? 0 : 1 }}
        transition={{ duration: 0.28, ease }}
      >
        <Feed
          key={feedReveal}
          items={items}
          loading={loading}
          onSelectItem={handleSelectItem}
          onAddSource={() => setSheetOpen(true)}
        />
      </motion.main>
      <BottomBar hidden={readerOpen} />
      <Reader item={selectedItem} open={readerOpen} onClose={handleCloseReader} />
      <AddSourceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAddSource}
      />
    </div>
  )
}
