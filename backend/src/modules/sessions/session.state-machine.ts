import { ValidationError } from '../../utils/errors.js';

export type SessionState = 'proposed' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export class SessionStateMachine {
  /**
   * Validates if a state transition is permitted.
   * Conforms to docss/design/ux-flows.md
   */
  public static canTransition(current: SessionState, target: SessionState): boolean {
    const transitions: Record<SessionState, SessionState[]> = {
      proposed: ['confirmed', 'declined', 'cancelled'],
      confirmed: ['completed', 'cancelled', 'proposed'], // 'proposed' on reschedule
      declined: [],
      cancelled: [],
      completed: [],
    };

    return transitions[current]?.includes(target) ?? false;
  }

  public static transition(current: SessionState, target: SessionState): SessionState {
    if (!this.canTransition(current, target)) {
      throw new ValidationError(
        `Cannot transition session from "${current}" to "${target}".`
      );
    }
    return target;
  }
}
