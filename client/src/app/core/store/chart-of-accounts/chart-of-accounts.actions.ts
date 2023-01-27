import { ReduxBaseActions } from '../redux-base/redux.base.actions';

export class ChartOfAccountsActions extends ReduxBaseActions {

  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'CHART_OF_ACCOUNTS';
  }
}
