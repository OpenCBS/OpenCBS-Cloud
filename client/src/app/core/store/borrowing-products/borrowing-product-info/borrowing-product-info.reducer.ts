import { BorrowingProductInfoActions } from './borrowing-product-info.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IBorrowingProductInfo extends IReduxBase {
}

export function borrowingProductInfoReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BorrowingProductInfoActions]).get(BorrowingProductInfoActions), state, {type, payload});
}

