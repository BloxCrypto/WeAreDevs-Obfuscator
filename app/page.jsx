'use client'

import { useState } from 'react'

export default function Page() {
  const [inputCode, setInputCode] = useState('-- Paste your Lua code here\nlocal x = 5\nprint(x)')
  const [outputCode, setOutputCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [preset, setPreset] = useState('default')

  const handleObfuscate = async () => {
    setIsLoading(true)
    setError('')
    setOutputCode('')

    try {
      const res = await fetch('/api/obfuscate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode, preset })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to obfuscate code')
        return
      }

      setOutputCode(data.obfuscated)
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode)
    alert('Obfuscated code copied to clipboard!')
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>WeAreDevs Obfuscator</h1>
          <p className="tagline">Obfuscate Lua Scripts Online</p>
        </div>
      </header>

      <main className="container">
        <div className="obfuscator-wrapper">
          <div className="editor-section">
            <div className="editor-header">
              <h3>Input Code</h3>
              <select value={preset} onChange={(e) => setPreset(e.target.value)} className="preset-select">
                <option value="default">Default Preset</option>
                <option value="light">Light Obfuscation</option>
                <option value="heavy">Heavy Obfuscation</option>
              </select>
            </div>
            <textarea
              className="code-editor"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your Lua code here..."
            />
          </div>

          <div className="button-section">
            <button
              className="btn obfuscate-btn"
              onClick={handleObfuscate}
              disabled={isLoading}
            >
              {isLoading ? 'Obfuscating...' : '→ Obfuscate →'}
            </button>
          </div>

          <div className="editor-section">
            <div className="editor-header">
              <h3>Obfuscated Code</h3>
              {outputCode && (
                <button className="btn outline" onClick={copyToClipboard}>
                  Copy
                </button>
              )}
            </div>
            <textarea
              className="code-editor output"
              value={outputCode}
              readOnly
              placeholder="Your obfuscated code will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="info-section">
          <h3>About This Tool</h3>
          <p>Obfuscate Lua scripts with presets including VM-transforms, string encryption, constant arrays, and more. The tool applies various obfuscation techniques to make your code harder to reverse-engineer.</p>
          <div className="presets-info">
            <h4>Available Presets:</h4>
            <ul>
              <li><strong>Default:</strong> Balanced obfuscation with standard transformations</li>
              <li><strong>Light:</strong> Minimal obfuscation for better performance</li>
              <li><strong>Heavy:</strong> Maximum obfuscation with all features enabled</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">© WeAreDevs Obfuscator — <a href="https://github.com/BloxCrypto/WeAreDevs-Obfuscator" target="_blank" rel="noopener noreferrer">GitHub Repository</a></div>
      </footer>
    </>
  )
}
