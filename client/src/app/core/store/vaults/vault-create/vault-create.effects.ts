import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { VaultCreateActions } from './vault-create.actions';
import { VaultCreateService } from './vault-create.service';
import { ReduxBaseEffects } from '../../redux-base';

@Injectable()
export class VaultCreateEffects {

  @Effect()
  create_vault$ = ReduxBaseEffects.getConfig(this.actions$, this.vaultCreateActions, (action) => {
    return this.vaultCreateService.createVault(action.payload.data);
  });

  constructor(private vaultCreateService: VaultCreateService,
              private vaultCreateActions: VaultCreateActions,
              private actions$: Actions) {
  }
}
