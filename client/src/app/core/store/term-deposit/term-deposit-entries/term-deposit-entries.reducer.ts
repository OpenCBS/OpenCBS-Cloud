import { TermDepositEntriesActions } from './term-deposit-entries.actions';
import { IReduxBase, ReduxBaseReducer } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ITermDepositEntries extends IReduxBase {
}

export function termDepositEntriesReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [TermDepositEntriesActions]).get(TermDepositEntriesActions), state, {type, payload})
}
