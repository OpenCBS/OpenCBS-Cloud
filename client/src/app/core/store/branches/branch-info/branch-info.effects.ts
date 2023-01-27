import { Injectable } from '@angular/core';
import { BranchInfoActions } from './branch-info.actions';
import { Actions, Effect } from '@ngrx/effects';
import { BranchInfoService } from './branch-info.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';
import { Observable } from 'rxjs';

@Injectable()
export class BranchInfoEffects {
  @Effect()
  load_branch$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.branchInfoActions, (action) => {
    return this.branchInfoService.getBranchInfo(action.payload.data);
  });

  constructor(private branchInfoService: BranchInfoService,
              private branchInfoActions: BranchInfoActions,
              private actions$: Actions) {
  }
}
