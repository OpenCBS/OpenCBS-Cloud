import { ReduxBaseActions } from '../../redux-base';

export class LoanAppCCActivityListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'LOAN_APP_CC_ACTIVITY';
  }

}
