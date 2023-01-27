import { ReduxBaseActions } from '../../redux-base';

export class BranchUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'BRANCH_UPDATE';
  }
}
