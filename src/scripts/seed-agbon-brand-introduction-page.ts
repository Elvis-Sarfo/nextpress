import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/adapters/prisma-adapter';
import { syncBlocksToDatabase } from '@/lib/block-sync';

const ABOUT_DOCUMENT_ID = '2e9dbcf5-2850-4ca5-91f5-6a9ee6ea66f9';
const PAGE_DOCUMENT_ID = 'd467a6fd-6bb9-4efa-af0b-bc76386fb4c8';

type LocalizedContent = Record<string, Record<string, unknown>>;

type BlockSeed = {
  name: string;
  label: string;
  content: LocalizedContent;
  dataSource?: Prisma.InputJsonValue;
};

async function upsertBlock(seed: BlockSeed): Promise<string> {
  const block = await prisma.blocks.upsert({
    where: { name: seed.name },
    update: {
      label: seed.label,
      content: seed.content as Prisma.InputJsonValue,
      ...(seed.dataSource ? { dataSource: seed.dataSource } : {}),
      status: 'published',
      createdBy: 'system',
    },
    create: {
      name: seed.name,
      label: seed.label,
      content: seed.content as Prisma.InputJsonValue,
      ...(seed.dataSource ? { dataSource: seed.dataSource } : {}),
      status: 'published',
      createdBy: 'system',
    },
  });

  return block.id;
}

async function buildSections(blockIds: {
  pageBannerId: string;
  storyBlockId: string;
  valuesBlockId: string;
  presenceBlockId: string;
  newsBlockId: string;
}): Promise<Prisma.InputJsonValue> {
  return [
    {
      id: randomUUID(),
      name: 'Brand Banner',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.pageBannerId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'Brand Story',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.storyBlockId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'Brand Values',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.valuesBlockId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'Brand Presence',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.presenceBlockId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'Brand News',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.newsBlockId, order: 0 }],
        },
      ],
    },
  ] as Prisma.InputJsonValue;
}

