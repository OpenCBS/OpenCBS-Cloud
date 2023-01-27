import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ReduxBaseEffects } from '../../redux-base';


import { TermDepositEntriesActions } from './term-deposit-entries.actions';
import { TermDepositEntriesService } from './term-deposit-entries.service';
import { Observable } from 'rxjs';


@Injectable()
export class TermDepositEntriesEffects {

  @Effect()
  load_term_deposit_entries$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.termDepositEntriesActions, (action) => {
    return this.termDepositEntriesService.getTermDepositEntries(action.payload.data.id, action.payload.data.page);
  });

  constructor(private termDepositEntriesService: TermDepositEntriesService,
              private termDepositEntriesActions: TermDepositEntriesActions,
              private actions$: Actions) {
  }
}
