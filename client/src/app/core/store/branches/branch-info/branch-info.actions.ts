import { ReduxBaseActions } from '../../redux-base';

export class BranchInfoActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'INFO_ACTION';
  }

  getClassName(): string {
    return 'BRANCH_INFO';
  }
}
