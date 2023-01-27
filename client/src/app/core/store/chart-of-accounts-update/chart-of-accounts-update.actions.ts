import { ReduxBaseActions } from '../redux-base/redux.base.actions';

export class ChartOfAccountUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'CHART_OF_ACCOUNT_UPDATE';
  }
}
