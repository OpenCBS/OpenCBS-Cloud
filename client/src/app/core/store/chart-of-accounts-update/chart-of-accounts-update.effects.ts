import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ChartOfAccountUpdateActions } from './chart-of-accounts-update.actions';
import { ChartOfAccountUpdateService } from './chart-of-accounts-update.service';
import { ReduxBaseEffects } from '../redux-base';

@Injectable()
export class ChartOfAccountUpdateEffects {

  @Effect()
  update_chart_of_account$ = ReduxBaseEffects.getConfig(this.actions$, this.chartOfAccountUpdateActions, (action) => {
    return this.chartOfAccountUpdateService.updateChartOfAccount(action.payload.data.chartOfAccountEditData, action.payload.data.id);
  });

  constructor(private chartOfAccountUpdateService: ChartOfAccountUpdateService,
              private chartOfAccountUpdateActions: ChartOfAccountUpdateActions,
              private actions$: Actions) {
  }
}