async function main() {
  const summary = await syncBlocksToDatabase();
  console.log(`Blocks synced: ${summary.created} created, ${summary.updated} updated`);

  const aboutPage = await prisma.pages.upsert({
    where: {
      documentId_status: { documentId: ABOUT_DOCUMENT_ID, status: 'published' },
    },
    update: {
      title: { en: 'About AGBON', fr: "A propos d'AGBON" },
      slug: { en: 'about', fr: 'a-propos' },
      excerpt: { en: 'Learn more about AGBON.', fr: "En savoir plus sur AGBON." },
      createdBy: 'system',
    },
    create: {
      documentId: ABOUT_DOCUMENT_ID,
      status: 'published',
      title: { en: 'About AGBON', fr: "A propos d'AGBON" },
      slug: { en: 'about', fr: 'a-propos' },
      excerpt: { en: 'Learn more about AGBON.', fr: "En savoir plus sur AGBON." },
      createdBy: 'system',
    },
  });

  const pageBannerId = await upsertBlock({
    name: 'agbon-brand-introduction-banner',
    label: 'Brand Introduction Banner',
    content: {
      en: {
        title: 'The Agbon Brand',
        subTitle: 'Discover Our Story',
        backgroundImage: '/images/banner/11.png',
      },
    },
  });

  const storyBlockId = await upsertBlock({
    name: 'agbon-brand-story-section',
    label: 'Brand Introduction Story',
    content: {
      en: {
        sectionSubtitle: 'Our Story',
        sectionTitle: 'Who We Are',
        iconSrc: '/icons/agric.png',
        paragraphOne:
          'AGBON is a pioneering agricultural machinery company dedicated to revolutionizing farming practices across Africa. With over two decades of experience, we have established ourselves as a trusted partner for farmers seeking reliable, efficient, and affordable agricultural equipment.',
        paragraphTwo:
          'Our mission is to empower farmers with cutting-edge technology that enhances productivity, reduces manual labor, and promotes sustainable farming practices. We believe that modern machinery should be accessible to farmers of all scales, from smallholders to large commercial operations.',
        autoPlayMs: 4000,
        _elements: [
          { kind: 'highlight', label: 'Founded', value: '2001' },
          { kind: 'highlight', label: 'Headquarters', value: 'China' },
          { kind: 'slide', image: '/images/section/about/office.png', alt: 'AGBON office' },
          { kind: 'slide', image: '/images/section/about/workshop.png', alt: 'AGBON workshop' },
          {
            kind: 'slide',
            image: '/images/section/farmer_field.png',
            alt: 'AGBON machinery in the field',
          },
        ],
      },
    },
  });

  const valuesBlockId = await upsertBlock({
    name: 'agbon-brand-values-section',
    label: 'Brand Introduction Values',
    content: {
      en: {
        sectionSubtitle: 'What Drives Us',
        sectionTitle: 'Our Core Values',
        description:
          'The principles that guide every decision we make and every product we deliver',
        iconSrc: '/icons/agric.png',
        _elements: [
          {
            title: 'Transform Agriculture',
            description: 'Modernizing farming practices across Africa',
            icon: 'sparkles',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
          {
            title: 'Innovation & Impact',
            description: 'Cutting-edge solutions for real-world agricultural challenges',
            icon: 'award',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
          {
            title: 'Collaborative Culture',
            description: 'Work with passionate, mission-driven individuals',
            icon: 'users',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
        ],
      },
    },
  });

  const presenceBlockId = await upsertBlock({
    name: 'agbon-brand-presence-section',
    label: 'Brand Introduction Presence',
    content: {
      en: {
        badge: 'Continental Impact',
        title: 'Our Global Presence',
        description:
          'From West Africa to East Africa, AGBON machines are empowering farmers and transforming agriculture across the continent',
        watermarkImage: '/african_map.png',
        regionsTitle: 'Key Operating Regions',
        regionOne: 'West Africa',
        regionTwo: 'East Africa',
        regionThree: 'Central Africa',
        _elements: [
          { value: '8+', label: 'African Countries', icon: 'globe' },
          { value: '50K+', label: 'Happy Farmers', icon: 'users' },
          { value: '120+', label: 'Dealer Network', icon: 'mapPin' },
          { value: '24/7', label: 'Support Available', icon: 'award' },
        ],
      },
    },
  });

  const newsBlockId = await upsertBlock({
    name: 'agbon-news-section',
    label: 'Brand Introduction News',
    content: {
      en: {
        title: 'Latest News & Articles',
        subtitle: 'From The Blog Post',
        itemsPerPage: 3,
      },
    },
    dataSource: {
      collection: 'posts',
      limit: 3,
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
    } as Prisma.InputJsonValue,
  });

  await prisma.pages.upsert({
    where: {
      documentId_status: { documentId: PAGE_DOCUMENT_ID, status: 'published' },
    },
    update: {
      title: { en: 'The Agbon Brand', fr: 'La marque AGBON' },
      slug: { en: 'brand-introduction', fr: 'presentation-de-la-marque' },
      excerpt: {
        en: 'Discover the AGBON brand story and continental presence.',
        fr: "Decouvrez l'histoire de la marque AGBON et sa presence continentale.",
      },
      parentId: aboutPage.id,
      sections: await buildSections({
        pageBannerId,
        storyBlockId,
        valuesBlockId,
        presenceBlockId,
        newsBlockId,
      }),
      createdBy: 'system',
    },
    create: {
      documentId: PAGE_DOCUMENT_ID,
      status: 'published',
      title: { en: 'The Agbon Brand', fr: 'La marque AGBON' },
      slug: { en: 'brand-introduction', fr: 'presentation-de-la-marque' },
      excerpt: {
        en: 'Discover the AGBON brand story and continental presence.',
        fr: "Decouvrez l'histoire de la marque AGBON et sa presence continentale.",
      },
      parentId: aboutPage.id,
      sections: await buildSections({
        pageBannerId,
        storyBlockId,
        valuesBlockId,
        presenceBlockId,
        newsBlockId,
      }),
      createdBy: 'system',
    },
  });

  console.log('Seeded /about/brand-introduction and /a-propos/presentation-de-la-marque page configuration');
}

main()
  .catch((error) => {
    console.error('Failed to seed AGBON brand introduction page:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
