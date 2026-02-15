import { Result, Ok, Err, DomainError } from '../core/types';
import type { ContentStatus } from '../content/types';
import type { WorkflowCommand, StateTransition } from './types';

/**
 * Valid state transitions:
 *
 * DRAFT → PUBLISHED (PUBLISH)
 * DRAFT → SCHEDULED (SCHEDULE)
 * SCHEDULED → DRAFT (CANCEL_SCHEDULE)
 * SCHEDULED → PUBLISHED (automatic when time comes)
 * PUBLISHED → ARCHIVED (when new version published)
 * PUBLISHED → DRAFT (UNPUBLISH - archives published, creates new draft)
 */

const TRANSITIONS: StateTransition[] = [
  { from: 'DRAFT', command: 'PUBLISH', to: 'PUBLISHED' },
  { from: 'DRAFT', command: 'SCHEDULE', to: 'SCHEDULED' },
  { from: 'SCHEDULED', command: 'CANCEL_SCHEDULE', to: 'DRAFT' },
  { from: 'SCHEDULED', command: 'PUBLISH', to: 'PUBLISHED' }, // For auto-publish
  { from: 'PUBLISHED', command: 'ARCHIVE', to: 'ARCHIVED' },
  { from: 'PUBLISHED', command: 'UNPUBLISH', to: 'ARCHIVED' },
];

export class WorkflowStateMachine {
  /**
   * Check if a transition is valid.
   */
  canTransition(from: ContentStatus, command: WorkflowCommand): boolean {
    return TRANSITIONS.some(t => t.from === from && t.command === command);
  }

  /**
   * Get the target status for a transition.
   */
  getTargetStatus(from: ContentStatus, command: WorkflowCommand): ContentStatus | null {
    const transition = TRANSITIONS.find(t => t.from === from && t.command === command);
    return transition?.to ?? null;
  }

  /**
   * Validate a transition.
   */
  validateTransition(from: ContentStatus, command: WorkflowCommand): Result<ContentStatus> {
    const target = this.getTargetStatus(from, command);

    if (!target) {
      return Err(DomainError.invalidTransition(
        from,
        command,
        `Cannot ${command} from ${from} status`
      ));
    }

    return Ok(target);
  }

  /**
   * Get available commands for a status.
   */
  getAvailableCommands(status: ContentStatus): WorkflowCommand[] {
    return TRANSITIONS
      .filter(t => t.from === status)
      .map(t => t.command);
  }
}
