import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { BranchUpdateActions } from './branch-edit.actions';
import { BranchUpdateService } from './branch-edit.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';

@Injectable()
export class BranchUpdateEffects {

  @Effect()
  update_branch$ = ReduxBaseEffects.getConfig(this.actions$, this.branchUpdateActions, (action) => {
    return this.branchUpdateService.updateBranch(action.payload.data.branch, action.payload.data.id);
  });

  constructor(private branchUpdateService: BranchUpdateService,
              private branchUpdateActions: BranchUpdateActions,
              private actions$: Actions) {
  }
}
