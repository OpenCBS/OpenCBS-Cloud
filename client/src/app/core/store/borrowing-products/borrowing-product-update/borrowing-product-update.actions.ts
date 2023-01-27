import { ReduxBaseActions } from '../../redux-base';

export class BorrowingProductUpdateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'UPDATE_ACTION';
  }

  getClassName(): string {
    return 'BORROWING_PRODUCT_UPDATE';
  }
}
