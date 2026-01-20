import './globals.css'

export const metadata = {
  title: 'NGO Registration & Donation System',
  description: 'Manage NGO registrations and donations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
