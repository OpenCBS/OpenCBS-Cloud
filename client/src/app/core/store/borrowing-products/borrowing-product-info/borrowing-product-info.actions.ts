import { ReduxBaseActions } from '../../redux-base';

export class BorrowingProductInfoActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'INFO_ACTION';
  }

  getClassName(): string {
    return 'BORROWING_PRODUCT_INFO';
  }
}
