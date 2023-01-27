import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ReduxBaseEffects } from '../../redux-base';


import { BorrowingEventsActions } from './borrowing-events.actions';
import { BorrowingEventsService } from './borrowing-events.service';
import { Observable } from 'rxjs';


@Injectable()
export class BorrowingEventsEffects {

  @Effect()
  load_borrowing_events$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.borrowingEventsActions, (action) => {
    return this.borrowingEventsService.getBorrowingEvents(action.payload.data.id, action.payload.data.status);
  });

  constructor(private borrowingEventsService: BorrowingEventsService,
              private borrowingEventsActions: BorrowingEventsActions,
              private actions$: Actions) {
  }
}
