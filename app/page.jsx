'use client'

import { useState, useEffect } from 'react'
import DocViewer from './components/DocViewer'

export default function Page() {
  const [selectedDoc, setSelectedDoc] = useState(null)

  const handleRunLocal = () => {
    const command = 'python3 -m http.server 8000'
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(command).then(() => {
        alert('Server command copied to clipboard.\nRun it in the /web directory and open http://localhost:8000/')
      }).catch(() => {
        alert(`To run locally:\n1) cd WeAreDevs-Obfuscator/web\n2) ${command}\n3) Open http://localhost:8000/`)
      })
    } else {
      alert(`To run locally:\n1) cd WeAreDevs-Obfuscator/web\n2) ${command}\n3) Open http://localhost:8000/`)
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>WeAreDevs Obfuscator</h1>
          <nav>
            <a href="#about">About</a>
            <a href="#install">Install</a>
            <a href="#usage">Usage</a>
            <a href="#docs">Docs</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Lightweight Lua obfuscation toolkit</h2>
          <p>Obfuscate Lua scripts with presets, VM-transforms, string encryption, and more.</p>
          <div className="actions">
            <a className="btn" href="https://github.com/BloxCrypto/WeAreDevs-Obfuscator/archive/refs/heads/master.zip" target="_blank" rel="noopener noreferrer">
              Download ZIP
            </a>
            <button className="btn outline" onClick={handleRunLocal}>
              Run locally
            </button>
          </div>
        </section>

        <section id="about">
          <h3>About</h3>
          <p>This project provides a set of obfuscation steps focused on Lua: VMification, string encryption, constant arrays, proxified locals, anti-tamper, and more. It's intended for local use via the CLI and as a library.</p>
        </section>

        <section id="install">
          <h3>Install</h3>
          <pre><code>git clone https://github.com/BloxCrypto/WeAreDevs-Obfuscator.git
cd WeAreDevs-Obfuscator
lua cli.lua --help</code></pre>
          <p>Or download the ZIP from GitHub and run with a local Lua runtime.</p>
        </section>

        <section id="usage">
          <h3>Usage</h3>
          <p>Basic CLI example:</p>
          <pre><code>lua cli.lua -i input.lua -o output.lua --preset=default</code></pre>
          <p>See full options in the docs included in the repository.</p>
        </section>

        <section id="docs">
          <h3>Docs</h3>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoc('getting-started/installation.md') }}>Installation guide</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoc('getting-started/obfuscating-your-first-script.md') }}>Obfuscating your first script</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoc('steps/anti-tamper.md') }}>Anti-tamper step</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoc('getting-started/command-line-options.md') }}>Command-line options</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoc('getting-started/presets.md') }}>Presets guide</a></li>
          </ul>
        </section>

        {selectedDoc && <DocViewer path={selectedDoc} onClose={() => setSelectedDoc(null)} />}

        <section id="support">
          <h3>Support</h3>
          <p>Open issues or pull requests on the <a href="https://github.com/BloxCrypto/WeAreDevs-Obfuscator" target="_blank" rel="noopener noreferrer">repository</a> to contribute or get help.</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">© WeAreDevs Obfuscator — <a href="https://github.com/BloxCrypto/WeAreDevs-Obfuscator" target="_blank" rel="noopener noreferrer">Repository</a></div>
      </footer>
    </>
  )
}
