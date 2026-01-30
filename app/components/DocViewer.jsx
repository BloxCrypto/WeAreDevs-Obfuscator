'use client'

import { useState, useEffect } from 'react'

function parseMarkdown(md) {
  let html = md
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/gm, '<p>')
    .replace(/$/gm, '</p>')
  return html
}

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
        const html = parseMarkdown(md)
        setContent(html)
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
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
    </section>
  )
}
