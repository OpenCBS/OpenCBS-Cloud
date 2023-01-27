import { ReduxBaseActions } from '../../redux-base';

export class SavingEntriesActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ENTRIES';
  }

  getClassName(): string {
    return 'SAVING_ENTRIES';
  }
}
