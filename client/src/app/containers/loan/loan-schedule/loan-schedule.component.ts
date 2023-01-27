import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ILoanInfo } from '../../../core/store';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { ILoanSchedule } from '../../../core/store/loans/loan-schedule/loan-schedule.reducer';
import * as fromRoot from '../../../core/core.reducer';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loan-schedule',
  templateUrl: 'loan-schedule.component.html',
  styles: ['.text-error { font-weight: bold; padding: 0 4px;}']
})

export class LoanScheduleComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  public installments: any;
  public svgData = SVG_DATA;
  public loanId: number;

  private breadcrumbLinks = [];
  private loanScheduleSub: Subscription;
  private loanSub: Subscription;
  private routeSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private loanScheduleStore$: Store<ILoanSchedule>,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.routeSub = this.route.parent.parent.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanId = params.id;
      }
    });

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          const loanProfile = loan['loan']['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: loan['loan']['code'],
              link: ''
            },
            {
              name: 'SCHEDULE',
              link: ''
            }
          ];
        }
      });
    this.loanScheduleSub = this.store$.select(fromRoot.getLoanScheduleState)
      .subscribe((schedule: ILoanSchedule) => {
        if (schedule.loaded && schedule.success) {
          this.installments = schedule['loanSchedule'];
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumbLinks));
          if ( this.installmentsTableComponent ) {
            this.installmentsTableComponent.isLoading = false;
          }
        }
      });
    this.loanScheduleStore$.dispatch(new fromStore.LoadLoanSchedule(this.loanId));
  }

  resetState() {
    this.loanScheduleStore$.dispatch(new fromStore.ResetLoanSchedule());
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.resetState();
    this.loanScheduleSub.unsubscribe();
  }
}
