import { OperationListActions } from './operation-list.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IOperationList extends IReduxBase {
}

export function operationListReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer
  .getConfig(ReflectiveInjector.resolveAndCreate(
    [OperationListActions]).get(OperationListActions), state, {type, payload});
}

