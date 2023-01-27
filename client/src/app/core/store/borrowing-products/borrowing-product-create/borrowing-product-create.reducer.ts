import { BorrowingProductCreateActions } from './borrowing-product-create.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ICreateBorrowingProduct extends IReduxBase {
}

export function borrowingProductCreateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BorrowingProductCreateActions]).get(BorrowingProductCreateActions), state, {type, payload});
}

