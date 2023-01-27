import { ReduxBaseActions } from '../redux-base/redux.base.actions';

export class OtherFeesActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_OTHER_FEES';
  }

  getClassName(): string {
    return 'LIST_OTHER_FEES';
  }

}
