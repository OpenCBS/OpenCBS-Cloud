import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store/index';
import * as _ from 'lodash'
import { ITermDepositAccountTransactions } from '../../../core/store/index';

@Component({
  selector: 'cbs-term-deposit-account-transactions',
  templateUrl: 'term-deposit-account-transactions.component.html',
  styleUrls: ['term-deposit-account-transactions.component.scss']
})

export class TermDepositAccountTransactionsComponent implements OnInit, OnDestroy {
  public profileType: any;
  public form: FormGroup;
  public transactions: any;
  public startDate: any;

  private MONTH_AGO = moment().startOf('month').format('YYYY-MM-DD');
  private termDepositAccountId: number;
  private termDepositId: number;
  private routeSub: any;
  private transactionsSub: any;
  private termDepositSub: any;
  private breadcrumb: any;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private termDepositAccountTransactionsStore$: Store<ITermDepositAccountTransactions>) {
  }

  loadTransaction() {
    this.startDate = this.MONTH_AGO;

    this.termDepositAccountTransactionsStore$
      .dispatch(new fromStore.LoadTermDepositAccountTransactions({
        id: this.termDepositAccountId,
        period: {
          start: this.MONTH_AGO,
          end: moment().format('YYYY-MM-DD')
        }
      }));
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.termDepositId = +params['id']
    });

    this.termDepositSub = this.store$.select(fromRoot.getTermDepositState).subscribe(termDepositState => {
      if (termDepositState['loaded'] && !termDepositState['error'] && termDepositState['success']) {
        this.termDepositAccountId = _.get(termDepositState, 'termDeposit.accounts.TERM_DEPOSIT.id', null)
        const termDepositProfile = termDepositState['term-deposit']['profile'];
        const profileType = termDepositProfile['type'] === 'PERSON' ? 'people' : 'companies';
        this.breadcrumb = [
          {
            name: termDepositProfile['name'],
            link: `/profiles/${profileType}/${termDepositProfile['id']}/info`
          },
          {
            name: 'TERM_DEPOSITS',
            link: `/profiles/${profileType}/${termDepositProfile['id']}/term-deposits`
          },
          {
            name: 'TERM_DEPOSIT_ACCOUNTS',
            link: ''
          }
        ];
      }
    });

    setTimeout(() => {
      this.store$.dispatch(new fromStore.SetTermDepositBreadcrumb(this.breadcrumb));
    }, 1200);

    setTimeout(() => this.loadTransaction(), 1000);
    this.form = this.fb.group({
      start: new FormControl(this.MONTH_AGO, Validators.required),
      end: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    });

    this.transactionsSub = this.store$.select(fromRoot.getTermDepositAccountTransactionsState)
      .subscribe((transactions: ITermDepositAccountTransactions) => {
        this.transactions = transactions;
      });
  }

  filter() {
    this.startDate = this.form.controls['start'].value;
    this.termDepositAccountTransactionsStore$.dispatch(new fromStore.ResetTermDepositAccountTransactionsReset());

    this.termDepositAccountTransactionsStore$
      .dispatch(new fromStore.LoadTermDepositAccountTransactions({
        id: this.termDepositAccountId,
        period: this.form.value
      }));
  }

  filterByPeriod(period) {
    let startDate = this.MONTH_AGO;
    let endDate = moment().endOf('month').format('YYYY-MM-DD');
    switch (period) {
      case 2:
        startDate = moment().subtract(period, 'days').format('YYYY-MM-DD');
        endDate = moment().format('YYYY-MM-DD');
        break;
      case 7:
        startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
        endDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
        break;
    }

    this.startDate = startDate;
    this.termDepositAccountTransactionsStore$.dispatch(new fromStore.ResetTermDepositAccountTransactionsReset());
    this.termDepositAccountTransactionsStore$
      .dispatch(new fromStore.LoadTermDepositAccountTransactions({
        id: this.termDepositAccountId,
        period: {start: startDate, end: endDate}
      }));
    this.form.setValue({
      start: startDate,
      end: endDate
    });
  }

  onScroll(params) {
    this.termDepositAccountTransactionsStore$
      .dispatch(new fromStore.LoadTermDepositAccountTransactions({
        id: this.termDepositAccountId,
        period: {start: this.startDate, end: moment().format('YYYY-MM-DD')},
        query: params
      }));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.transactionsSub.unsubscribe();
    this.termDepositSub.unsubscribe();
    this.termDepositAccountTransactionsStore$
      .dispatch(new fromStore.ResetTermDepositAccountTransactionsReset());
  }
}
