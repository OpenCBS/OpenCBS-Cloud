import { TillCreateActions } from './till-create.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ICreateTill extends IReduxBase {
}

export function tillCreateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [TillCreateActions]).get(TillCreateActions), state, {type, payload}
  )
}

