import type { BlockManifest } from './types';

export function defineBlock<T extends BlockManifest>(block: T): T {
  return block;
}
