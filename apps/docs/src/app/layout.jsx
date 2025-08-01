/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  metadataBase: new URL('https://reviewsup.io'),
  title: {
    template: '%s - reviewsup.io',
  },
  description: 'reviewsup.io is an open-source project for managing reviews in a simple and efficient way.',
  applicationName: 'reviewsup.io',
  generator: 'Next.js',
  appleWebApp: {
    title: 'reviewsup.io',
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://reviewsup.io',
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '1em',
          color: 'inherit',
          textDecoration: 'none'
        }}>
          <img src={'/favicon.ico'} alt="Reviewsup.io Logo" style={{ height: '1.5em', marginRight: '0.5em' }} />
          <b>Reviewsup.io</b>
        </div>
      }
      logoLink={process.env.NEXT_PUBLIC_APP_URL || 'https://reviewsup.io'}
      projectLink={'https://github.com/allenyan513/reviewsup.io'}
    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/allenyan513/reviewsup.io"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
