import { ReduxBaseActions } from '../../redux-base';

export class BorrowingProductCreateActions extends ReduxBaseActions {
  getInitialActionCommandName(): string {
    return 'CREATE_ACTION';
  }

  getClassName(): string {
    return 'BORROWING_PRODUCT_CREATE';
  }
}
