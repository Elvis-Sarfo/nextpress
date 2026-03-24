# Product Category URL SEO Refactor Note

## Current state

Current product category URLs use a filter query parameter with an internal UUID:

`/en/products?category=573839dd-6794-4f90-8c9f-67cbb0f191e4`

In the current implementation:

- The category filter is read from `searchParams.category` in [src/app/(public)/[locale]/products/page.tsx](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/app/(public)/[locale]/products/page.tsx).
- Navigation pushes the UUID into the URL in [src/contexts/agbon-product-nav-context.tsx](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/contexts/agbon-product-nav-context.tsx).
- Category cards link to the same UUID query format in [src/components/agbon/category-card.tsx](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/components/agbon/category-card.tsx).
- Route helpers also generate category URLs from `categoryId` in [src/lib/agbon-routes.ts](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/lib/agbon-routes.ts).
- Product categories already have a human-readable `slug` in the CMS layer via [src/lib/cms.ts](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/lib/cms.ts).

## SEO issues

- The URL exposes an internal identifier instead of descriptive keywords.
- Query-string filtered pages are weaker landing pages than dedicated path-based category routes.
- All category states currently collapse into the generic products page metadata, so category pages cannot target unique titles, descriptions, canonicals, or structured internal linking.
- Product category pages are not represented in the sitemap today, so discovery depends more heavily on crawl traversal.

## Recommended URL format

Refactor category pages to use a dedicated path segment based on the category slug:

- Preferred: `/en/products/category/tractors`
- Acceptable shorter form: `/en/products/tractors`

I recommend `/products/category/[slug]` because it avoids collisions with the existing product detail route at `/products/[slug]`.

## Why this is better

- The slug adds keyword relevance and improves readability.
- Each category becomes a first-class indexable page.
- The page can have category-specific metadata, headings, and copy.
- The URL remains stable and shareable without exposing internal IDs.
- It aligns better with the existing editorial category pattern already used for posts.

## Refactor approach

### 1. Add a dedicated category route

Create a new route such as:

- `src/app/(public)/[locale]/products/category/[slug]/page.tsx`

That page should:

- Resolve the category with `getProductCategoryBySlug(slug)`.
- Fetch products with `getProducts({ categoryId: category.id })`.
- Render the same `ProductPageShell` and `AgbonProductList`.
- Generate category-specific metadata and canonical URLs.

### 2. Update route helpers to use slug-based paths

Change category path generation in [src/lib/agbon-routes.ts](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/lib/agbon-routes.ts) from `categoryId` to `categorySlug`.

Example target API:

```ts
export function buildProductCategoryPath(locale: string, categorySlug: string): string {
  return buildLocalizedPath(locale, `/products/category/${categorySlug}`)
}
```

### 3. Update navigation components

Replace all `?category=<id>` links and pushes with slug-based route navigation in:

- [src/contexts/agbon-product-nav-context.tsx](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/contexts/agbon-product-nav-context.tsx)
- [src/components/agbon/category-card.tsx](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/components/agbon/category-card.tsx)
- [src/app/api/search/catalogue/route.ts](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/app/api/search/catalogue/route.ts)
- Any sidebar/category CTA components that currently call `setCategory` or build category links from IDs

### 4. Keep query params only for non-canonical filters

Retain query params for transient filter states only, for example:

- `search`
- `featured`
- pagination if needed

That gives a clear separation:

- Canonical category = path segment
- Optional UI refinements = query params

Example:

- Canonical category page: `/en/products/category/tractors`
- Filtered search within category: `/en/products/category/tractors?search=diesel`

### 5. Add category metadata and sitemap entries

Each category route should emit:

- category-specific `title`
- category-specific `description`
- `alternates.canonical`
- locale alternates if category slugs become localized

Also extend [src/app/(public)/sitemap.ts](/Users/user/Documents/Projects/KantaTech/nextpress/nextpress/src/app/(public)/sitemap.ts) to include product category URLs.

## Migration notes

- Support a redirect from `/en/products?category=<uuid>` to the new slug path.
- If the current filter UI still needs an ID internally, map slug to category first on the server, then pass `category.id` into `getProducts`.
- If category slugs are not locale-specific today, that is acceptable for phase one. A later phase can introduce localized category slugs and alternate links.

## Recommended rollout

### Phase 1

- Add `/products/category/[slug]`
- Update link generation to use slug URLs
- Add metadata and sitemap support
- Redirect legacy `?category=<id>` URLs

### Phase 2

- Move category intro copy into CMS for richer landing pages
- Add localized slugs if multilingual SEO is important
- Add category schema/internal-link enhancements

## Conclusion

The current UUID query format works functionally, but it is not a strong SEO URL. The best refactor is to promote product categories into dedicated slug-based routes and reserve query parameters for secondary filters only.
