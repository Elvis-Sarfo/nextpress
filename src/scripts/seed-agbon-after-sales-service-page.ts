import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/adapters/prisma-adapter';
import { syncBlocksToDatabase } from '@/lib/block-sync';

const PAGE_DOCUMENT_ID = '7ea39d9c-b264-4c68-b18b-3d11e0bf4184';

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

function buildSections(blockIds: {
  pageBannerId: string;
  serviceAreasId: string;
  networkOverviewId: string;
  partnershipOpportunitiesId: string;
  supportCtaId: string;
}): Prisma.InputJsonValue {
  return [
    {
      id: randomUUID(),
      name: 'After Sales Banner',
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
      name: 'After Sales Service Areas',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.serviceAreasId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'After Sales Network',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.networkOverviewId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'After Sales Partnerships',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.partnershipOpportunitiesId, order: 0 }],
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'After Sales CTA',
      columns: [
        {
          id: randomUUID(),
          width: 'w-full',
          blocks: [{ blockId: blockIds.supportCtaId, order: 0 }],
        },
      ],
    },
  ] as Prisma.InputJsonValue;
}

async function main() {
  const summary = await syncBlocksToDatabase();
  console.log(`Blocks synced: ${summary.created} created, ${summary.updated} updated`);

  const pageBannerId = await upsertBlock({
    name: 'agbon-after-sales-service-banner',
    label: 'After Sales Service Banner',
    content: {
      en: {
        title: 'After Sales Service',
        subTitle: 'Support & Service',
        backgroundImage: '/images/banner/9.png',
      },
    },
  });

  const serviceAreasId = await upsertBlock({
    name: 'agbon-service-areas-section',
    label: 'After Sales Service Areas',
    content: {
      en: {
        title: 'Our Service Areas',
        subtitle: 'Reliable after-sales support across key African markets.',
        backgroundImage: '/images/banner/9.png',
        mapImage: '/african_map.png',
        statLabel: 'Active service coverage',
        emptyMessage: 'No service areas available',
        footerText: "Don't see your country? We're constantly expanding our reach.",
        footerCtaText: 'Contact Us',
        footerCtaLink: '/contact',
        _elements: [
          { name: 'Ghana', flag: '/countries/ghana/symbol.png', officesCount: 5 },
          { name: 'Nigeria', flag: '🇳🇬', officesCount: 12 },
          { name: 'Kenya', flag: '🇰🇪', officesCount: 7 },
          { name: 'Tanzania', flag: '🇹🇿', officesCount: 4 },
          { name: 'Uganda', flag: '🇺🇬', officesCount: 3 },
          { name: 'Côte d’Ivoire', flag: '🇨🇮', officesCount: 6 },
        ],
      },
    },
  });

  const networkOverviewId = await upsertBlock({
    name: 'agbon-network-overview-section',
    label: 'After Sales Network Overview',
    content: {
      en: {
        sectionSubtitle: 'Connections That Matter',
        sectionTitle: 'Our Distribution Network',
        description: 'Empowering farmers across Africa with reliable machinery and unwavering support',
        backgroundImage: '/primary_pattern.webp',
        _elements: [
          { value: '15+', label: 'Active Countries', caption: 'Across Africa' },
          { value: '75+', label: 'Distribution Points', caption: 'Strategic Locations' },
          { value: '24/7', label: 'Customer Support', caption: 'Always Available' },
        ],
      },
    },
  });

  const partnershipOpportunitiesId = await upsertBlock({
    name: 'agbon-partnership-opportunities-section',
    label: 'After Sales Partnership Opportunities',
    content: {
      en: {
        sectionSubtitle: 'Growth Through Collaboration',
        sectionTitle: 'Partnership Opportunities',
        description: 'Join us in transforming African agriculture through strategic collaboration',
        _elements: [
          {
            title: 'Distribution Partners',
            description: 'Expand your portfolio with premium agricultural machinery',
            image: '/images/section/partnership/distro.png',
            fromColor: '#2563eb',
            toColor: '#60a5fa',
          },
          {
            title: 'Financial Partners',
            description: 'Enable farmers with flexible financing solutions',
            image: '/images/section/partnership/financial_institutions.png',
            fromColor: '#9333ea',
            toColor: '#c084fc',
          },
          {
            title: 'Government & NGO Partners',
            description: 'Drive agricultural mechanization initiatives nationwide',
            image: '/images/section/partnership/government_ngo.png',
            fromColor: '#d97706',
            toColor: '#fbbf24',
          },
          {
            title: 'Training & Technical Partners',
            description: 'Empower communities with knowledge and expertise',
            image: '/images/section/partnership/technical_people_2.png',
            fromColor: '#0d9488',
            toColor: '#2dd4bf',
          },
        ],
      },
    },
  });

  const supportCtaId = await upsertBlock({
    name: 'agbon-support-cta-section',
    label: 'After Sales Support CTA',
    content: {
      en: {
        title: 'Interested in Partnering with AGBON?',
        description:
          "We are always looking for strategic partners to expand our reach and better serve farmers across Africa. Let's grow together.",
        ctaText: 'Contact Us',
        ctaLink: '/contact',
        backgroundImage: '/images/section/partnership/plant.png',
        _elements: [
          { label: 'Quick Response' },
          { label: 'Tailored Solutions' },
          { label: 'Proven Track Record' },
        ],
      },
    },
  });

  await prisma.pages.upsert({
    where: {
      documentId_status: { documentId: PAGE_DOCUMENT_ID, status: 'published' },
    },
    update: {
      title: { en: 'After Sales Service' },
      slug: { en: 'after-sales-service' },
      excerpt: { en: 'Support, coverage, and partnership opportunities across Africa.' },
      sections: buildSections({
        pageBannerId,
        serviceAreasId,
        networkOverviewId,
        partnershipOpportunitiesId,
        supportCtaId,
      }),
      createdBy: 'system',
    },
    create: {
      documentId: PAGE_DOCUMENT_ID,
      status: 'published',
      title: { en: 'After Sales Service' },
      slug: { en: 'after-sales-service' },
      excerpt: { en: 'Support, coverage, and partnership opportunities across Africa.' },
      sections: buildSections({
        pageBannerId,
        serviceAreasId,
        networkOverviewId,
        partnershipOpportunitiesId,
        supportCtaId,
      }),
      createdBy: 'system',
    },
  });

  console.log('Seeded /after-sales-service page configuration');
}

main()
  .catch((error) => {
    console.error('Failed to seed AGBON after-sales-service page:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
