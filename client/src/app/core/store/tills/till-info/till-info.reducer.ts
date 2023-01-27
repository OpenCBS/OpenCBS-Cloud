import { TillInfoActions } from './till-info.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ITillInfo extends IReduxBase {
}

export function tillInfoReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [TillInfoActions]).get(TillInfoActions), state, {type, payload});
}

