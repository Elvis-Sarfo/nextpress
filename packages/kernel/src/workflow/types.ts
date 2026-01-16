import type { VersionStatus } from '../content/types.js';

export type WorkflowCommand =
  | 'SAVE_DRAFT'
  | 'PUBLISH'
  | 'SCHEDULE'
  | 'CANCEL_SCHEDULE'
  | 'UNPUBLISH'
  | 'ARCHIVE';

export interface StateTransition {
  from: VersionStatus;
  command: WorkflowCommand;
  to: VersionStatus;
}
