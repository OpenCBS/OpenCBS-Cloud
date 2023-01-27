import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import {Observable} from 'rxjs';
import {ILoanInfo} from '../../../../../core/store/loans/loan';


@Component({
  selector: 'cbs-loan-info-entity',
  templateUrl: './loan-info-entity.component.html',
  styleUrls: ['./loan-info-entity.component.scss']
})
export class LoanInfoEntityComponent implements OnInit {
  public loan: Observable<ILoanInfo>;

  constructor(private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState));
  }
}
