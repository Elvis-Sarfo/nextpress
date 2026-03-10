import { AgbonCommitmentSectionBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonCommitmentSectionBlock = defineBlock({
  name: 'agbon-commitment-section',
  label: 'Agbon Commitment Section',
  category: 'content',
  icon: 'BadgeCheck',
  definition: {},
  component: AgbonCommitmentSectionBlock,
});
