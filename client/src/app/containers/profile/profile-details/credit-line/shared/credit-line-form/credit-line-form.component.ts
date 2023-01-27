import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import { ICreditLine, PenaltiesState } from '../../../../../../core/store';
import { Subscription } from 'rxjs/Rx';
import * as fromStore from '../../../../../../core/store';

const EARLY_PARTIAL_REPAYMENT_FEE_TYPE = [
  {
    value: 'OLB',
    name: 'OLB'
  },
  {
    value: 'RECEIVED_AMOUNT',
    name: 'RECEIVED_AMOUNT'
  }
];
const EARLY_TOTAL_REPAYMENT_FEE_TYPE = [
  {
    value: 'OLB',
    name: 'OLB'
  },
  {
    value: 'AMOUNT_DUE',
    name: 'AMOUNT_DUE'
  }
];

@Component({
  selector: 'cbs-credit-line-form',
  templateUrl: './credit-line-form.component.html',
  styleUrls: ['./credit-line-form.component.scss']
})

export class CreditLineFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isCreateMode = false;
  @Output() onPenaltyChanged = new EventEmitter();
  public form: FormGroup;
  public isHidden = true;
  public earlyPartialRepaymentFeeType = EARLY_PARTIAL_REPAYMENT_FEE_TYPE;
  public earlyTotalRepaymentFeeType = EARLY_TOTAL_REPAYMENT_FEE_TYPE;
  public selectedPenalties = [];
  public allPenalties = [];
  public formConfig = {
    loanProductLookupUrl: {
      url: `${environment.API_ENDPOINT}loan-products/lookup?availability=COMPANY`,
      defaultQuery: ''
    }
  };
  private isNewProduct = true;
  private penaltiesSub: Subscription;
  private creditLineSub: Subscription;

  constructor(private store$: Store<fromRoot.State>,
              private penaltiesStore$: Store<PenaltiesState>) {
    this.penaltiesSub = this.store$.pipe(select(fromRoot.getPenaltiesState))
      .subscribe((penaltiesState: PenaltiesState) => {
        if ( penaltiesState.success && penaltiesState.loaded && penaltiesState.penalties ) {
          this.allPenalties = [];
          penaltiesState.penalties.map(penalties => {
            this.allPenalties.push(penalties);
          });
          if ( this.allPenalties.length ) {
            this.sortDataByName(this.allPenalties);
            this.compareData(this.selectedPenalties, this.allPenalties);
          }
        }
      });
  }

  ngOnInit() {
   this.loadPenalty();
   this.createForm();

    this.creditLineSub = this.store$.pipe(select(fromRoot.getCreditLineState))
      .subscribe(
        (creditLineState: ICreditLine) => {
          if ( creditLineState.loaded && creditLineState.success ) {
            this.formConfig.loanProductLookupUrl = {
              ...this.formConfig.loanProductLookupUrl,
              defaultQuery: creditLineState.creditLine['loanProduct'] ? creditLineState.creditLine['loanProduct'].name : ''
            };

            this.selectedPenalties = Object.assign([], this.selectedPenalties);
          }
        });
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      lastDisbursementDate: new FormControl('', Validators.required),
      maturityDate: new FormControl('', Validators.required),
      committedAmount: new FormControl('', Validators.required),
      disbursementAmountMin: new FormControl('', Validators.required),
      disbursementAmountMax: new FormControl('', Validators.required),
      loanProductId: new FormControl('', Validators.required),
      interestRateMin: new FormControl('', Validators.required),
      interestRateMax: new FormControl('', Validators.required),
      structuringFees: new FormControl('', Validators.required),
      entryFees: new FormControl('', Validators.required),
      earlyPartialRepaymentFeeType: new FormControl('', Validators.required),
      earlyPartialRepaymentFeeValue: new FormControl('', Validators.required),
      earlyTotalRepaymentFeeType: new FormControl('', Validators.required),
      earlyTotalRepaymentFeeValue: new FormControl('', Validators.required),
    })
  }

  loadPenalty() {
    this.penaltiesStore$.dispatch(new fromStore.LoadPenalties());
  }

  hasError(controlName: string) {
    return this.form.get(controlName).errors && this.form.get(controlName).touched;
  }

  isValid(controlName: string) {
    return this.form.get(controlName).invalid && this.form.get(controlName).touched
  }

  ngAfterViewInit() {
    if ( this.isCreateMode ) {
      this.isHidden = false;
    }
  }

  selectedPenalty(penalty) {
    this.selectedPenalties.push(penalty);
    this.onPenaltyChanged.emit();
  }

  deletePenalty(penalty) {
    this.allPenalties.push(penalty);
    this.sortDataByName(this.allPenalties);
    this.onPenaltyChanged.emit();
  }

  sortDataByName(data) {
    data.sort((a, b) => {
      if ( a.name.toLowerCase() > b.name.toLowerCase() ) {
        return 1;
      }
      if ( a.name.toLowerCase() < b.name.toLowerCase() ) {
        return -1;
      }
      return 0;
    });
  }

  compareData(selectedData, all) {
    selectedData.map(value => {
      all.map(val => {
        if ( value['id'] === val['id'] ) {
          all.splice(all.indexOf(val), 1);
        }
      });
    });
  }

  populateFields(creditLine) {
    for (const key in creditLine) {
      if ( this.form.controls.hasOwnProperty(key) && creditLine.hasOwnProperty(key) ) {
        this.form.controls[key].setValue(creditLine[key], {emitEvent: false});
      }
      if ( key === 'loanProduct' ) {
        this.form.controls['loanProductId'].setValue(creditLine['loanProduct'] ? creditLine['loanProduct']['id'] : null);
      }
    }
    this.isHidden = false;
    this.isNewProduct = false;
    this.form.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.penaltiesSub.unsubscribe();
    this.creditLineSub.unsubscribe();
  }
}
