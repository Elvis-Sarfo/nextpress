import { aboutManifest } from './about';
import { bannerManifest } from './banner';
import { contactManifest } from './contact';
import { faqManifest } from './faq';
import { featuredRoomsManifest } from './featured-rooms';
import { galleryManifest } from './gallery';
import { heroManifest } from './hero';
import { postListManifest } from './post-list';
import { serviceManifest } from './service';
import { showcaseManifest } from './showcase';
import { subscribeManifest } from './subscribe';
import { testimonialManifest } from './testimonial';
import { toBlockTypeOption } from './define';

export const blocks = [
  heroManifest,
  bannerManifest,
  aboutManifest,
  faqManifest,
  galleryManifest,
  serviceManifest,
  testimonialManifest,
  contactManifest,
  subscribeManifest,
  featuredRoomsManifest,
  showcaseManifest,
  postListManifest,
];

export const blockTypeOptions = blocks.map(toBlockTypeOption);

export {
  aboutManifest,
  bannerManifest,
  contactManifest,
  faqManifest,
  featuredRoomsManifest,
  galleryManifest,
  heroManifest,
  postListManifest,
  serviceManifest,
  showcaseManifest,
  subscribeManifest,
  testimonialManifest,
};
