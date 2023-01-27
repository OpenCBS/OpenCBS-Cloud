import { Injectable } from '@angular/core';
import { TillInfoActions } from './till-info.actions';
import { Actions, Effect } from '@ngrx/effects';
import { TillInfoService } from './till-info.service';
import { ReduxBaseEffects } from '../../redux-base';
import { Observable } from 'rxjs';

@Injectable()
export class TillInfoEffects {
  @Effect()
  load_till$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.tillInfoActions, (action) => {
    return this.tillInfoService.getTillInfo(action.payload.data);
  });

  constructor(private tillInfoService: TillInfoService,
              private tillInfoActions: TillInfoActions,
              private actions$: Actions) {
  }
}
