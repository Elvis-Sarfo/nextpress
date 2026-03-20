'use client';

import { BusinessMapImage } from '@/components/agbon/business-map-image';
import type { BlockContent } from '@/core/blocks/types';
import { asElements, asNumber, asOptionalString } from './content-helpers';

export function AgbonBusinessMapImageBlock({ content }: { content: BlockContent }) {
  const countries = asElements(content._elements).map((item, index) => ({
    id: `business-map-country-${index}`,
    name: asOptionalString(item.name) ?? `Country ${index + 1}`,
    officesCount: asNumber(item.officesCount, 0),
  }));

  type MarkerCandidate = {
    top?: string;
    left?: string;
    delay?: string;
  };

  type MarkerPosition = {
    top: string;
    left: string;
    delay?: string;
  };

  const markerPositions: MarkerPosition[] = [
    {
      top: asOptionalString(content.markerOneTop),
      left: asOptionalString(content.markerOneLeft),
      delay: asOptionalString(content.markerOneDelay),
    },
    {
      top: asOptionalString(content.markerTwoTop),
      left: asOptionalString(content.markerTwoLeft),
      delay: asOptionalString(content.markerTwoDelay),
    },
    {
      top: asOptionalString(content.markerThreeTop),
      left: asOptionalString(content.markerThreeLeft),
      delay: asOptionalString(content.markerThreeDelay),
    },
    {
      top: asOptionalString(content.markerFourTop),
      left: asOptionalString(content.markerFourLeft),
      delay: asOptionalString(content.markerFourDelay),
    },
    {
      top: asOptionalString(content.markerFiveTop),
      left: asOptionalString(content.markerFiveLeft),
      delay: asOptionalString(content.markerFiveDelay),
    },
    {
      top: asOptionalString(content.markerSixTop),
      left: asOptionalString(content.markerSixLeft),
      delay: asOptionalString(content.markerSixDelay),
    },
  ]
    .filter((marker: MarkerCandidate): marker is Required<Pick<MarkerCandidate, 'top' | 'left'>> & MarkerCandidate =>
      Boolean(marker.top && marker.left),
    )
    .map((marker) => ({
      top: marker.top!,
      left: marker.left!,
      delay: marker.delay,
    }));

  return (
    <BusinessMapImage
      countries={countries}
      mapImageSrc={asOptionalString(content.mapImageSrc)}
      mapImageAlt={asOptionalString(content.mapImageAlt)}
      badgeText={asOptionalString(content.badgeText)}
      title={asOptionalString(content.title)}
      description={asOptionalString(content.description)}
      countriesLabel={asOptionalString(content.countriesLabel)}
      officesLabel={asOptionalString(content.officesLabel)}
      growthValue={asOptionalString(content.growthValue)}
      growthLabel={asOptionalString(content.growthLabel)}
      activeMarketsLabel={asOptionalString(content.activeMarketsLabel)}
      expandingLabel={asOptionalString(content.expandingLabel)}
      markerPositions={markerPositions}
      mapCardOffsetTop={asOptionalString(content.mapCardOffsetTop)}
    />
  );
}
