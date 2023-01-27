import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { VaultUpdateActions } from './vault-update.actions';
import { NgRxAction } from '../../action.interface';

export interface IUpdateVault extends IReduxBase {
}

export function vaultUpdateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [VaultUpdateActions]).get(VaultUpdateActions), state, {type, payload});
}


