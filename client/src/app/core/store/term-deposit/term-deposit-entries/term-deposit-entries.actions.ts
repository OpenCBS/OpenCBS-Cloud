import { ReduxBaseActions } from '../../redux-base';

export class TermDepositEntriesActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ENTRIES';
  }

  getClassName(): string {
    return 'TERM_DEPOSIT_ENTRIES';
  }
}
