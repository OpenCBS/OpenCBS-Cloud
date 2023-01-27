import { Injectable } from '@angular/core';
import { VaultListActions } from './vault-list.actions';
import { Actions, Effect } from '@ngrx/effects';
import { VaultListService } from './vault-list.service';
import { ReduxBaseEffects } from '../../redux-base';
import { Observable } from 'rxjs';

@Injectable()
export class VaultListEffects {
  @Effect()
  load_vaults$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.vaultListActions, (action) => {
    return this.vaultListService.getVaultList(action.payload.data);
  });

  constructor(private vaultListService: VaultListService,
              private vaultListActions: VaultListActions,
              private actions$: Actions) {
  }
}
