import { ReduxBaseActions } from '../../redux-base';

export class BusinessSectorCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'BUSINESS_SECTOR_CREATE';
  }
}
