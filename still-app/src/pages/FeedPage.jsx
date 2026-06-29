import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
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

  function handleSelectItem(item) {
    setSelectedItem(item)
    setReaderOpen(true)
  }

  function handleCloseReader() {
    setReaderOpen(false)
  }

  async function handleAddSource(url) {
    await addSource(url)
    refresh()
  }

  return (
    <div className={styles.page}>
      <Navbar onAddSource={() => setSheetOpen(true)} hidden={readerOpen} />
      <main className={styles.main}>
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
