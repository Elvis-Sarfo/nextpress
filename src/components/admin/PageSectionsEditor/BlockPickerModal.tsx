'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Grid3X3, LayoutTemplate, Loader2, RotateCcw, Search, SquareStack, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSurfaceHeader } from '@/components/admin/AdminSurfaceHeader';
import { getBlockComponent } from '@/core/blocks/registry';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';

interface BlockDoc {
  id: string;
  name: string;
  label?: string;
  contentDefinition?: {
    content?: Array<{ name: string; type: string }>;
    elements?: { label?: string; fields?: Array<{ name: string; type: string }> };
  } | null;
}

interface BlockPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blockId: string) => void;
}

type PreviewKind =
  | 'banner'
  | 'form'
  | 'stats'
  | 'cards'
  | 'list'
  | 'split'
  | 'testimonial'
  | 'generic';

type PickerFilter = 'all' | PreviewKind;

export function BlockPickerModal({ open, onClose, onSelect }: BlockPickerModalProps) {
  const [blocks, setBlocks] = useState<BlockDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PickerFilter>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/admin/collections/blocks?limit=200')
      .then((r) => r.json())
      .then((data) => setBlocks((data.docs as BlockDoc[]) ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function getPreviewKind(block: BlockDoc): PreviewKind {
    const value = `${block.name} ${block.label ?? ''}`.toLowerCase();

    if (value.includes('banner') || value.includes('hero')) return 'banner';
    if (value.includes('contact') || value.includes('form')) return 'form';
    if (value.includes('stats')) return 'stats';
    if (value.includes('testimonial')) return 'testimonial';
    if (
      value.includes('list') ||
      value.includes('product') ||
      value.includes('news') ||
      value.includes('service-areas')
    ) {
      return 'list';
    }
    if (
      value.includes('values') ||
      value.includes('feature') ||
      value.includes('partnership') ||
      value.includes('opportunities')
    ) {
      return 'cards';
    }
    if (
      value.includes('story') ||
      value.includes('presence') ||
      value.includes('overview') ||
      value.includes('cta') ||
      value.includes('commitment') ||
      value.includes('farming')
    ) {
      return 'split';
    }

    return 'generic';
  }

  const filtered = blocks.filter((block) => {
    const matchesQuery =
      query.trim().length === 0 ||
      block.name.toLowerCase().includes(query.toLowerCase()) ||
      (block.label?.toLowerCase().includes(query.toLowerCase()) ?? false);

    if (!matchesQuery) return false;

    return activeFilter === 'all' ? true : getPreviewKind(block) === activeFilter;
  });

  const filters: Array<{ value: PickerFilter; label: string }> = [
    { value: 'all', label: 'All blocks' },
    { value: 'banner', label: 'Banners' },
    { value: 'cards', label: 'Cards' },
    { value: 'list', label: 'Lists' },
    { value: 'split', label: 'Split' },
    { value: 'form', label: 'Forms' },
    { value: 'stats', label: 'Stats' },
    { value: 'testimonial', label: 'Testimonials' },
    { value: 'generic', label: 'Generic' },
  ];

  function getElementFieldCount(block: BlockDoc) {
    return block.contentDefinition?.elements?.fields?.length ?? 0;
  }

  function PreviewChrome({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border ${
          tone === 'dark'
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,53,0.18),transparent_40%)]" />
        <div className="relative p-3">{children}</div>
      </div>
    );
  }

  function buildPreviewContent(block: BlockDoc): Record<string, unknown> {
    const name = block.name;

    if (name.includes('banner')) {
      return {
        title: block.label ?? 'Page Banner',
        subTitle: 'Preview',
        backgroundImage: '/images/banner/11.png',
      };
    }

    if (name === 'agbon-brand-story-section') {
      return {
        sectionSubtitle: 'Our Story',
        sectionTitle: 'Who We Are',
        iconSrc: '/icons/agric.png',
        paragraphOne: 'AGBON supports farmers with reliable equipment and practical expertise.',
        paragraphTwo: 'This preview uses the actual block component with sample content.',
        _elements: [
          { kind: 'highlight', label: 'Founded', value: '2001' },
          { kind: 'highlight', label: 'Reach', value: 'Africa' },
          { kind: 'slide', image: '/images/section/about/office.png', alt: 'Office' },
          { kind: 'slide', image: '/images/section/about/workshop.png', alt: 'Workshop' },
        ],
      };
    }

    if (name === 'agbon-brand-values-section') {
      return {
        sectionSubtitle: 'What Drives Us',
        sectionTitle: 'Our Core Values',
        description: 'Three cards with the real component styling.',
        _elements: [
          {
            title: 'Innovation',
            description: 'Practical machinery solutions.',
            icon: 'sparkles',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
          {
            title: 'Quality',
            description: 'Reliable support and delivery.',
            icon: 'award',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
          {
            title: 'Partnership',
            description: 'Built for long-term growth.',
            icon: 'users',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: '[#FF6B35]',
            gradientTo: '[#E55A24]',
            overlayFrom: 'orange-900',
            textAccentColor: 'orange-100',
          },
        ],
      };
    }

    if (name === 'agbon-brand-presence-section') {
      return {
        badge: 'Continental Impact',
        title: 'Our Global Presence',
        description: 'A real preview of the presence section.',
        watermarkImage: '/african_map.png',
        regionsTitle: 'Regions',
        regionOne: 'West Africa',
        regionTwo: 'East Africa',
        regionThree: 'Central Africa',
        _elements: [
          { value: '8+', label: 'Countries', icon: 'globe' },
          { value: '50K+', label: 'Farmers', icon: 'users' },
          { value: '24/7', label: 'Support', icon: 'award' },
        ],
      };
    }

    if (name === 'agbon-service-areas-section') {
      return {
        title: 'Our Service Areas',
        subtitle: 'Configured with the actual service area UI.',
        backgroundImage: '/images/banner/9.png',
        mapImage: '/african_map.png',
        statLabel: 'Coverage',
        footerText: 'Expanding across key markets.',
        footerCtaText: 'Contact',
        footerCtaLink: '/contact',
        _elements: [
          { name: 'Ghana', flag: '🇬🇭', officesCount: 5 },
          { name: 'Nigeria', flag: '🇳🇬', officesCount: 12 },
          { name: 'Kenya', flag: '🇰🇪', officesCount: 7 },
        ],
      };
    }

    if (name === 'agbon-business-map-image') {
      return {
        badgeText: 'Our Global Presence',
        title: 'Expanding Across Africa',
        description:
          'Building partnerships and delivering quality agricultural equipment to farmers in 8+ countries',
        mapImageSrc: '/african_map.png',
        mapImageAlt: 'AGBON business map',
        countriesLabel: 'Countries',
        officesLabel: 'Offices',
        growthValue: '100%',
        growthLabel: 'Growth',
        activeMarketsLabel: 'Active Markets',
        expandingLabel: 'Expanding',
        mapCardOffsetTop: '11rem',
        markerOneTop: '25%',
        markerOneLeft: '48%',
        markerOneDelay: '0s',
        markerTwoTop: '35%',
        markerTwoLeft: '42%',
        markerTwoDelay: '0.2s',
        markerThreeTop: '45%',
        markerThreeLeft: '52%',
        markerThreeDelay: '0.4s',
        markerFourTop: '55%',
        markerFourLeft: '58%',
        markerFourDelay: '0.6s',
        markerFiveTop: '70%',
        markerFiveLeft: '48%',
        markerFiveDelay: '0.8s',
        markerSixTop: '38%',
        markerSixLeft: '65%',
        markerSixDelay: '1s',
        _elements: [
          { name: 'Ghana', officesCount: 5 },
          { name: 'Nigeria', officesCount: 12 },
          { name: 'Kenya', officesCount: 7 },
          { name: 'Tanzania', officesCount: 4 },
        ],
      };
    }

    if (name === 'agbon-countries-section') {
      return {
        subTitle: 'Our Global Presence',
        title: 'Our Service Areas',
        showSearch: true,
        searchPlaceholder: 'Search countries, cities...',
        searchNoResultsTemplate: 'No countries found matching "{query}"',
        noResultsMessage: 'No countries found',
        emptyMessage: 'No service areas available',
        officesHeading: 'Contact Our Offices',
        headquartersBadgeLabel: 'HQ',
        moreOfficesTemplate: '+{count} more offices',
        columns: '2',
        _elements: [
          {
            name: 'Ghana',
            flag: '🇬🇭',
            color: '#FF6B35',
            backgroundImage: '/images/banner/9.png',
            officesJson: JSON.stringify([
              { city: 'Accra', phone: '+233 20 000 0000', email: 'accra@agbon.com', type: 'headquarters' },
              { city: 'Kumasi', phone: '+233 24 000 0000', email: 'kumasi@agbon.com', type: 'regional' },
            ]),
          },
          {
            name: 'Kenya',
            flag: '🇰🇪',
            color: '#E55A24',
            backgroundImage: '/images/banner/11.png',
            officesJson: JSON.stringify([
              { city: 'Nairobi', phone: '+254 700 000 000', email: 'nairobi@agbon.com', type: 'headquarters' },
              { city: 'Mombasa', phone: '+254 711 000 000', email: 'mombasa@agbon.com', type: 'regional' },
            ]),
          },
        ],
      };
    }

    if (name === 'agbon-recruitment-why-join') {
      return {
        subTitle: 'Work with us',
        title: 'Why Work at AGBON?',
        leadText: "Join a team that's transforming agriculture and creating lasting impact across Africa",
        bodyHtml:
          "<p>At AGBON, we are more than just an <strong style='color:#FF6B35'>agricultural machinery company</strong>. We are a team of passionate individuals dedicated to <strong style='color:#FF6B35'>transforming the lives of farmers</strong> across Africa.</p><p>When you join AGBON, you become part of a <strong style='color:#FF6B35'>movement</strong> that is <strong>modernizing agriculture</strong>, creating jobs, and contributing to <strong>food security</strong> on the continent.</p>",
        imageSrc: '/images/section/recruitment/technician.png',
        imageAlt: 'AGBON technician',
        badgeOne: 'Empowering Farmers',
        badgeTwo: 'Growing Together',
        iconSrc: '/icons/agric.png',
      };
    }

    if (name === 'agbon-recruitment-benefits') {
      return {
        subTitle: 'What is in it for you?',
        title: 'Employee Benefits',
        description:
          'Join AGBON and enjoy a comprehensive package designed to support your growth and well-being',
        iconSrc: '/icons/agric.png',
        _elements: [
          {
            title: 'Competitive Salary',
            description: 'Assurance of a competitive salary package.',
            icon: 'award',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: 'red-600',
            gradientTo: 'red-400',
            overlayFrom: 'red-900',
            textAccentColor: 'red-100',
          },
          {
            title: 'Professional Growth',
            description: 'Training programs and workshops to enhance your skills.',
            icon: 'trendingUp',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: 'blue-600',
            gradientTo: 'blue-400',
            overlayFrom: 'blue-900',
            textAccentColor: 'blue-100',
          },
          {
            title: 'Impactful Work',
            description: "Transform agriculture and improve farmers' livelihoods.",
            icon: 'globe',
            backgroundImage: '/primary_pattern.webp',
            gradientFrom: 'rose-600',
            gradientTo: 'rose-400',
            overlayFrom: 'rose-900',
            textAccentColor: 'rose-100',
          },
        ],
      };
    }

    if (name === 'agbon-recruitment-current-openings') {
      return {
        subTitle: 'Find a job that suits you',
        title: 'Current Job Openings',
        iconSrc: '/icons/agric.png',
        requirementsHeading: 'Requirements:',
        applyButtonLabel: 'Apply Now',
        applyButtonLink: '/contact',
        emptyMessage: 'There are no open roles at the moment.',
      };
    }

    if (name === 'agbon-recruitment-application-process') {
      return {
        title: 'Application Process',
        _elements: [
          { title: 'Submit Application', description: 'Send your CV to our recruitment team.' },
          { title: 'Initial Screening', description: 'Our HR team reviews shortlisted candidates.' },
          { title: 'Interview', description: 'Meet hiring managers and team members.' },
          { title: 'Job Offer', description: 'Successful candidates receive an offer.' },
        ],
      };
    }

    if (name === 'agbon-recruitment-cta') {
      return {
        title: "Don't See the Right Role?",
        description:
          "We are always looking for talented individuals to join our team.<br />Send us your CV and we'll keep you in mind for future opportunities.",
        ctaText: 'Send Your CV',
        ctaLink: '/contact',
        backgroundImage: '/images/section/recruitment/cta-bg.png',
        backgroundImageAlt: 'Join our team',
      };
    }

    if (name === 'agbon-network-overview-section') {
      return {
        sectionSubtitle: 'Connections That Matter',
        sectionTitle: 'Our Distribution Network',
        description: 'Real component preview with sample stats.',
        backgroundImage: '/primary_pattern.webp',
        _elements: [
          { value: '15+', label: 'Countries', caption: 'Across Africa' },
          { value: '75+', label: 'Partners', caption: 'Strategic Locations' },
          { value: '24/7', label: 'Support', caption: 'Always Available' },
        ],
      };
    }

    if (name === 'agbon-partnership-opportunities-section') {
      return {
        sectionSubtitle: 'Growth Through Collaboration',
        sectionTitle: 'Partnership Opportunities',
        description: 'Actual card grid preview.',
        _elements: [
          {
            title: 'Distribution Partners',
            description: 'Expand your machinery portfolio',
            image: '/images/section/partnership/distro.png',
            fromColor: '#2563eb',
            toColor: '#60a5fa',
          },
          {
            title: 'Financial Partners',
            description: 'Flexible financing support',
            image: '/images/section/partnership/financial_institutions.png',
            fromColor: '#9333ea',
            toColor: '#c084fc',
          },
        ],
      };
    }

    if (name === 'agbon-support-cta-section') {
      return {
        title: 'Interested in Partnering with AGBON?',
        description: 'This preview renders the actual CTA block.',
        ctaText: 'Contact Us',
        ctaLink: '/contact',
        backgroundImage: '/images/section/partnership/plant.png',
        _elements: [{ label: 'Quick Response' }, { label: 'Tailored Solutions' }],
      };
    }

    if (name === 'agbon-contact-form') {
      return {
        formTitle: 'Send a message',
        submitLabel: 'Send',
        _elements: [
          { label: 'General Inquiry', value: 'general' },
          { label: 'Support', value: 'support' },
        ],
      };
    }

    if (name === 'agbon-contact-info') {
      return {
        badge: 'Get in touch',
        title: 'Contact Our Team',
        description: 'Ask about products, service, or partnerships.',
        email: 'info@agbon.com',
        phone: '+233 20 000 0000',
        address: 'Industrial Park, Zone A',
      };
    }

    if (name === 'agbon-home-feature-cards') {
      return {
        _elements: [
          {
            image: '/images/section/home.png',
            title: 'Premium Equipment',
            description: 'Real card preview.',
            ctaText: 'Explore',
            ctaLink: '/products',
          },
          {
            image: '/images/section/generator.png',
            title: 'Reliable Support',
            description: 'Configured from the block picker.',
            ctaText: 'Learn more',
            ctaLink: '/contact',
          },
        ],
      };
    }

    if (name === 'agbon-stats-bar') {
      return {
        backgroundImage: '/images/section/light_gen.png',
        _elements: [
          { icon: 'globe', value: '50+', label: 'Countries' },
          { icon: 'award', value: '20+', label: 'Years' },
          { icon: 'users', value: '10K+', label: 'Clients' },
        ],
      };
    }

    if (name === 'agbon-testimonial-stats-section') {
      return {
        badge: 'Trusted by clients',
        title: 'A word from our partners',
        quote: 'The real block component preview is much easier to recognize.',
        name: 'AGBON Client',
        position: 'Partner',
        rating: 5,
        mainImage: '/images/testimonials/home_2.png',
      };
    }

    if (name === 'agbon-testimonials-section') {
      return {
        title: 'What Our Customers Say',
        subtitle: 'Actual block preview',
        footerText: 'Join satisfied customers',
        footerCtaText: 'Get Started',
        footerCtaLink: '/contact',
        _elements: [
          {
            name: 'Kwame Mensah',
            role: 'Farm Owner',
            company: 'Golden Harvest Farms',
            image: '/placeholder-user.jpg',
            rating: 5,
            quote: 'Reliable machinery and strong support.',
            country: 'Ghana',
          },
        ],
      };
    }

    if (name === 'primary-hero-section') {
      return {
        _elements: [
          {
            title: 'Agricultural Machinery',
            subtitle: 'Built for growth',
            imageUrl: '/images/banner/1.png',
            mobileImageUrl: '/images/banner/1.png',
            ctaText: 'Explore',
            ctaLink: '/products',
            desktopAlignment: 'center',
            desktopVerticalPosition: 'center',
            mobileAlignment: 'center',
            mobileVerticalPosition: 'center',
            textColor: 'white',
            overlayOpacity: 35,
          },
        ],
      };
    }

    return {};
  }

  function buildPreviewData(block: BlockDoc): unknown[] | undefined {
    const name = block.name;

    if (name === 'agbon-news-section') {
      return [
        {
          id: 'preview-post-1',
          title: { en: 'AGBON expands support network' },
          slug: { en: 'agbon-expands-support-network' },
          excerpt: { en: 'Sample post data for the real news block preview.' },
          featuredImage: { url: '/images/news/image1.png' },
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
        {
          id: 'preview-post-2',
          title: { en: 'New machinery solutions launched' },
          slug: { en: 'new-machinery-solutions-launched' },
          excerpt: { en: 'Another sample post for the block picker preview.' },
          featuredImage: { url: '/images/news/image2.png' },
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
      ];
    }

    if (name === 'agbon-featured-products' || name === 'agbon-product-list') {
      return [
        {
          id: 'preview-product-1',
          name: { en: 'Mini Tiller' },
          model: { en: 'MT-120' },
          slug: 'mini-tiller',
          category: {
            id: 'preview-category-1',
            name: { en: 'Tillers' },
            slug: 'tillers',
          },
          categoryId: 'preview-category-1',
          price: 1200,
          featured: true,
          media: [{ url: '/red-diesel-mini-tiller-agricultural-machine.jpg', isCover: true }],
          specifications: { en: '<p>Compact tiller for small farms.</p>' },
          shortDescription: { en: 'Compact and powerful.' },
          description: { en: 'Compact and powerful.' },
          instructions: null,
          inStock: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'preview-product-2',
          name: { en: 'Field Tractor' },
          model: { en: 'FT-540' },
          slug: 'field-tractor',
          category: {
            id: 'preview-category-2',
            name: { en: 'Tractors' },
            slug: 'tractors',
          },
          categoryId: 'preview-category-2',
          price: 5400,
          featured: true,
          media: [{ url: '/agricultural-tractor-machinery.jpg', isCover: true }],
          specifications: { en: '<p>Heavy-duty tractor for commercial farms.</p>' },
          shortDescription: { en: 'Built for commercial farms.' },
          description: { en: 'Built for commercial farms.' },
          instructions: null,
          inStock: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    if (name === 'product-category-sidebar') {
      return [
        {
          id: 'preview-cat-1',
          name: { en: 'Tractors' },
          slug: 'tractors',
          imageUrl: '/agricultural-tractor-machinery.jpg',
        },
        {
          id: 'preview-cat-2',
          name: { en: 'Generators' },
          slug: 'generators',
          imageUrl: '/images/section/generator.png',
        },
      ];
    }

    if (name === 'agbon-recruitment-current-openings') {
      return [
        {
          id: 'preview-job-1',
          title: 'Agricultural Machinery Sales Representative',
          location: 'Accra, Ghana',
          employmentType: 'Full-time',
          salary: 'Competitive',
          description: 'Promote and sell AGBON machinery to farmers and distributors.',
          requirements: [
            { value: '3+ years of sales experience in the agricultural sector' },
            { value: 'Strong communication and negotiation skills' },
          ],
          applyLabel: 'Apply Now',
          applyLink: '/contact',
        },
        {
          id: 'preview-job-2',
          title: 'Field Service Technician',
          location: 'Lagos, Nigeria',
          employmentType: 'Full-time',
          salary: 'Competitive',
          description: 'Provide on-site maintenance, repairs, and technical support.',
          requirements: [
            { value: 'Diploma or degree in Mechanical Engineering' },
            { value: '2+ years experience in machinery maintenance' },
          ],
          applyLabel: 'Apply Now',
          applyLink: '/contact',
        },
      ];
    }

    return undefined;
  }

  function BlockPreviewFallback({ block }: { block: BlockDoc }) {
    const kind = getPreviewKind(block);
    const contentCount = block.contentDefinition?.content?.length ?? 0;
    const elementCount = block.contentDefinition?.elements?.fields?.length ?? 0;

    if (kind === 'banner') {
      return (
        <PreviewChrome tone="dark">
          <div className="space-y-2">
            <div className="h-16 rounded-md bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" />
            <div className="space-y-1">
              <div className="h-2 w-20 rounded bg-orange-200/70" />
              <div className="h-3 w-32 rounded bg-white/90" />
              <div className="h-2 w-24 rounded bg-white/50" />
            </div>
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'form') {
      return (
        <PreviewChrome>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 h-3 w-24 rounded bg-slate-900/85" />
            <div className="h-8 rounded border bg-slate-50" />
            <div className="h-8 rounded border bg-slate-50" />
            <div className="col-span-2 h-8 rounded border bg-slate-50" />
            <div className="col-span-2 h-12 rounded border bg-slate-50" />
            <div className="col-span-2 h-8 w-20 rounded bg-slate-900" />
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'stats') {
      return (
        <PreviewChrome tone="dark">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-md border border-white/10 bg-white/10 p-2 text-center">
                <div className="mx-auto mb-1 h-3 w-6 rounded bg-orange-300" />
                <div className="mx-auto h-2 w-10 rounded bg-white/80" />
              </div>
            ))}
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'testimonial') {
      return (
        <PreviewChrome>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-md border bg-slate-50 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-300" />
                  <div className="h-2 w-12 rounded bg-slate-700/80" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded bg-slate-300" />
                  <div className="h-2 w-4/5 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'cards') {
      return (
        <PreviewChrome>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-md"
                style={{
                  background:
                    index === 0
                      ? 'linear-gradient(135deg, #ff6b35, #e55a24)'
                      : index === 1
                        ? 'linear-gradient(135deg, #0f766e, #2dd4bf)'
                        : 'linear-gradient(135deg, #2563eb, #60a5fa)',
                }}
              />
            ))}
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'list') {
      return (
        <PreviewChrome>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 rounded-md border bg-slate-50 p-2">
                <div className="h-9 w-11 rounded bg-slate-300" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="h-2 w-24 rounded bg-slate-700/80" />
                  <div className="h-2 w-16 rounded bg-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </PreviewChrome>
      );
    }

    if (kind === 'split') {
      return (
        <PreviewChrome>
          <div className="grid grid-cols-[1.1fr_.9fr] gap-2">
            <div className="space-y-2 rounded-md bg-slate-50 p-2">
              <div className="h-2 w-14 rounded bg-orange-400/90" />
              <div className="h-3 w-24 rounded bg-slate-900/85" />
              <div className="h-2 rounded bg-slate-300" />
              <div className="h-2 w-4/5 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-slate-900" />
            </div>
            <div className="rounded-md bg-gradient-to-br from-slate-200 to-slate-300" />
          </div>
        </PreviewChrome>
      );
    }

    return (
      <PreviewChrome>
        <div className="flex h-[88px] flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <LayoutTemplate className="h-4 w-4" />
            <div className="h-2 w-24 rounded bg-slate-300" />
          </div>
          <div className="flex gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
              <SquareStack className="h-3 w-3" />
              {contentCount} fields
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
              <Grid3X3 className="h-3 w-3" />
              {elementCount} items
            </div>
          </div>
        </div>
      </PreviewChrome>
    );
  }

  function BlockPreview({ block }: { block: BlockDoc }) {
    const Component = getBlockComponent(block.name);

    if (!Component) {
      return <BlockPreviewFallback block={block} />;
    }

    const previewKind = getPreviewKind(block);
    const scale =
      previewKind === 'banner'
        ? 0.6
        : previewKind === 'cards'
          ? 0.42
          : previewKind === 'form'
            ? 0.34
            : previewKind === 'list'
              ? 0.34
              : previewKind === 'stats'
                ? 0.44
                : previewKind === 'testimonial'
                  ? 0.34
                  : previewKind === 'split'
                    ? 0.34
                    : 0.36;

    const canvasWidth =
      previewKind === 'banner'
        ? 720
        : previewKind === 'cards'
          ? 960
          : previewKind === 'stats'
            ? 820
            : 900;

    const canvasMinHeight =
      previewKind === 'banner'
        ? 180
        : previewKind === 'cards'
          ? 340
          : previewKind === 'stats'
            ? 220
            : 520;

    return (
      <div className="relative h-56 overflow-hidden rounded-[20px] bg-white">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-white/60" />
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0"
            style={{
              width: `${canvasWidth}px`,
              minHeight: `${canvasMinHeight}px`,
              transform: `translateX(-50%) scale(${scale * 1.08})`,
              transformOrigin: 'top center',
            }}
          >
            <AgbonProductNavProvider mode="filter" syncWithUrl={false} locale="en">
              <Component
                content={buildPreviewContent(block)}
                data={buildPreviewData(block)}
              />
            </AgbonProductNavProvider>
          </div>
        </div>
      </div>
    );
  }

  const modal = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex h-[84vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <AdminSurfaceHeader
          title={<span className="text-2xl text-slate-950">Add Block</span>}
          className="border-slate-200 bg-white"
          bodyClassName="px-8 py-6"
          actions={
            <Button variant="ghost" size="icon" onClick={onClose} type="button">
              <X className="h-5 w-5" />
            </Button>
          }
        />

        <div className="border-b border-slate-200 px-8 py-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or label..."
                className="h-16 w-full rounded-2xl border-2 border-blue-500 bg-white py-3 pl-16 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Filter className="h-4 w-4" />
                Filter
              </div>
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                    activeFilter === filter.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              {(query.trim().length > 0 || activeFilter !== 'all') && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setActiveFilter('all');
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-8 py-3 text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'block' : 'blocks'} available
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {query || activeFilter !== 'all' ? 'No blocks match the current search or filter.' : 'No blocks available.'}
            </p>
          ) : (
            <ul className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((block) => (
                <li
                  key={block.id}
                  className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="border-b border-slate-200 bg-white px-4 pt-4">
                    <BlockPreview block={block} />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-slate-950">{block.label || block.name}</p>
                      <p className="truncate text-sm text-slate-500">{block.name}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="text-sm text-slate-500">
                        {block.contentDefinition?.content?.length ?? 0} fields
                        {' • '}
                        {getElementFieldCount(block)} repeatable
                      </div>
                      <Button
                        size="sm"
                        type="button"
                        className="rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
                        onClick={() => {
                          onSelect(block.id);
                          onClose();
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modal, document.body);
}
