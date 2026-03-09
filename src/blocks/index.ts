import type { BlockManifest } from './types';
import { toBlockTypeOption } from './define';

export const blocks: BlockManifest[] = [];

export const blockTypeOptions = blocks.map(toBlockTypeOption);
