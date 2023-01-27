import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ProfileChangeActions } from './profile-changes.actions';
import { ProfileChangeService } from './profile-changes.service';
import { ReduxBaseEffects } from '../../redux-base';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileChangesEffects {
  @Effect()
  load_profile_changes$: Observable<any> = ReduxBaseEffects.getConfig(
    this.actions$,
    this.profileChangesActions,
    ({payload}) => this.profileChangesService.getProfileChanges(payload)
  );

  constructor(private profileChangesService: ProfileChangeService,
              private profileChangesActions: ProfileChangeActions,
              private actions$: Actions) {
  }
}
