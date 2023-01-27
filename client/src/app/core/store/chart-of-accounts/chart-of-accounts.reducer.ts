import { ReduxBaseReducer, IReduxBase } from '../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { ChartOfAccountsActions } from './chart-of-accounts.actions';
import { NgRxAction } from '../action.interface';

export interface IChartOfAccounts extends IReduxBase {
}

export function chartOfAccountsReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [ChartOfAccountsActions]).get(ChartOfAccountsActions), state, {type, payload});
}
