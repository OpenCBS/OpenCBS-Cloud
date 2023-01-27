import { ReduxBaseActions } from '../../redux-base';

export class VaultCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'VAULT_CREATE';
  }
}
