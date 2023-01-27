import { Injectable } from '@angular/core';
import { VaultInfoActions } from './vault-info.actions';
import { Actions, Effect } from '@ngrx/effects';
import { VaultInfoService } from './vault-info.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';
import { Observable } from 'rxjs';

@Injectable()
export class VaultInfoEffects {
  @Effect()
  load_vault$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.vaultInfoActions, (action) => {
    return this.vaultInfoService.getVaultInfo(action.payload.data);
  });

  constructor(private vaultInfoService: VaultInfoService,
              private vaultInfoActions: VaultInfoActions,
              private actions$: Actions) {
  }
}
