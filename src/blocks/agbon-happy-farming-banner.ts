import { AgbonHappyFarmingBannerBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonHappyFarmingBannerBlock = defineBlock({
  name: 'agbon-happy-farming-banner',
  label: 'Agbon Happy Farming Banner',
  category: 'marketing',
  icon: 'BadgePlus',
  definition: {},
  component: AgbonHappyFarmingBannerBlock,
});
