import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import { ILoanInfo } from '../../../core/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ILoanPayee } from '../../../core/store/loan-payees';
import * as fromStore from '../../../core/store';

@Component({
  selector: 'cbs-loan-payees-list',
  template: '<router-outlet></router-outlet>'
})

export class LoanPayeesListComponent implements OnInit, OnDestroy {
  public loanPayeeInfoState: any;
  public payee: any;
  public loanPayee: any;
  public loanPayeeSub: any;
  public routeSub: any;
  public id: number;
  public loanId: number;

  constructor(private loanStore$: Store<ILoanInfo>,
              private route: ActivatedRoute,
              private router: Router,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id, loanType }) => {
      if (params && params.id) {
        this.loanId = params.id;
        this.store$.dispatch(new fromStore.LoadLoanInfo({id: params.id, loanType: params.loanType}));
      }
    });

    this.loanPayeeSub = this.store$.pipe(select(fromRoot.getLoanPayeeState)).subscribe(
      (loanPayeeState: ILoanPayee) => {
        if (loanPayeeState.loaded && loanPayeeState.success && loanPayeeState.payee) {
          this.loanPayeeInfoState = loanPayeeState;
          this.loanPayee = loanPayeeState.payee;
        }
    });
  }

  ngOnDestroy() {
    this.loanPayeeSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
