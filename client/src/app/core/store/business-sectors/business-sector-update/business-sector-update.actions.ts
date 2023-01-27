import { ReduxBaseActions } from '../../redux-base';

export class BusinessSectorUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'BUSINESS_SECTOR_UPDATE';
  }
}
