import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { CurrentUserAppState, ILoanInfo } from '../../../../../core/store';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { RepaymentService } from '../../services/repayment.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ReadOnlyOutputEnum } from '../../../../../shared/enums/ReadOnlyOutputEnum';

@Component({
  selector: 'cbs-repayment-form',
  templateUrl: './repayment-form.component.html',
  styleUrls: ['./repayment-form.component.scss']
})
export class RepaymentFormComponent implements OnInit, OnDestroy {
  @Output() onChangeRepaymentType = new EventEmitter();
  @Output() onTotalEdited = new EventEmitter();
  @Output() onRepaymentDateEdited = new EventEmitter();
  @Output() onPrincipalAndPenaltyEdited = new EventEmitter();
  @Output() onSetMaxAmount = new EventEmitter();
  @Input() maxAmount = '';
  public repaymentForm: FormGroup;
  public repaymentType = [];
  public lastActualizeDate: any;
  public actualizeMsg = null;
  public readOnlyOutput = null;
  public paymentMethodConfig = {
    url: `${environment.API_ENDPOINT}payment-methods/lookup`
  };

  private currentUserSub: Subscription;
  private repaymentTypeSub: Subscription;
  private loan: Subscription;


  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private repaymentService: RepaymentService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.repaymentTypeSub = this.repaymentService.getRepaymentType()
      .subscribe(res => {
        if ( res ) {
          const value = [];
          for (const key in res) {
            value.push({
              value: res[key]['name'],
              name: this.translate.instant(res[key]['name'])
            })
          }
          this.repaymentType = value;
        }
      });

    this.repaymentForm = this.fb.group({
      date: new FormControl(moment().format(environment.DATE_FORMAT_MOMENT), Validators.required),
      paymentMethod: new FormControl(''),
      repaymentType: new FormControl('NORMAL_REPAYMENT', Validators.required),
      penalty: new FormControl({value: '', disabled: true}, Validators.required),
      interest: new FormControl({value: '', disabled: true}, Validators.required),
      principal: new FormControl({value: '', disabled: true}, Validators.required),
      total: new FormControl('', [Validators.required]),
      earlyRepaymentFee: new FormControl({value: '', disabled: true})
    });

    const repaymentDate = new Date(moment(this.repaymentForm.value.date).format(environment.DATE_FORMAT_MOMENT));
    this.checkLastActualizeDateValidity(repaymentDate);

    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe((user: CurrentUserAppState) => {
        user.permissions.forEach((item) => {
          if ( item.group === 'LOANS' && !item.permissions.includes('PAST_REPAYMENTS') ) {
            this.repaymentForm.controls['date'].disable({emitEvent: false, onlySelf: true});
          }
        })
      });
  }

  repaymentDateChanged() {
    this.markAsEdited('date')
    const repaymentDate = new Date(moment(this.repaymentForm.value.date).format(environment.DATE_FORMAT_MOMENT));
    this.checkLastActualizeDateValidity(repaymentDate);
  }

  public checkLastActualizeDateValidity(repaymentDate: Date): void {
    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe((data: ILoanInfo) => {
        if ( data.loan['loanAdditionalInfoEntity'] ) {
          const actualizeDate = new Date(moment(data.loan['loanAdditionalInfoEntity'].lastActualizeDate)
            .format(environment.DATE_FORMAT_MOMENT));
          // @ts-ignore
          const diffTime = Math.abs(actualizeDate - repaymentDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if ( diffDays !== 0 ) {
            this.readOnlyOutput = ReadOnlyOutputEnum.Warning;
            this.actualizeMsg = this.translate.instant('ACTUALIZE_DATE_WARNING_MSG');
          } else {
            this.readOnlyOutput = ReadOnlyOutputEnum.OK;
            this.actualizeMsg = null;
          }

          this.lastActualizeDate = data.loan['loanAdditionalInfoEntity'].lastActualizeDate;
        }
      });
  }

  markAsEdited(control) {
    if ( control === 'total' && this.repaymentForm.controls['total'].value ) {
      this.onTotalEdited.emit();
    }
    if ( control === 'principal_penalty' && this.repaymentForm.controls['principal'].value
      || this.repaymentForm.controls['penalty'].value) {
      this.onPrincipalAndPenaltyEdited.emit();
    }
    if ( control === 'repayment_type' ) {
      this.onChangeRepaymentType.emit();
    }
    if ( control === 'date' ) {
      this.onRepaymentDateEdited.emit();
    }
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
    this.repaymentTypeSub.unsubscribe();
    this.loan.unsubscribe();
  }
}
