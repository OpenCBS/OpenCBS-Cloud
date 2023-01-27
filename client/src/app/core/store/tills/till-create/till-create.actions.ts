import { ReduxBaseActions } from '../../redux-base';

export class TillCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'Till_CREATE';
  }
}
