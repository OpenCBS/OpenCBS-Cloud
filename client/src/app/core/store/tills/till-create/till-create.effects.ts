import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { TillCreateActions } from './till-create.actions';
import { TillCreateService } from './till-create.service';
import { ReduxBaseEffects } from '../../redux-base';

@Injectable()
export class TillCreateEffects {

  @Effect()
  create_till$ = ReduxBaseEffects.getConfig(this.actions$, this.tillCreateActions, (action) => {
    return this.tillCreateService.createTill(action.payload.data);
  });

  constructor(private tillCreateService: TillCreateService,
              private tillCreateActions: TillCreateActions,
              private actions$: Actions) {
  }
}
