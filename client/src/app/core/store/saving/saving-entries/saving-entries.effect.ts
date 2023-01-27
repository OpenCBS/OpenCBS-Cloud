import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ReduxBaseEffects } from '../../redux-base';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { SavingEntriesActions } from './saving-entries.actions';
import { SavingEntriesService } from './saving-entries.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SavingEntriesEffects {

  @Effect()
  load_saving_entries$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.savingEntriesActions, (action) => {
    return this.savingEntriesService.getSavingEntries(action.payload.data.id, action.payload.data.page);
  });

  constructor(private savingEntriesService: SavingEntriesService,
              private savingEntriesActions: SavingEntriesActions,
              private actions$: Actions) {
  }
}
