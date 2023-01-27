import { ReduxBaseActions } from '../../redux-base';

export class TillListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'TILL_LIST';
  }
}
