import { ReduxBaseActions } from '../../redux-base';

export class BorrowingEventsActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_EVENTS';
  }

  getClassName(): string {
    return 'BORROWING_EVENTS';
  }

}
