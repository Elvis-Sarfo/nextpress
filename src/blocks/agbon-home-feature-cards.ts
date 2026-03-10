import { AgbonHomeFeatureCardsBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonHomeFeatureCardsBlock = defineBlock({
  name: 'agbon-home-feature-cards',
  label: 'Agbon Home Feature Cards',
  category: 'content',
  icon: 'LayoutGrid',
  definition: {},
  component: AgbonHomeFeatureCardsBlock,
});
