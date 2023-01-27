import { VaultListActions } from './vault-list.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IVaultList extends IReduxBase {
}

export function vaultListReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate([VaultListActions])
  .get(VaultListActions), state, {type, payload});
}

