'use client'

import { useState } from 'react'

export default function Page() {
  const [inputCode, setInputCode] = useState('-- Paste your Lua code here\nlocal x = 5\nprint(x)')
  const [outputCode, setOutputCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [preset, setPreset] = useState('default')
  const [enableVM, setEnableVM] = useState(false)
  const [enableMinify, setEnableMinify] = useState(false)
  const [language, setLanguage] = useState('lua')

  const handleObfuscate = async () => {
    setIsLoading(true)
    setError('')
    setOutputCode('')

    try {
      const res = await fetch('/api/obfuscate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode, preset, vm: enableVM, minify: enableMinify, language })
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

  const downloadCode = () => {
    if (!outputCode) {
      alert('No obfuscated code to download. Please obfuscate code first.')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `obfuscated_${timestamp}.lua`

    const blob = new Blob([outputCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>LuaForm Obfuscator</h1>
          <p className="tagline">Obfuscate Lua Scripts Online</p>
        </div>
      </header>

      <main className="container">
        <div className="obfuscator-wrapper">
          <div className="editor-section">
            <div className="editor-header">
              <h3>Input Code</h3>
              <div className="options-group">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="preset-select">
                  <option value="lua">Lua</option>
                  <option value="luau">Luau</option>
                </select>
                <select value={preset} onChange={(e) => setPreset(e.target.value)} className="preset-select">
                  <option value="default">Default Preset</option>
                  <option value="light">Light Obfuscation</option>
                  <option value="heavy">Heavy Obfuscation</option>
                </select>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={enableVM}
                    onChange={(e) => setEnableVM(e.target.checked)}
                  />
                  <span>VM</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={enableMinify}
                    onChange={(e) => setEnableMinify(e.target.checked)}
                  />
                  <span>Minify</span>
                </label>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={`Paste your ${language === 'luau' ? 'Luau' : 'Lua'} code here...`}
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
                <div className="output-actions">
                  <button className="btn outline" onClick={copyToClipboard}>
                    Copy
                  </button>
                  <button className="btn outline" onClick={downloadCode}>
                    Download
                  </button>
                </div>
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
          <p>Obfuscate Lua and Luau scripts with presets including VM-transforms, string encryption, constant arrays, and more. The tool applies various obfuscation techniques to make your code harder to reverse-engineer.</p>
          <div className="presets-info">
            <h4>Supported Languages:</h4>
            <ul>
              <li><strong>Lua:</strong> Standard Lua scripting language</li>
              <li><strong>Luau:</strong> Roblox Luau dialect with extended features</li>
            </ul>
            <h4>Available Presets:</h4>
            <ul>
              <li><strong>Default:</strong> Balanced obfuscation with standard transformations</li>
              <li><strong>Light:</strong> Minimal obfuscation for better performance</li>
              <li><strong>Heavy:</strong> Maximum obfuscation with all features enabled</li>
            </ul>
            <h4>Additional Options:</h4>
            <ul>
              <li><strong>VM:</strong> Apply Virtual Machine transformation for advanced obfuscation</li>
              <li><strong>Minify:</strong> Remove comments and minimize code size</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">© LuaForm Obfuscator — <a href="https://github.com/BloxCrypto/WeAreDevs-Obfuscator" target="_blank" rel="noopener noreferrer">GitHub Repository</a></div>
      </footer>
    </>
  )
}
