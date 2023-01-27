import { ReduxBaseActions } from '../../redux-base';

export class BorrowingProductListActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'LOADING_ACTION';
  }

  getClassName(): string {
    return 'BORROWING_PRODUCT_LIST';
  }
}
