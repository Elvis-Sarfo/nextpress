import type { BlockManifest } from './types';

export function defineBlock<T extends BlockManifest>(block: T): T {
  return block;
}

export function toBlockTypeOption(block: Pick<BlockManifest, 'label' | 'type'>) {
  return {
    label: block.label,
    value: block.type,
  };
}
