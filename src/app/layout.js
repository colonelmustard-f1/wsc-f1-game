// src/app/layout.js
import '../styles/globals.css'

export const metadata = {
  title: 'WSC F1 Game',
  description: 'World Selector\'s Championship F1 Prediction Game',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
