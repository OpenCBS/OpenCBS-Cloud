import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ChartOfAccountsActions } from './chart-of-accounts.actions';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { ReduxBaseEffects } from '../redux-base';

@Injectable()
export class ChartOfAccountsEffects {


  @Effect()
  load_chart_of_accounts$ = ReduxBaseEffects.getConfig(this.actions$, this.accountsActions, () => {
    return this.accountsService.getChartOfAccounts();
  });

  constructor(private accountsService: ChartOfAccountsService,
              private accountsActions: ChartOfAccountsActions,
              private actions$: Actions) {
  }
}
