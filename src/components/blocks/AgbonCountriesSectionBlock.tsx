'use client';

import { AgbonCountriesSection } from '@/components/agbon/countries-section';
import type { BlockContent } from '@/core/blocks/types';
import { asBoolean, asElements, asNumber, asOptionalString, parseJsonArray } from './content-helpers';

type OfficeRecord = {
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  type?: string;
};

type CountryRecord = {
  id?: string;
  name?: string;
  flag?: string | null;
  description?: string | null;
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
    const offices = parseJsonArray<OfficeRecord>(item.officesJson)
      ?.filter((office) => office.city && office.phone)
      .map((office) => ({
        city: office.city ?? '',
        address: office.address,
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
        name: item.name ?? `Country ${index + 1}`,
        flag: item.flag ?? undefined,
        description: item.description ?? undefined,
        color: item.color ?? undefined,
        backgroundImage: item.backgroundImage?.url ?? undefined,
        offices: Array.isArray(item.offices)
          ? item.offices
              .filter((office) => office.city && office.phone)
              .map((office) => ({
                city: office.city ?? '',
                address: office.address,
                phone: office.phone ?? '',
                email: office.email,
                type: office.type,
              }))
          : [],
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
