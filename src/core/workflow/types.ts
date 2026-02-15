import type { ContentStatus } from '../content/types';

export type WorkflowCommand =
  | 'SAVE_DRAFT'
  | 'PUBLISH'
  | 'SCHEDULE'
  | 'CANCEL_SCHEDULE'
  | 'UNPUBLISH'
  | 'ARCHIVE';

export interface StateTransition {
  from: ContentStatus;
  command: WorkflowCommand;
  to: ContentStatus;
}
