import { ReduxBaseActions } from '../../redux-base';

export class BusinessSectorListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LIST_ACTION';
  }

  getClassName(): string {
    return 'BUSINESS_SECTOR_LIST';
  }
}
