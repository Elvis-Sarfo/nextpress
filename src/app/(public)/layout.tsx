import { AdminBar } from '@/components/public/AdminBar';
import { AgbonHeader, HeaderConfig } from '@/components/agbon/header';
import { AgbonFooter, FooterConfig } from '@/components/agbon/footer';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';
import { getSettings } from '@/lib/cms';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings() as Record<string, unknown>;

  // Map NextPress settings to AGBON header/footer config (with defaults)
  const logoUrl = (settings.logo as { url?: string } | null)?.url || '/logo.png';
  const siteName = (settings.siteName as string | null) || 'Agbon';

  const headerConfig: HeaderConfig = {
    logo: {
      src: logoUrl,
      alt: siteName,
      width: 120,
      height: 40,
      className: 'h-8 md:h-10 w-auto',
    },
    navigation: {
      about: {
        label: 'About AGBON',
        items: [
          { label: 'Brand Introduction', href: '/en/about' },
          { label: 'Business Map', href: '/en/about#business-map' },
        ],
      },
      afterSales: { label: 'Service', href: '/en/after-sales-service' },
      joinUs: {
        label: 'Join Us',
        items: [
          { label: 'Recruitment', href: '/en/join-us/recruitment' },
          { label: 'Contact', href: '/en/contact' },
        ],
      },
    },
  };

  const footerConfig: FooterConfig = {
    companyName: siteName,
    description:
      (settings.siteDescription as string | null) ||
      'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.',
    logo: headerConfig.logo,
    quickLinks: [
      { label: 'About', href: '/en/about' },
      { label: 'Products', href: '/en/products' },
      { label: 'After Sales', href: '/en/after-sales-service' },
      { label: 'Contact', href: '/en/contact' },
    ],
    contact: {
      phone: (settings.phone as string | null) || '+1 (555) 123-4567',
      email: (settings.email as string | null) || 'info@agbon.com',
      address: (settings.address as string | null) || 'Industrial Park, Zone A',
    },
    socialMedia: {
      facebook: (settings.facebook as string | null) || undefined,
      linkedin: (settings.linkedin as string | null) || undefined,
      twitter: (settings.twitter as string | null) || undefined,
    },
    newsletter: { enabled: true, placeholder: 'Your email' },
    legal: { privacy: '/en/privacy-policy', terms: '/en/terms-of-service' },
    copyright: `© ${new Date().getFullYear()} AGBON. All rights reserved.`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AdminBar />
      <AgbonHeader config={headerConfig} />
      <AgbonProductNavProvider>
        <main className="flex-1">{children}</main>
      </AgbonProductNavProvider>
      <AgbonFooter config={footerConfig} />
    </div>
  );
}
