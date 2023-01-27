import { Injectable } from '@angular/core';
import { TillListActions } from './till-list.actions';
import { Actions, Effect } from '@ngrx/effects';
import { TillListService } from './till-list.service';
import { ReduxBaseEffects } from '../../redux-base';
import { Observable } from 'rxjs';

@Injectable()
export class TillListEffects {
  @Effect()
  load_tills$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.tillListActions, (action) => {
    return this.tillListService.getTillList(action.payload.data);
  });

  constructor(private tillListService: TillListService,
              private tillListActions: TillListActions,
              private actions$: Actions) {
  }
}
