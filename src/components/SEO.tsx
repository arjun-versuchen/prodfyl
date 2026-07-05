import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'InterviewMaster AI'
const DEFAULT_DESCRIPTION =
  'Premium Data Engineering interview prep platform. SQL live now — PySpark, Spark, Azure, Databricks, and more coming soon.'
const DEFAULT_OG_IMAGE = '/og-image.svg'

interface SEOProps {
  title: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function SEO({ title, description = DEFAULT_DESCRIPTION, path = '', type = 'website', noIndex = false }: SEOProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://interviewmaster.ai'
  const url = `${siteUrl.replace(/\/$/, '')}${path}`
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/learn/sql?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
      },
    ],
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}${DEFAULT_OG_IMAGE}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${DEFAULT_OG_IMAGE}`} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

export { SITE_NAME, DEFAULT_DESCRIPTION }
