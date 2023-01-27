import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ReduxBaseEffects } from '../redux-base';


import { OtherFeesActions } from './other-fees.actions';
import { OtherFeesService } from './other-fees.service';
import { Observable } from 'rxjs';


@Injectable()
export class OtherFeesEffects {

  @Effect()
  load_other_fees$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.OtherFeesActions, (action) => {
    return this.OtherFeesService.getOtherFees(action.payload.data);
  });


  constructor(private OtherFeesService: OtherFeesService,
              private OtherFeesActions: OtherFeesActions,
              private actions$: Actions) {
  }
}
