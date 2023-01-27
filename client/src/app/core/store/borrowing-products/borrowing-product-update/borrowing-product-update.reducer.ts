import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { BorrowingProductUpdateActions } from './borrowing-product-update.actions';
import { NgRxAction } from '../../action.interface';

export interface IUpdateBorrowingProduct extends IReduxBase {
}

export function borrowingProductUpdateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BorrowingProductUpdateActions]).get(BorrowingProductUpdateActions), state, {type, payload});
}
