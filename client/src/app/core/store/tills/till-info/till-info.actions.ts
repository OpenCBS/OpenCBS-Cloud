import { ReduxBaseActions } from '../../redux-base';

export class TillInfoActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'INFO_ACTION';
  }

  getClassName(): string {
    return 'TILL_INFO';
  }
}
