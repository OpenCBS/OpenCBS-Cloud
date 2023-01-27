import { Injectable } from '@angular/core';
import { BranchListActions } from './branch-list.actions';
import { Actions, Effect } from '@ngrx/effects';
import { BranchListService } from './branch-list.service';
import { ReduxBaseEffects } from '../../redux-base';
import { Observable } from 'rxjs';

@Injectable()
export class BranchListEffects {
  @Effect()
  load_branches$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.branchListActions, (action) => {
    return this.branchListService.getBranchList(action.payload.data);
  });

  constructor(private branchListService: BranchListService,
              private branchListActions: BranchListActions,
              private actions$: Actions) {
  }
}
