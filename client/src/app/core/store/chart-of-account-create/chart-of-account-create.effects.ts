import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ChartOfAccountCreateActions } from './chart-of-account-create.actions';
import { ChartOfAccountCreateService } from './chart-of-account-create.service';
import { ReduxBaseEffects } from '../redux-base';

@Injectable()
export class ChartOfAccountCreateEffects {

  @Effect()
  create_chart_of_account$ = ReduxBaseEffects.getConfig(this.actions$, this.chartOfAccountCreateActions, (action) => {
    return this.chartOfAccountCreateService.createChartOfAccount(action.payload.data);
  });

  constructor(private chartOfAccountCreateService: ChartOfAccountCreateService,
              private chartOfAccountCreateActions: ChartOfAccountCreateActions,
              private actions$: Actions) {
  }
}
