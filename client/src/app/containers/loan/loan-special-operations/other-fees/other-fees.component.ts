import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IOtherFees } from '../../../../core/store/other-fees/other-fees.reducer';
import { OtherFeesActions } from '../../../../core/store/other-fees/other-fees.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OtherFeesService } from '../../../../core/store/other-fees/other-fees.service';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ILoanInfo } from '../../../../core/store/loans/loan/loan.reducer';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { ParseDateFormatService } from '../../../../core/services';
import { Subscription } from 'rxjs/Rx';


@Component({
  selector: 'cbs-other-fees',
  templateUrl: 'other-fees.component.html',
  styles: [`:host {
      display: block;
      overflow-y: auto;
      height: 100%;
  }`]
})

export class OtherFeesComponent implements OnInit, OnDestroy {
  public otherFees: any;
  public headerTitle: string;
  public type: string;
  public isOpen = false;
  public form: FormGroup;
  public loanId: number;
  public feeId: number;
  public breadcrumb = [];

  private routeSub: Subscription;
  private loanSub: Subscription;

  constructor(private otherFeesStore$: Store<IOtherFees>,
              private otherFeesActions: OtherFeesActions,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private parseDateFormatService: ParseDateFormatService,
              private otherFeesService: OtherFeesService,
              private loanStore$: Store<ILoanInfo>) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.parent.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanId = params.id;
        this.otherFeesStore$.dispatch(this.otherFeesActions.fireInitialAction(this.loanId));
      }
    });
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          const loanProfile = loan['loan']['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
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
              name: 'OPERATIONS',
              link: `/loans/${loan['loan']['id']}/operations`
            },
            {
              name: 'OTHER_FEES',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1000);
    this.form = new FormGroup({
      amount: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    });
    this.otherFees = this.store$.pipe(select(fromRoot.getOtherFees));
  }

  otherFeeOperations(fee, type) {
    this.isOpen = true;
    const dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
    this.form.controls['date'].setValue(dateNow);
    this.feeId = fee['id'];
    this.type = type;
    if ( type === 'charge' ) {
      this.headerTitle = 'CHARGE_FEE';
    } else if ( type === 'repay' ) {
      this.headerTitle = 'REPAY_FEE';
    } else if ( type === 'waive-off' ) {
      this.headerTitle = 'WAIVE_OFF_FEE'
    }
  }

  submit() {
    const date = this.parseDateFormatService.parseDateValue(this.form.value['date']);
    const time = moment(new Date().getTime()).format('HH:mm:ss.SSS');
    this.form.controls['date'].setValue(date + 'T' + time);
    this.otherFeesService.dispatchOtherFee(this.form.value, this.feeId, this.loanId, this.type)
      .subscribe(response => {
        if ( response.error ) {
          this.toastrService.error(response.message, '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.otherFeesStore$.dispatch(this.otherFeesActions.fireInitialAction(this.loanId));
          this.translate.get('SUCCESS').subscribe((translation: string) => {
            this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
          });
        }
      });
    this.isOpen = false;
    this.form.reset();
  }

  cancel() {
    this.isOpen = false;
    this.form.reset();
  }

  ngOnDestroy() {
    this.otherFeesStore$.dispatch(this.otherFeesActions.fireResetAction());
    this.loanSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
