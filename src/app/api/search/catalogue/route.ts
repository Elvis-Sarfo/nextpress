import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/adapters/prisma-adapter'
import { buildLocalizedPath, buildProductCategoryPath, buildProductPath } from '@/lib/agbon-routes'
import { getProductCategories } from '@/lib/cms'

type CatalogueSearchResult = {
  id: string
  type: 'product' | 'product-category' | 'country' | 'job'
  title: string
  subtitle: string
  description?: string
  href: string
}

function getLocalizedText(value: unknown, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && !Array.isArray(value)) {
    const localized = value as Record<string, unknown>
    const text = localized[locale] ?? localized.en ?? localized.fr ?? localized.zh ?? Object.values(localized)[0]
    return typeof text === 'string' ? text : ''
  }
  return ''
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function scoreMatch(haystacks: string[], query: string): number {
  let score = -1
  for (const haystack of haystacks) {
    const value = haystack.trim().toLowerCase()
    if (!value) continue
    if (value === query) score = Math.max(score, 300)
    else if (value.startsWith(query)) score = Math.max(score, 200)
    else if (value.includes(query)) score = Math.max(score, 100)
  }
  return score
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()
  const locale = (searchParams.get('locale') ?? 'en').trim() || 'en'

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const [products, categories, countries, jobs] = await Promise.all([
    prisma.products.findMany({
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { order: 'asc' },
      take: 200,
    }),
    getProductCategories(),
    prisma.countries.findMany({
      orderBy: { order: 'asc' },
      take: 100,
    }),
    prisma.jobs.findMany({
      orderBy: { order: 'asc' },
      take: 100,
    }),
  ])

  const productResults = products
    .map((product) => {
      const title = getLocalizedText(product.name, locale) || product.slug
      const model = getLocalizedText(product.model, locale)
      const description = stripHtml(getLocalizedText(product.description, locale)).slice(0, 140)
      const categoryName = getLocalizedText(product.category?.name, locale)
      const score = scoreMatch([title, model, description, product.slug, categoryName], query)

      if (score < 0) return null

      return {
        score,
        result: {
          id: product.id,
          type: 'product' as const,
          title,
          subtitle: model || categoryName || 'Product',
          description: description || undefined,
          href: buildProductPath(locale, product.slug),
        },
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  const categoryResults = categories
    .map((category) => {
      const title = getLocalizedText(category.name, locale) || category.slug
      const description = stripHtml(getLocalizedText(category.description, locale)).slice(0, 140)
      const score = scoreMatch([title, description, category.slug], query)

      if (score < 0) return null

      return {
        score,
        result: {
          id: category.id,
          type: 'product-category' as const,
          title,
          subtitle: 'Category',
          description: description || undefined,
          href: buildProductCategoryPath(locale, category.path),
        },
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  const countryResults = countries
    .map((country) => {
      const title = getLocalizedText(country.name, locale) || country.code || 'Country'
      const description = stripHtml(getLocalizedText(country.description, locale)).slice(0, 140)
      const offices = Array.isArray(country.offices) ? country.offices : []
      const officeCities = offices
        .map((office) => {
          if (!office || typeof office !== 'object') return ''
          const city = (office as Record<string, unknown>).city
          return typeof city === 'string' ? city : ''
        })
        .filter(Boolean)
      const score = scoreMatch([title, description, country.code ?? '', ...officeCities], query)

      if (score < 0) return null

      return {
        score,
        result: {
          id: country.id,
          type: 'country' as const,
          title,
          subtitle: officeCities.length > 0 ? officeCities.slice(0, 2).join(', ') : 'Country office',
          description: description || undefined,
          href: buildLocalizedPath(locale, '/contact'),
        },
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  const jobResults = jobs
    .map((job) => {
      const title = getLocalizedText(job.title, locale) || 'Job opening'
      const location = getLocalizedText(job.location, locale)
      const employmentType = getLocalizedText(job.employmentType, locale)
      const description = stripHtml(getLocalizedText(job.description, locale)).slice(0, 140)
      const score = scoreMatch([title, location, employmentType, description], query)

      if (score < 0) return null

      return {
        score,
        result: {
          id: job.id,
          type: 'job' as const,
          title,
          subtitle: [location, employmentType].filter(Boolean).join(' • ') || 'Job opening',
          description: description || undefined,
          href: buildLocalizedPath(locale, '/join-us/recruitment'),
        },
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  const results = [...productResults, ...categoryResults, ...countryResults, ...jobResults]
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .slice(0, 12)
    .map((entry) => entry.result)

  return NextResponse.json({ results })
}
