'use client';

import { AgbonCountriesSection } from '@/components/agbon/countries-section';
import type { BlockContent } from '@/core/blocks/types';
import { asBoolean, asElements, asNumber, asOptionalString, parseJsonArray } from './content-helpers';

function getLocalizedString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localized = value as Record<string, unknown>;
    const candidate =
      localized.en ??
      localized.fr ??
      Object.values(localized).find((entry) => typeof entry === 'string');

    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      return trimmed || undefined;
    }
  }

  return undefined;
}

type OfficeRecord = {
  city?: string | Record<string, string>;
  address?: string | Record<string, string>;
  phone?: string;
  email?: string;
  type?: string;
};

type NormalizedOfficeRecord = {
  city: string;
  address?: string;
  phone: string;
  email?: string;
  type?: string;
};

type CountryRecord = {
  id?: string;
  name?: string | Record<string, string>;
  flag?: string | null;
  description?: string | Record<string, string> | null;
  color?: string | null;
  offices?: OfficeRecord[] | null;
  backgroundImage?: { url?: string | null } | null;
};

export function AgbonCountriesSectionBlock({
  content,
  data,
}: {
  content: BlockContent;
  data?: unknown[];
}) {
  const manualCountries = asElements(content._elements).map((item, index) => {
    const offices: NormalizedOfficeRecord[] = parseJsonArray<OfficeRecord>(item.officesJson)
      ?.filter((office) => office.city && office.phone)
      .map((office) => ({
        city: getLocalizedString(office.city) ?? '',
        address: getLocalizedString(office.address),
        phone: office.phone ?? '',
        email: office.email,
        type: office.type,
      })) ?? [];

    return {
      id: `country-section-country-${index}`,
      name: asOptionalString(item.name) ?? `Country ${index + 1}`,
      flag: asOptionalString(item.flag),
      description: asOptionalString(item.description),
      color: asOptionalString(item.color),
      backgroundImage: asOptionalString(item.backgroundImage),
      offices,
    };
  });

  const dataCountries = Array.isArray(data)
    ? (data as CountryRecord[]).map((item, index) => ({
        id: item.id ?? `country-${index}`,
        name: getLocalizedString(item.name) ?? `Country ${index + 1}`,
        flag: item.flag ?? undefined,
        description: getLocalizedString(item.description),
        color: item.color ?? undefined,
        backgroundImage: item.backgroundImage?.url ?? undefined,
        offices: (Array.isArray(item.offices)
          ? item.offices
              .map(
                (office): NormalizedOfficeRecord => ({
                  city: getLocalizedString(office.city) ?? '',
                  address: getLocalizedString(office.address),
                  phone: office.phone ?? '',
                  email: office.email,
                  type: office.type,
                }),
              )
              .filter((office) => office.city && office.phone)
          : []) as NormalizedOfficeRecord[],
      }))
    : [];

  const rawColumns = asNumber(content.columns, 2);
  const columns = rawColumns === 1 || rawColumns === 3 ? rawColumns : 2;

  return (
    <AgbonCountriesSection
      countries={dataCountries.length > 0 ? dataCountries : manualCountries}
      subTitle={asOptionalString(content.subTitle)}
      title={asOptionalString(content.title)}
      showSearch={asBoolean(content.showSearch, true)}
      searchPlaceholder={asOptionalString(content.searchPlaceholder)}
      noResultsMessage={asOptionalString(content.noResultsMessage)}
      emptyMessage={asOptionalString(content.emptyMessage)}
      searchNoResultsTemplate={asOptionalString(content.searchNoResultsTemplate)}
      officesHeading={asOptionalString(content.officesHeading)}
      headquartersBadgeLabel={asOptionalString(content.headquartersBadgeLabel)}
      moreOfficesTemplate={asOptionalString(content.moreOfficesTemplate)}
      columns={columns}
    />
  );
}
