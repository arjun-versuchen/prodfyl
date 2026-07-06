import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'InterviewMaster AI'
const DEFAULT_DESCRIPTION =
  'SQL, PySpark, Spark, Azure Data Factory & Databricks interview questions. Data engineering projects, mock interviews & 530+ curated Q&A.'
const DEFAULT_OG_IMAGE = '/og-image.svg'

interface SEOProps {
  title: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  /** Renders title as "InterviewMaster AI | {title}" instead of "{title} | InterviewMaster AI" */
  brandFirst?: boolean
  /** Homepage-style schema with EducationalOrganization + optional Course */
  educational?: boolean
}

function buildTitle(title: string, brandFirst: boolean): string {
  if (title === SITE_NAME) return title
  return brandFirst ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`
}

function buildJsonLd(siteUrl: string, description: string, educational: boolean) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: siteUrl,
      description,
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/learn/sql?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': educational ? 'EducationalOrganization' : 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      description,
      ...(educational && {
        knowsAbout: [
          'Azure Data Engineering',
          'SQL Interview Questions',
          'PySpark Interview Questions',
          'Azure Data Factory',
          'Azure Databricks',
          'Delta Lake',
          'Data Engineering Projects',
        ],
      }),
    },
  ]

  if (educational) {
    graph.push({
      '@type': 'Course',
      name: 'Azure Data Engineering Interview Preparation',
      description,
      provider: {
        '@type': 'EducationalOrganization',
        name: SITE_NAME,
        url: siteUrl,
      },
      courseMode: 'online',
      isAccessibleForFree: true,
      teaches: 'Data Engineering Interview Preparation',
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  type = 'website',
  noIndex = false,
  brandFirst = false,
  educational = false,
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://prodfyl.com'
  const url = `${siteUrl.replace(/\/$/, '')}${path}`
  const fullTitle = buildTitle(title, brandFirst)
  const jsonLd = buildJsonLd(siteUrl, description, educational)

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
