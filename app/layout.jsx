export const metadata = {
  title: 'WeAreDevs Obfuscator',
  description: 'Web UI wrapper for WeAreDevs Obfuscator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
