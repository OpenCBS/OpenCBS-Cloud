import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { BranchUpdateActions } from './branch-edit.actions';
import { NgRxAction } from '../../action.interface';

export interface IUpdateBranch extends IReduxBase {
}

export function branchUpdateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BranchUpdateActions]).get(BranchUpdateActions), state, {type, payload});
}
