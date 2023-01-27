import { ReduxBaseActions } from '../../redux-base';

export class VaultInfoActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'INFO_ACTION';
  }

  getClassName(): string {
    return 'VAULT_INFO';
  }
}
