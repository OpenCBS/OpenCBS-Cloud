import { ReduxBaseActions } from '../../redux-base';

export class VaultListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'VAULT_LIST';
  }
}
