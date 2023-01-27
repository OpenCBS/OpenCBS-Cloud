import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { VaultUpdateActions } from './vault-update.actions';
import { VaultUpdateService } from './vault-update.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';

@Injectable()
export class VaultUpdateEffects {

  @Effect()
  update_vault$ = ReduxBaseEffects.getConfig(this.actions$, this.vaultUpdateActions, (action) => {
    return this.vaultUpdateService.updateVault(action.payload.data.vault, action.payload.data.id);
  });

  constructor(private vaultUpdateService: VaultUpdateService,
              private vaultUpdateActions: VaultUpdateActions,
              private actions$: Actions) {
  }
}
