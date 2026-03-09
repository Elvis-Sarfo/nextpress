import type { BlockManifest } from '@/core/blocks/types';
import { toBlockTypeOption } from '@/core/blocks/define';

export const blocks: BlockManifest[] = [];

export const blockTypeOptions = blocks.map(toBlockTypeOption);
