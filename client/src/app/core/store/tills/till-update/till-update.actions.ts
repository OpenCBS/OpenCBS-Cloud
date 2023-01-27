import { ReduxBaseActions } from '../../redux-base';

export class TillUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'TILL_UPDATE';
  }
}
