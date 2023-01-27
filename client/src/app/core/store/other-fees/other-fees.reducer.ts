import { IReduxBase, ReduxBaseReducer } from '../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { OtherFeesActions } from './other-fees.actions';
import { NgRxAction } from '../action.interface';

export interface IOtherFees extends IReduxBase {
}

export function otherFeesReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [OtherFeesActions]).get(OtherFeesActions), state, {type, payload});
}


