import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { ILoanAppState } from '../../../../../core/store/loan-application/loan-application/loan-application.reducer';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';
import { FormLookupControlComponent } from '../../../../../shared/modules/cbs-form/components';

@Component({
  selector: 'cbs-reschedule-form',
  templateUrl: 'reschedule-form.component.html',
  styleUrls: ['reschedule-form.component.scss']
})

export class RescheduleFormComponent implements OnInit, OnDestroy {
  @ViewChild(FormLookupControlComponent, {static: false}) formLookupControlComponent: FormLookupControlComponent;
  public rescheduleForm: FormGroup;
  public loanProduct: any;
  public isLoaded = false;
  public byMaturity: boolean;
  public scheduleTypeConfig = {
    url: `${environment.API_ENDPOINT}schedule-types/lookup`,
    defaultQuery: ''
  };
  public scheduleType: string;

  private loanAppSub: Subscription;

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              public loanApplicationStore$: Store<ILoanAppState>) {
  }

  ngOnInit() {
    this.loanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe(loanAppState => {
        this.scheduleType = loanAppState.loanApplication['scheduleType'];
        this.loanProduct = loanAppState.loanApplication['loanProduct'];
        if ( this.loanProduct && this.loanProduct.scheduleBasedType ) {
          this.byMaturity = this.loanProduct.scheduleBasedType === 'BY_MATURITY';
        }
      });
  }

  createForm() {
    const dateNow = moment().format(environment.DATE_FORMAT_MOMENT),
      dateOneMonthLater = moment().add(1, 'months').format(environment.DATE_FORMAT_MOMENT);

    this.rescheduleForm = this.fb.group({
      rescheduleDate: new FormControl(dateNow, Validators.required),
      firstInstallmentDate: new FormControl(dateOneMonthLater, Validators.required),
      scheduleType: new FormControl(this.scheduleType, Validators.required),
      interestRate: new FormControl('', Validators.required),
      maturity: new FormControl(1, Validators.required),
      maturityDate: new FormControl('', Validators.required),
      gracePeriod: new FormControl(0)
    });

    if ( this.formLookupControlComponent ) {
      this.formLookupControlComponent.reset = true;
    }
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.loanAppSub.unsubscribe();
  }
}
