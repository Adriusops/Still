import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import Sidebar from '../components/layout/Sidebar'
import Feed from '../components/feed/Feed'
import Reader from '../components/reader/Reader'
import AddSourceSheet from '../components/sources/AddSourceSheet'
import { useFeed } from '../hooks/useFeed'
import { useSources } from '../hooks/useSources'
import styles from './FeedPage.module.css'

export default function FeedPage() {
  const { items, loading, refresh } = useFeed()
  const { addSource } = useSources()
  const [selectedItem, setSelectedItem] = useState(null)
  const [readerOpen, setReaderOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [feedKey, setFeedKey] = useState(0)
  const [feedVisible, setFeedVisible] = useState(true)

  function handleSelectItem(item) {
    setSelectedItem(item)
    setReaderOpen(true)
    setFeedVisible(false)
  }

  function handleCloseReader() {
    setReaderOpen(false)
    setTimeout(() => {
      setFeedKey(k => k + 1)
      setFeedVisible(true)
    }, 240)
  }

  async function handleAddSource(url) {
    await addSource(url)
    refresh()
  }

  return (
    <div className={styles.page}>
      <Sidebar hidden={readerOpen} />
      <Navbar onAddSource={() => setSheetOpen(true)} hidden={readerOpen} />
      <main key={feedKey} className={styles.main} style={{ visibility: feedVisible ? 'visible' : 'hidden' }}>
        <Feed
          items={items}
          loading={loading}
          onSelectItem={handleSelectItem}
          onAddSource={() => setSheetOpen(true)}
        />
      </main>
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
