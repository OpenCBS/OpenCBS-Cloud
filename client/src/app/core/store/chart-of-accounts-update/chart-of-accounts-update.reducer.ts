import { ReduxBaseReducer, IReduxBase } from '../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { ChartOfAccountUpdateActions } from './chart-of-accounts-update.actions';
import { NgRxAction } from '../action.interface';

export interface IUpdateChartOfAccount extends IReduxBase {
}

export function chartOfAccountUpdateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [ChartOfAccountUpdateActions]).get(ChartOfAccountUpdateActions), state, {type, payload});
}
