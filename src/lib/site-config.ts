import { buildLocalizedPath } from '@/lib/agbon-routes';
import { getSettings } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';

type SettingsRecord = Record<string, unknown>;

export interface SiteConfigLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  socialMedia: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  footer: {
    companyName: string;
    description: string;
    quickLinks: SiteConfigLink[];
    copyright: string;
  };
  newsletter: {
    enabled: boolean;
    placeholder: string;
  };
  legal: {
    privacy: string;
    terms: string;
  };
  features: {
    showSearch: boolean;
    showLanguageSwitcher: boolean;
    showQuickInquiry: boolean;
  };
  seo: {
    defaultTitle: string;
    titleSuffix?: string;
    description: string;
  };
}

function getGroup(settings: SettingsRecord, key: string): Record<string, unknown> {
  const value = settings[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function localizeConfiguredPath(locale: string, path: string, fallback: string) {
  if (!path) return buildLocalizedPath(locale, fallback);
  if (/^https?:\/\//.test(path)) return path;
  return buildLocalizedPath(locale, path);
}

function getLocalizedString(value: unknown, locale: string, fallback?: string): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;

  const localized = getLocale(value as Record<string, string> | null | undefined, locale);
  if (localized && localized.trim()) return localized;

  return fallback;
}

export function buildSiteConfig(settings: SettingsRecord, locale: string): SiteConfig {
  const logo = getGroup(settings, 'logo');
  const contact = getGroup(settings, 'contact');
  const socialMedia = getGroup(settings, 'socialMedia');
  const footer = getGroup(settings, 'footer');
  const newsletter = getGroup(settings, 'newsletter');
  const legal = getGroup(settings, 'legal');
  const features = getGroup(settings, 'features');
  const seo = getGroup(settings, 'seo');

  const siteName = (settings.siteName as string | null) || 'Agbon';
  const siteDescription =
    getLocalizedString(
      settings.siteDescription,
      locale,
      'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.',
    ) || 'Leading agricultural machinery manufacturer since 2018. Providing quality equipment to farmers worldwide.';
  const logoImage = (logo.image as { url?: string } | null) || (settings.logo as { url?: string } | null);

  const footerQuickLinks = Array.isArray(footer.quickLinks)
    ? footer.quickLinks
        .filter(
          (item): item is { label: string; href: string } =>
            typeof item === 'object' &&
            item !== null &&
            typeof (item as { label?: unknown }).label === 'string' &&
            typeof (item as { href?: unknown }).href === 'string',
        )
        .map((item) => ({
          label: item.label,
          href: localizeConfiguredPath(locale, item.href, item.href),
        }))
    : [
        { label: 'About', href: buildLocalizedPath(locale, '/about') },
        { label: 'Products', href: buildLocalizedPath(locale, '/products') },
        { label: 'After Sales', href: buildLocalizedPath(locale, '/after-sales-service') },
        { label: 'Contact', href: buildLocalizedPath(locale, '/contact') },
      ];

  return {
    siteName,
    siteDescription,
    logo: {
      src: logoImage?.url || '/logo.png',
      alt: (logo.alt as string | null) || siteName,
      width: (logo.width as number | null) || 120,
      height: (logo.height as number | null) || 40,
      className: 'h-8 md:h-10 w-auto',
    },
    contact: {
      phone: (contact.phone as string | null) || '+1 (555) 123-4567',
      email: (contact.email as string | null) || 'info@agbon.com',
      address: (contact.address as string | null) || 'Industrial Park, Zone A',
    },
    socialMedia: {
      facebook: (socialMedia.facebook as string | null) || undefined,
      linkedin: (socialMedia.linkedin as string | null) || undefined,
      twitter: (socialMedia.twitter as string | null) || undefined,
      instagram: (socialMedia.instagram as string | null) || undefined,
      youtube: (socialMedia.youtube as string | null) || undefined,
    },
    footer: {
      companyName: (footer.companyName as string | null) || siteName,
      description: getLocalizedString(footer.description, locale, siteDescription) || siteDescription,
      quickLinks: footerQuickLinks,
      copyright:
        (footer.copyright as string | null) || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
    },
    newsletter: {
      enabled: (newsletter.enabled as boolean | undefined) ?? true,
      placeholder: getLocalizedString(newsletter.placeholder, locale, 'Your email') || 'Your email',
    },
    legal: {
      privacy: localizeConfiguredPath(locale, (legal.privacyPolicy as string | undefined) || '', '/privacy-policy'),
      terms: localizeConfiguredPath(locale, (legal.termsOfService as string | undefined) || '', '/terms-of-service'),
    },
    features: {
      showSearch: (features.showSearch as boolean | undefined) ?? true,
      showLanguageSwitcher: (features.showLanguageSwitcher as boolean | undefined) ?? true,
      showQuickInquiry: (features.showQuickInquiry as boolean | undefined) ?? true,
    },
    seo: {
      defaultTitle: getLocalizedString(seo.defaultTitle, locale, siteName) || siteName,
      titleSuffix: (seo.titleSuffix as string | null) || siteName,
      description: getLocalizedString(seo.description, locale, siteDescription) || siteDescription,
    },
  };
}

export async function getSiteConfig(locale: string): Promise<SiteConfig> {
  const settings = await getSettings();
  return buildSiteConfig(settings, locale);
}
