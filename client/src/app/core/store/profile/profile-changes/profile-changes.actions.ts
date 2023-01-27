import { ReduxBaseActions } from '../../redux-base';

export class ProfileChangeActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'PROFILE_CHANGES';
  }
}
