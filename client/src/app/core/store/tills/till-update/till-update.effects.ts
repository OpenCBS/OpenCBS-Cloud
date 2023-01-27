import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { TillUpdateActions } from './till-update.actions';
import { TillUpdateService } from './till-update.service';
import { ReduxBaseEffects } from '../../redux-base';

@Injectable()
export class TillUpdateEffects {

  @Effect()
  update_till$ = ReduxBaseEffects.getConfig(this.actions$, this.tillUpdateActions, (action) => {
    return this.tillUpdateService.updateTill(action.payload.data.till, action.payload.data.id);
  });

  constructor(private tillUpdateService: TillUpdateService,
              private tillUpdateActions: TillUpdateActions,
              private actions$: Actions) {
  }
}
