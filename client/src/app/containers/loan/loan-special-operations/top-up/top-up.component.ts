import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ILoanInfo } from '../../../../core/store/loans/loan';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { ILoanAppState } from '../../../../core/store/loan-application/loan-application';
import { EntryFeesModalComponent } from '../../../loan-application/shared/components';
import { TopUpService } from '../../shared/services/top-up.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {CCRulesFormComponent} from '../../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-top-up',
  templateUrl: 'top-up.component.html',
  styles: [`:host {
      display: block;
      overflow-y: auto;
      height: 100%;
  }`]
})

export class TopUpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(EntryFeesModalComponent, {static: false}) entryFeeModalComponent: EntryFeesModalComponent;
  public topUpForm: FormGroup;
  public loanAppEntryFees = [];
  public loan: any;
  public loanApp: any;
  public breadcrumb = [];
  public tempArrayFees = [];
  public loanSub: any;

  private loanApplicationSub: any;
  private submitSub: any;

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private topUpService: TopUpService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private loanStore$: Store<ILoanInfo>) {
  }

  ngOnInit() {
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe(loan => {
      if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
        this.loan = loan.loan;
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
            name: 'TOP_UP',
            link: ''
          }
        ];
      }
    });

    this.loanApplicationSub = this.store$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanApp = loanAppState.loanApplication;
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
          if ( this.loanApp.entryFees.length ) {
            this.loanAppEntryFees = Array.from(this.loanApp.entryFees);
            this.transformFees(this.loanAppEntryFees);
          }
        }
      });

    this.topUpForm = this.fb.group({
      amount: new FormControl('', Validators.required),
      interestRate: new FormControl('', Validators.required),
      gracePeriod: new FormControl('', Validators.required),
      disbursementDate: new FormControl('', Validators.required),
      preferredRepaymentDate: new FormControl('', Validators.required),
      maturity: new FormControl('', Validators.required),
    });

    this.submitSub = this.topUpService.submitTopUpSourceChange$.subscribe(status => {
      if ( status ) {
        this.submit();
      }
    });
  }

  transformFees(fees) {
    const newFees = fees.map((fee) => {
      const newFee = Object.assign({}, fee, {
        amount: fee.amount,
        code: fee.entryFee.name,
        edited: false,
        id: fee.entryFee.id,
        maxValue: fee.entryFee.maxValue,
        minValue: fee.entryFee.minValue,
        name: fee.entryFee.name,
        percentage: fee.entryFee.percentage,
        minLimit: fee.entryFee.minLimit,
        maxLimit: fee.entryFee.maxLimit,
        validate: true,
      });
      delete newFee.entryFee;
      delete newFee.rate;
      return newFee
    });

    this.loanAppEntryFees = newFees;

    setTimeout(() => {
      this.entryFeeModalComponent.cachedCalculatedFees = newFees;
      this.entryFeeModalComponent.populateCached(newFees);
    }, 1000);
  }

  ngAfterViewInit() {
    this.topUpForm.valueChanges.subscribe(() => {
      this.topUpService.announceFormStatusChange(this.topUpForm.invalid);
    });
  }

  openEntryFees() {
    this.entryFeeModalComponent.isOpen = true;
  }

  saveNewEntryFeeValues(newValues) {
    this.loanAppEntryFees = newValues;
    this.entryFeeModalComponent.isOpen = false;
    this.tempArrayFees = [...newValues];
  }

  cancel() {
    if ( this.tempArrayFees.length ) {
      this.updateEntryFeeAmountTotal(this.tempArrayFees);
    } else {
      this.updateEntryFeeAmountTotal(this.loanAppEntryFees);
    }
  }

  updateEntryFeeAmountTotal(fees) {
    this.entryFeeModalComponent.populateCached(fees);
  }

  submit() {
    if ( this.topUpForm.valid ) {
      const entryFees = [];
      if ( this.loanAppEntryFees.length ) {
        this.loanAppEntryFees.map(fee => {
          entryFees.push({
            entryFeeId: fee['id'],
            amount: fee['amount']
          });
        });
      }
      const objToSend = Object.assign({}, this.topUpForm.value, {
        entryFees: entryFees
      });
      this.topUpService.topUpLoan(this.loan.id, objToSend).subscribe(res => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(res.error.message, '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.router.navigate(['/loans', this.loan.id, 'info']);
          this.translate.get('TOP_UP_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.submitSub.unsubscribe();
  }
}
