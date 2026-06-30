import { useEffect, useRef } from 'react'
import styles from './ReaderBody.module.css'

export default function ReaderBody({ item }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current || !item) return

    const origin = (() => {
      try { return new URL(item.url).origin } catch { return null }
    })()

    contentRef.current.querySelectorAll('img').forEach(img => {
      if (origin && img.src && !img.src.startsWith('http')) {
        img.src = origin + img.getAttribute('src')
      }
      img.onerror = () => { img.style.display = 'none' }
    })

    contentRef.current.querySelectorAll('a').forEach(a => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      if (!a.querySelector('.ext-arrow')) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        arrow.setAttribute('class', 'ext-arrow')
        arrow.setAttribute('width', '11')
        arrow.setAttribute('height', '11')
        arrow.setAttribute('viewBox', '0 0 11 11')
        arrow.setAttribute('fill', 'none')
        arrow.setAttribute('aria-hidden', 'true')
        arrow.style.cssText = 'display:inline-block;margin-left:3px;vertical-align:middle;position:relative;top:-1px;flex-shrink:0'
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', 'M2 9L9 2M9 2H4M9 2v5')
        path.setAttribute('stroke', 'currentColor')
        path.setAttribute('stroke-width', '1.4')
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')
        arrow.appendChild(path)
        a.appendChild(arrow)
      }
    })
  }, [item])

  if (!item) return null

  const hasContent = item.content && item.content.trim().length > 0

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{item.title}</h1>
      {item.source_name && (
        <p className={styles.source}>{item.source_name}</p>
      )}
      {hasContent ? (
        <div
          ref={contentRef}
          className={`${styles.content} content-body`}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ) : (
        <div className={styles.unavailable}>
          <p className={styles.unavailableText}>
            Ce flux ne partage pas son contenu complet. La lecture se fait directement sur le site.
          </p>
          <a
            className={styles.readLink}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lire sur le site
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
