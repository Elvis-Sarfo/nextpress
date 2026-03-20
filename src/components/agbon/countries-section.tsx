'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Building2, Globe, Mail, MapPin, Phone, Search, X } from 'lucide-react';
import { AgbonSectionTitle } from '@/components/agbon/section-title';

interface CountryOffice {
  city: string;
  address?: string;
  phone: string;
  email?: string;
  type?: string;
}

interface CountryCard {
  id: string;
  name: string;
  flag?: string;
  description?: string;
  color?: string;
  backgroundImage?: string;
  offices: CountryOffice[];
}

interface AgbonCountriesSectionProps {
  countries?: CountryCard[];
  subTitle?: string;
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  emptyMessage?: string;
  searchNoResultsTemplate?: string;
  officesHeading?: string;
  headquartersBadgeLabel?: string;
  moreOfficesTemplate?: string;
  columns?: 1 | 2 | 3;
}

function resolveGrid(columns: 1 | 2 | 3) {
  if (columns === 1) return 'grid-cols-1';
  if (columns === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  return 'grid-cols-1 md:grid-cols-2';
}

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

function replaceCount(template: string, count: number) {
  return template.replace(/\{count\}/g, String(count));
}

export function AgbonCountriesSection({
  countries = [],
  subTitle,
  title = 'Our Service Areas',
  showSearch = true,
  searchPlaceholder = 'Search countries, cities...',
  noResultsMessage = 'No countries found',
  emptyMessage = 'No service areas available',
  searchNoResultsTemplate = 'No countries found matching "{query}"',
  officesHeading = 'Contact Our Offices',
  headquartersBadgeLabel = 'HQ',
  moreOfficesTemplate = '+{count} more offices',
  columns = 2,
}: AgbonCountriesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter((country) => {
      const matchesCountry = country.name.toLowerCase().includes(query);
      const matchesDescription = country.description?.toLowerCase().includes(query) ?? false;
      const matchesCities = country.offices.some((office) => office.city.toLowerCase().includes(query));

      return matchesCountry || matchesDescription || matchesCities;
    });
  }, [countries, searchQuery]);

  return (
    <section className="px-0">
      <div className="max-w-7xl mx-auto">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <AgbonSectionTitle
              align="left"
              subTitle={subTitle}
              title={title}
              className="md:items-start md:text-left"
            />

            {showSearch && (
              <div className="relative w-full sm:w-auto sm:min-w-[28rem]">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="absolute -left-1 w-8 h-8 bg-[#FF6B35]/10 rounded-lg transition-all duration-300" />
                    <Search size={18} className="relative z-10 text-[#FF6B35]" />
                  </div>

                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full pl-11 pr-11 h-11 bg-white border-2 border-gray-200 rounded-lg focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 shadow-md hover:shadow-lg hover:border-[#FF6B35]/50 transition-all duration-300 text-body outline-none"
                  />

                  {searchQuery ? (
                    <>
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-all duration-200"
                        type="button"
                      >
                        <X size={18} />
                      </button>
                      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-caption text-gray-500 font-medium">
                        {filteredCountries.length}
                      </div>
                    </>
                  ) : null}
                </div>

                {searchQuery && filteredCountries.length === 0 ? (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-10">
                    <div className="flex items-center gap-2 text-gray-600 text-body">
                      <Search size={16} className="text-gray-400" />
                      <span>{searchNoResultsTemplate.replace(/\{query\}/g, searchQuery)}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {filteredCountries.length > 0 ? (
            <div className={`grid gap-6 ${resolveGrid(columns)}`}>
              {filteredCountries.map((country) => (
                <div
                  key={country.id}
                  className="relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group"
                >
                  <div className="absolute inset-0 z-0">
                    {country.backgroundImage ? (
                      <Image
                        src={country.backgroundImage}
                        alt={country.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${country.color || '#FF6B35'}20 0%, ${country.color || '#FF6B35'}50 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <Image
                      src="/african_map.png"
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-contain opacity-50"
                    />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 md:p-8">
                    <div>
                      <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
                        <div className="flex items-start gap-2 sm:gap-3 md:gap-5">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 min-w-16 sm:min-w-20 min-h-16 sm:min-h-20 rounded-3xl bg-white/15 backdrop-blur-xl border-2 border-white/25 flex items-center justify-center shadow-2xl ring-4 ring-white/10 shrink-0">
                            <span className="text-3xl sm:text-5xl">{country.flag || '🌍'}</span>
                          </div>
                          <div>
                            <h3 className="text-hero font-black text-white drop-shadow-2xl mb-1 sm:mb-1.5 md:mb-2 tracking-tight">
                              {country.name}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5">
                              <Globe size={14} />
                              <span className="text-caption font-bold uppercase tracking-wider">
                                {country.offices.length} {country.offices.length === 1 ? 'Office' : 'Offices'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2 sm:mb-2.5 md:mb-3">
                        <div className="h-1.5 w-16 bg-linear-to-r from-[#FF6B35] to-transparent rounded-full" />
                        <span className="text-white font-black text-subheading uppercase tracking-wider drop-shadow-lg">
                          {officesHeading}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                        {country.offices.slice(0, 4).map((office, index) => (
                          <div
                            key={`${country.id}-office-${index}`}
                            className="bg-white/15 backdrop-blur-lg border-2 border-white/25 rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-xl"
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
                              <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-lg">
                                <MapPin size={16} className="text-white" />
                              </div>
                              <span className="font-black text-white text-subheading">{office.city}</span>
                              {office.type === 'headquarters' ? (
                                <span className="text-caption bg-linear-to-r from-[#FF6B35] to-[#E55A24] text-white px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full font-bold shadow-md">
                                  {headquartersBadgeLabel}
                                </span>
                              ) : null}
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <a
                                href={`tel:${cleanPhone(office.phone)}`}
                                className="w-full flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors"
                              >
                                <Phone size={14} />
                                <span className="text-body font-semibold">{office.phone}</span>
                              </a>

                              {office.email ? (
                                <a
                                  href={`mailto:${office.email}`}
                                  className="w-full flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors"
                                >
                                  <Mail size={14} />
                                  <span className="text-caption font-medium truncate">{office.email}</span>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>

                      {country.offices.length > 4 ? (
                        <div className="text-center pt-2 sm:pt-2.5 md:pt-3">
                          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2">
                            <Building2 size={14} className="text-white" />
                            <span className="text-white text-body font-semibold">
                              {replaceCount(moreOfficesTemplate, country.offices.length - 4)}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-40 h-40 opacity-20 pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at top left, ${country.color || '#FF6B35'}60 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20 pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at bottom right, ${country.color || '#FF6B35'}60 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin size={64} className="mx-auto text-gray-300 mb-6" />
              <p className="text-gray-500 text-subheading">
                {searchQuery ? noResultsMessage : emptyMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
