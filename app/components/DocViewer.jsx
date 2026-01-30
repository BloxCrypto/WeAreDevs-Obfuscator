'use client'

import { useState, useEffect } from 'react'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/+esm'

export default function DocViewer({ path, onClose }) {
  const [content, setContent] = useState('Loading...')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDoc = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const url = `https://raw.githubusercontent.com/BloxCrypto/WeAreDevs-Obfuscator/master/doc/${path}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Document not found')
        const md = await res.text()
        setContent(md)
      } catch (err) {
        setError('Unable to load document.')
        setContent('')
      } finally {
        setIsLoading(false)
      }
    }
    loadDoc()
  }, [path])

  return (
    <section id="doc-viewer" className="doc-viewer-section">
      <div className="doc-viewer-header">
        <h3>{path.replace(/\//g, ' — ')}</h3>
        <button className="btn outline" onClick={onClose}>Close</button>
      </div>
      <div className="doc-content">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'var(--muted)' }}>{error}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        )}
      </div>
    </section>
  )
}
