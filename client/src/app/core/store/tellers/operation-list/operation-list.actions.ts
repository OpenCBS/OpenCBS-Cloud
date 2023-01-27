import { ReduxBaseActions } from '../../redux-base';

export class OperationListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LOADING_ACTION';
  }

  getClassName(): string {
    return 'OPERATION_LIST';
  }
}
