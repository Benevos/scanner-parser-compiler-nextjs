import './globals.scss'
import { Figtree } from 'next/font/google'

const figtree = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'PSBII - Benevos',
  description: 'Listen to music',
  icons: {
    icon: 'UAT-WIN.jpg'
  },
  openGraph: {
    title: 'Compilador Benevos',
    description: 'Compilador del equipo Benevos',
    type: 'website',
    url: 'https://benevos-compiler.vercel.app/',
    siteName: 'Compildor Benevos',
    locale: 'es_MX',
    images: [
      {
        url: 'https://benevos-compiler.vercel.app/UAT-WIN.png',
        width: '800',
        height: '800',
        alt: 'uat-logo.png'
      }
    ]
  }
}

export default function RootLayout({ children }) 
{
  return (
    <html lang="en">
      <body className={figtree.className}>
          {children}
      </body>
    </html>
  )
}
