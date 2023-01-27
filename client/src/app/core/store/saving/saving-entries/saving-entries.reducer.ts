import { SavingEntriesActions } from './saving-entries.actions';
import { IReduxBase, ReduxBaseReducer } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ISavingEntries extends IReduxBase {
}

export function savingEntriesReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [SavingEntriesActions]).get(SavingEntriesActions), state, {type, payload})
}
