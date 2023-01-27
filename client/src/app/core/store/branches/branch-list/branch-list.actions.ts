import { ReduxBaseActions } from '../../redux-base';

export class BranchListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'BRANCH_LIST';
  }
}
