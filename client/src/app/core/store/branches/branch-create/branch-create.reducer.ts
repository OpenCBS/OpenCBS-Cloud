import { BranchCreateActions } from './branch-create.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IBranch extends IReduxBase {
}

export function branchCreateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate([BranchCreateActions])
  .get(BranchCreateActions), state, {type, payload})
}
