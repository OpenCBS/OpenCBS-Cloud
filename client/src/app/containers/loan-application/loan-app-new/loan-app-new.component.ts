import { debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoanDetailsFormComponent } from '../shared/components';
import { PayeeFormModalComponent } from '../../../shared/components/payee-form-modal/payee-form-modal.component';
import {
  IEntryFeeItem,
  ILoanAppFormState,
  ILoanProduct,
  IPayeeItem
} from '../../../core/store/loan-application/loan-application-form';

import * as Utils from '../../../core/store/loan-application/loan-application-form/loan-application.utils';
import { EntryFeesModalComponent } from '../shared/components';
import { LoanAppEntryFeesService } from '../../../core/store/loan-application/loan-application-form';
import { LoanAppFormExtraService } from '../shared/services';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as Big from 'big.js';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({
  selector: 'cbs-loan-app-new',
  templateUrl: './loan-app-new.component.html',
  styleUrls: ['./loan-app-new.component.scss']
})

export class LoanAppNewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LoanDetailsFormComponent, {static: true}) formComponent: LoanDetailsFormComponent;
  @ViewChild(PayeeFormModalComponent, {static: false}) payeeFormComponent: PayeeFormModalComponent;
  @ViewChild(EntryFeesModalComponent, {static: false}) entryFeeModalComponent: EntryFeesModalComponent;
  public loanAppFormState: ILoanAppFormState;
  public formVisible = false;
  public formChangeSub: any;
  public isConfirmOpen = false;
  public isCreatePayeeMode = false;
  public scheduleBasedType: string;

  private queryParams = false;
  private payeeToDelete: IPayeeItem;
  private creditLine: any;
  private cachedLoanProductId = null;
  private newAppMode = false;
  private array = [];
  private routeSub: Subscription;
  private loanAppFormSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private loanAppFormExtraService: LoanAppFormExtraService,
              private loanAppEntryFeeService: LoanAppEntryFeesService) {
  }

  ngOnInit() {
    this.formComponent.createForm();
    // This works only in loan app creation
    this.routeSub = this.route.queryParams.subscribe(params => {
      if ( Object.keys(params).length && +params['profileId'] > 0 ) {
        this.loanAppFormStore$.dispatch(new fromStore.SetProfile(params));
        this.newAppMode = true;
        setTimeout(() => {
          this.setProfileData(params);
        });
        this.queryParams = true;
      }
    });

    this.loanAppFormSub = this.store$.pipe(select(fromRoot.getLoanAppFormState)).subscribe(
      (loanAppFormState: ILoanAppFormState) => {
        if ( loanAppFormState.loaded || loanAppFormState.currentRoute === 'create' ) {
          if ( loanAppFormState.creditLine ) {
            this.creditLine = loanAppFormState.creditLine
          }
          this.setProfileData(loanAppFormState.profile, loanAppFormState.members);
          if ( !this.queryParams && !loanAppFormState.profile['profileId'] && loanAppFormState.currentRoute === 'create' ) {
            this.router.navigate(['/profiles']);
          }
          this.loanAppFormState = {
            valid: loanAppFormState.valid,
            data: Object.assign({}, loanAppFormState.data, {
              currencyName: loanAppFormState.loanProduct.currency
                ? loanAppFormState.loanProduct.currency.name
                : loanAppFormState.currencyName,
              total: loanAppFormState.total
            }),
            total: loanAppFormState.total,
            members: loanAppFormState.members,
            creditLine: {...loanAppFormState.creditLine},
            loanProduct: {...loanAppFormState.loanProduct},
            payees: [...loanAppFormState.payees],
            entryFees: [...loanAppFormState.entryFees],
            currencyName: loanAppFormState.loanProduct.currency ? loanAppFormState.loanProduct.currency.name : ''
          };

          if ( !!Object.keys(this.loanAppFormState.data).length ) {
            setTimeout(() => {
              this.formComponent.populateFields(
                this.loanAppFormState.data, this.loanAppFormState.loanProduct, this.loanAppFormState.creditLine
              );
              this.calculateTotalAndFees(true);
              this.formVisible = true;
            });
          } else {
            this.formVisible = true;
          }
        }
      });
  }

  setProfileData(data, members = []) {
    if ( data && data.profileId ) {
      this.formComponent.setProfileTypeToLookup(data.profileType);
      this.formComponent.form.controls['profileId'].setValue(+data.profileId, {emitEvent: false});
      this.formComponent.profileName = data.profileName;
      this.formComponent.profileType = data.profileType;
      this.formComponent.profileId = data.profileId;

      if ( data.profileType === 'GROUP' ) {
        this.formComponent.getProfileMembers(members)
      }
      return;
    }
  }

  ngAfterViewInit(): void {
    let editedEntryFeeCheck = true;
    this.formChangeSub = this.formComponent.form.valueChanges.pipe(
      debounceTime(800)).subscribe(() => {
      const rawValue = this.formComponent.form.getRawValue();

      if ( rawValue.interestRate && !this.newAppMode ) {
        this.loanAppFormState = Object.assign({}, this.loanAppFormState, {
          data: Object.assign({}, this.loanAppFormState.data, rawValue),
          valid: this.formComponent.form.valid
        });
      } else if ( this.newAppMode ) {
        this.loanAppFormState.data = Object.assign({}, this.loanAppFormState.data, rawValue);
      }

      if ( this.newAppMode && !rawValue.loanProductId ) {
        this.loanAppFormState.creditLine = null;
        this.loanAppFormState.loanProduct = null;
        this.loanAppFormState.entryFees = [];
        this.loanAppFormState.payees = [];
      }
      if ( this.newAppMode ) {
        this.calculateTotalAndFees(editedEntryFeeCheck && this.loanAppFormState.entryFees.some(fee => fee.edited));
      } else {
        this.calculateTotalAndFees(true);
      }
      editedEntryFeeCheck = false;
    });
  }

  selectCreditLine(creditLine) {
    this.creditLine = creditLine;
  }

  selectLoanProduct(loanProduct: ILoanProduct) {
    if ( loanProduct ) {
      this.loanAppFormExtraService.getPreferredRepaymentDate(loanProduct['scheduleType']).subscribe(date => {
        this.formComponent.form.controls['preferredRepaymentDate'].setValue(date, {emitEvent: false});
      });
      const dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
      this.formComponent.form.controls['disbursementDate'].setValue(dateNow, {emitEvent: false});
      if ( this.cachedLoanProductId !== loanProduct.id ) {
        this.loanAppFormState.entryFees = [];
        this.loanAppFormState.payees = [];
        this.cachedLoanProductId = loanProduct.id;
        this.formComponent.form.controls['amounts'].setValue(0);
      }
      this.loanAppFormState.loanProduct = loanProduct;
      if ( !!loanProduct.fees.length ) {
        this.loanAppFormState.entryFees = Utils.formatEntryFees(loanProduct.fees);
      }
      this.formComponent.form.controls['scheduleType'].setValue(loanProduct.scheduleType, {emitEvent: false});
    } else {
      this.loanAppFormState.loanProduct = null;
      this.loanAppFormState.entryFees = [];
      this.loanAppFormState.payees = [];
    }
  }

  cancel() {
    if ( this.array.length ) {
      this.calculateTotalAndFees(false);
      this.updateEntryFeeComponentAndCalcTotal(this.array);
    } else {
      this.updateEntryFeeComponentAndCalcTotal(this.loanAppFormState.entryFees);
    }
  }

  calculateTotalAndFees(denyEditedEntryFees ?: boolean) {
    let amounts,
      entryFeesTotal = 0;
    if ( !!this.loanAppFormState.data.loanProductId
      && this.loanAppFormState.loanProduct && this.loanAppFormState.loanProduct.hasPayees && !!this.loanAppFormState.payees.length ) {
      amounts = Utils.countTotal(this.loanAppFormState.payees);
    } else {
      if ( this.formComponent.profileType === 'GROUP' && this.loanAppFormState.data.members ) {
        let membersObj = {};
        this.loanAppFormState.data.members.map(member => {
          membersObj = {...membersObj, ...member}
        });
        amounts = _.values(membersObj)
          .filter(value => value || value === '0')
          .reduce((total, value) => {
            return +total + +value
          }, 0);
      } else {
        amounts = this.loanAppFormState.data.amounts ? this.loanAppFormState.data.amounts : '';
      }
    }
    this.loanAppFormState.data = Object.assign(this.loanAppFormState.data, {'amounts': amounts});
    this.formComponent.form.controls['amounts'].setValue(amounts, {emitEvent: false});
    this.scheduleBasedType = this.formComponent.form.controls['scheduleBasedType'].value;
    if ( this.scheduleBasedType === 'BY_MATURITY' ) {
      this.formComponent.form.controls['maturityDate'].setValidators(Validators.required);
      this.formComponent.form.controls['maturity'].clearValidators();
      this.formComponent.form.controls['maturity'].setErrors(null);
    } else {
      this.formComponent.form.controls['maturity'].setValidators(Validators.required);
      this.formComponent.form.controls['maturityDate'].clearValidators();
      this.formComponent.form.controls['maturityDate'].setErrors(null);
    }
    if ( this.formComponent.form.valid && this.loanAppFormState.entryFees.length ) {
      if ( !denyEditedEntryFees ) {
        this.calculateEntryFee({
          loanProduct: this.loanAppFormState.loanProduct.id,
          amounts: this.loanAppFormState.data.amounts,
          interest: this.loanAppFormState.data.interestRate,
          gracePeriod: this.loanAppFormState.data.gracePeriod,
          maturity: this.loanAppFormState.data.maturity
        }, (calculatedEntryFees: any[]) => {
          this.loanAppFormState.entryFees = this.cacheEntryFees(calculatedEntryFees);
          entryFeesTotal = this.updateEntryFeeComponentAndCalcTotal(this.loanAppFormState.entryFees);
          this.getTotalAndStatus(amounts, 0);
        });
      } else {
        if ( !this.entryFeeModalComponent.cachedCalculatedFees.length ) {
          this.calculateEntryFee({
            loanProduct: this.loanAppFormState.loanProduct.id,
            amounts: this.loanAppFormState.data.amounts,
            interest: this.loanAppFormState.data.interestRate,
            gracePeriod: this.loanAppFormState.data.gracePeriod,
            maturity: this.loanAppFormState.data.maturity
          }, (calculatedEntryFees: any[]) => {
            const cachedFees = this.cacheEntryFees(calculatedEntryFees);
            if ( !this.newAppMode ) {
              this.loanAppFormState.entryFees.map(fee => {
                const index = _.findIndex(cachedFees, (el) => el.id === fee.id);
                Object.assign({}, fee, {minValue: index >= 0 ? cachedFees[index]['minValue'] : 0});
                Object.assign({}, fee, {maxValue: index >= 0 ? cachedFees[index]['maxValue'] : 0});
                Object.assign({}, fee, {validate: index >= 0 ? cachedFees[index]['validate'] : 0});
              });
            }
            entryFeesTotal = this.updateEntryFeeComponentAndCalcTotal(this.loanAppFormState.entryFees);
            this.getTotalAndStatus(amounts, 0);
          });
        } else {
          this.calculateEntryFee({
            loanProduct: this.loanAppFormState.loanProduct.id,
            amounts: this.loanAppFormState.data.amounts,
            interest: this.loanAppFormState.data.interestRate,
            gracePeriod: this.loanAppFormState.data.gracePeriod,
            maturity: this.loanAppFormState.data.maturity
          }, (calculatedEntryFees: any[]) => {
            this.loanAppFormState.entryFees = this.cacheEntryFees(calculatedEntryFees);
            entryFeesTotal = this.updateEntryFeeComponentAndCalcTotal(this.loanAppFormState.entryFees);
            this.getTotalAndStatus(amounts, 0);
          });
        }
      }
    } else {
      this.getTotalAndStatus(amounts, 0);
    }
  }

  calculateEntryFee(data: any, cb: Function) {
    this.loanAppEntryFeeService.calculateFee(data).subscribe((res: any[]) => {
      cb(res);
    });
  }

  cacheEntryFees(calculatedEntryFees: any[]) {
    const newFees = this.loanAppFormState.entryFees.map((fee) => {
      const index = _.findIndex(calculatedEntryFees, (el) => el.id === fee.id);
      return _.assign({}, fee, {
        edited: false,
        amount: index >= 0 ? calculatedEntryFees[index]['amount'] : 0,
        amounts: index >= 0 ? calculatedEntryFees[index]['amounts'] : 0,
        minValue: index >= 0 ? calculatedEntryFees[index]['minValue'] : 0,
        maxValue: index >= 0 ? calculatedEntryFees[index]['maxValue'] : 0,
        validate: index >= 0 ? calculatedEntryFees[index]['validate'] : 0
      });
    });
    this.entryFeeModalComponent.cachedCalculatedFees = newFees;
    return newFees;
  }

  updateEntryFeeComponentAndCalcTotal(fees: IEntryFeeItem[]): number {
    this.entryFeeModalComponent.populateCached(fees);
    return +Utils.countTotal(fees);
  }

  private checkFormValidity(): boolean {
    const status = this.checkStatus(this.formComponent.form.getRawValue());

    const isWeekendDay = this.loanAppFormExtraService.checkForWeekend(this.formComponent.form.controls['maturityDate'].value)
      || this.loanAppFormExtraService.checkForWeekend(this.formComponent.form.controls['disbursementDate'].value);
    const isDisbursementRepaymentDiff = this.loanAppFormExtraService
      .subtractPreferredRepaymentFromDisbursementDate(this.formComponent.form.controls['disbursementDate'].value,
        this.formComponent.form.controls['preferredRepaymentDate'].value);
    const isDisbursementMaturityDateDiff = this.loanAppFormExtraService
      .subtractPreferredRepaymentFromDisbursementDate(this.formComponent.form.controls['disbursementDate'].value,
        this.formComponent.form.controls['maturityDate'].value);
    const isMaturityDateAndMaxMaturityDateDiff = this.loanAppFormExtraService
      .subtractPreferredRepaymentFromDisbursementDate(this.formComponent.form.controls['maturityDate'].value,
        this.loanAppFormExtraService.getMaxMaturityDate(), 'maxMaturityDate');

    return !(status === false
      || (isWeekendDay === true
        || isDisbursementRepaymentDiff === true
        || isDisbursementMaturityDateDiff === true
        || isMaturityDateAndMaxMaturityDateDiff === true));
  }

  getTotalAndStatus(amounts: number, entryFeesTotal: number) {
    amounts = amounts ? amounts : 0;
    const total = Big(amounts).plus(entryFeesTotal ? entryFeesTotal : 0);
    this.formComponent.form.controls['total'].setValue(+total, {emitEvent: false});
    this.loanAppFormState.valid = this.checkFormValidity();
    this.loanAppFormExtraService
      .announceFormStatusChange(this.checkFormValidity());
    this.loanAppFormExtraService.setState(this.loanAppFormState);
  }

  openAddPayeeModal() {
    this.isCreatePayeeMode = true;
    this.payeeFormComponent.openCreateModal();
  }

  openEditPayeeModal(payee) {
    this.isCreatePayeeMode = false;
    this.payeeFormComponent.openEditModal(payee);
  }

  checkStatus(rawValue) {
    if ( rawValue.creditLineId ) {
      const range = [this.creditLine['disbursementAmountMin'], this.creditLine['disbursementAmountMax']];
      return this.formComponent.form.valid && rawValue.profileId && Utils.inRange(rawValue.total, range);
    } else if ( this.loanAppFormState.loanProduct ) {
      const range = [this.loanAppFormState.loanProduct.amountMin, this.loanAppFormState.loanProduct.amountMax];
      return this.formComponent.form.valid && rawValue.profileId && Utils.inRange(rawValue.total, range);
    } else {
      return false;
    }
  }

  deletePayee() {
    this.loanAppFormState.payees.map(item => {
      if ( item.id === this.payeeToDelete.id ) {
        this.loanAppFormState.payees.splice(this.loanAppFormState.payees.indexOf(item), 1);
      }
    });
    this.calculateTotalAndFees();
    this.payeeToDelete = null;
  }

  confirmDeletingPayee(payee: IPayeeItem) {
    if ( payee ) {
      this.payeeToDelete = payee;
      this.isConfirmOpen = true;
    } else {
      console.warn('No payee provided to delete.');
    }
  }

  closeConfirmPopup() {
    this.payeeToDelete = null;
  }

  submitPayee(data) {
    if ( this.isCreatePayeeMode ) {
      this.loanAppFormState.payees.push(Object.assign(
        {},
        data,
        {id: Utils.addUniqueLocalId(this.loanAppFormState.payees)}
      ));
    } else {
      const newPayees = this.loanAppFormState.payees;
      newPayees.map(item => {
        if ( item['id'] === data['id'] ) {
          newPayees.splice(newPayees.indexOf(item), 1, data);
        }
      });
      this.loanAppFormState.payees = newPayees;
    }
    this.calculateTotalAndFees();
  }

  openEntryFeeDetails() {
    this.entryFeeModalComponent.isOpen = true;
  }

  saveNewEntryFeeValues(newValues) {
    this.loanAppFormState.entryFees = [...newValues];
    this.array = this.loanAppFormState.entryFees = [...newValues];
    this.entryFeeModalComponent.isOpen = false;
  }

  ngOnDestroy() {
    if ( this.formChangeSub ) {
      this.formChangeSub.unsubscribe()
    }
    this.loanAppFormSub.unsubscribe();
    this.loanAppFormStore$.dispatch(new fromStore.Populate({
        data: this.loanAppFormState.data,
        total: this.loanAppFormState.total,
        valid: this.loanAppFormState.valid && this.loanAppFormState.data.amounts.length,
        creditLine: this.loanAppFormState.creditLine,
        loanProduct: this.loanAppFormState.loanProduct,
        payees: this.loanAppFormState.payees,
        entryFees: this.loanAppFormState.entryFees
      }
    ));
  }
}
