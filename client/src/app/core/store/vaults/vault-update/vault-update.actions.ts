import { ReduxBaseActions } from '../../redux-base';

export class VaultUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'VAULT_UPDATE';
  }
}
