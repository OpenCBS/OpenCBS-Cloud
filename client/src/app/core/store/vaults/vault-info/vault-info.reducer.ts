import { VaultInfoActions } from './vault-info.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IVaultInfo extends IReduxBase {
}

export function vaultInfoReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [VaultInfoActions]).get(VaultInfoActions), state, {type, payload});
}

