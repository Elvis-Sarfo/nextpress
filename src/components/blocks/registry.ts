import type { ComponentType } from 'react';
import { HeroBlock } from './HeroBlock';

export type BlockContent = Record<string, unknown>;
export type BlockComponent = ComponentType<{ content: BlockContent }>;

const BlockRegistry: Record<string, BlockComponent> = {
  hero: HeroBlock,
};

export function getBlockComponent(type: string): BlockComponent | null {
  return BlockRegistry[type] ?? null;
}

/**
 * Register additional block components at runtime.
 * Call this in your app to extend the registry with custom blocks.
 */
export function registerBlock(type: string, component: BlockComponent): void {
  BlockRegistry[type] = component;
}
