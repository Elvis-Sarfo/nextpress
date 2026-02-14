import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { HeroSlides } from './collections/HeroSlides'
import { Countries } from './collections/Countries'
import { Pages } from './collections/Pages'
import { WebsiteConfig } from './collections/WebsiteConfig'
import { ContentBlocks } from './collections/ContentBlocks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default {
  collections: [
    Users,
    Media,
    Products,
    Categories,
    HeroSlides,
    Countries,
    Pages,
    WebsiteConfig,
    ContentBlocks,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: {
    provider: 'postgres',
    url: process.env.DATABASE_URI || '',
  },
  // Add localization support for EN/FR/ZH
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'fr',
        label: 'Français',
      },
      {
        code: 'zh',
        label: '中文',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
}
