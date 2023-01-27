import { ReduxBaseActions } from '../../redux-base';

export class BranchCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'BRANCH_CREATE';
  }
}
