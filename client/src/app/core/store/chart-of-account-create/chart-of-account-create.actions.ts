import { ReduxBaseActions } from '../redux-base';

export class ChartOfAccountCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'CHART_OF_ACCOUNT_CREATE';
  }
}
