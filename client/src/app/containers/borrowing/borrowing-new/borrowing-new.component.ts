import { debounceTime } from 'rxjs/operators';
import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store/borrowings';
import { BorrowingDetailsFormComponent } from '../shared/components/borrowing-details-form/borrowing-details-form.component';
import {
  IBorrowingFormState, IBorrowingProduct
} from '../../../core/store/borrowings/borrowing-form/borrowing-form.interfaces';
import { BorrowingFormExtraService } from '../shared/services/borrowing-extra.service';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-borrowing-new',
  templateUrl: './borrowing-new.component.html',
  styleUrls: ['./borrowing-new.component.scss']
})

export class BorrowingNewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BorrowingDetailsFormComponent, {static: false}) formComponent: BorrowingDetailsFormComponent;
  public borrowingFormState: IBorrowingFormState;
  public formVisible = false;
  public borrowingFormSub: any;
  private queryParams = false;
  public formChangeSub: any;
  private routeSub: any;
  private cachedLoanProductId = null;

  constructor(public route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private borrowingFormExtraService: BorrowingFormExtraService,
              public borrowingFormStore$: Store<IBorrowingFormState>) {
  }

  ngOnInit() {
    this.formComponent.createForm();
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length && +params['profileId'] > 0) {
        this.borrowingFormStore$.dispatch(new fromStore.SetProfileLL(params));
        setTimeout(() => {
          this.setProfileData(params);
        });
        this.queryParams = true;
      }
    });

    this.borrowingFormSub = this.store$.select(fromRoot.getBorrowingFormState).subscribe(
      (borrowingFormState: IBorrowingFormState) => {
        if (borrowingFormState.loaded || borrowingFormState.currentRoute === 'create') {
          this.setProfileData(borrowingFormState.profile);
          if (!this.queryParams && !borrowingFormState.profile['profileId'] && borrowingFormState.currentRoute === 'create') {
            this.router.navigate(['/profiles']);
          }
          this.borrowingFormState = {
            valid: borrowingFormState.valid,
            data: Object.assign({}, borrowingFormState.data),
            profile: borrowingFormState.profile,
            borrowingProduct: {...borrowingFormState.data.borrowingProduct},
          };

          if (!!Object.keys(this.borrowingFormState.data).length) {
            setTimeout(() => {
              this.formComponent.populateFields(this.borrowingFormState.data, this.borrowingFormState.borrowingProduct);
              this.formVisible = true;
            });
          } else {
            this.formVisible = true;
          }
        }
      }
    );
  }

  ngAfterViewInit() {
    this.formChangeSub = this.formComponent.form.valueChanges.pipe(
      debounceTime(300)).subscribe(data => {
      const rawValue = this.formComponent.form.getRawValue();
      this.borrowingFormState = Object.assign({}, this.borrowingFormState, {
        data: Object.assign({}, this.borrowingFormState.data, rawValue),
        valid: this.formComponent.form.valid
      });
      this.borrowingFormExtraService.announceFormStatusChange(this.borrowingFormState.valid);
      this.borrowingFormExtraService.setState(this.borrowingFormState);
    });
  }

  setProfileData(data) {
    if (data) {
      this.formComponent.form.controls['profileId'].setValue(+data['profileId'], {emitEvent: false});
      this.formComponent.profileName = data['profileName'];
      this.formComponent.form.controls['profileId'].setValue(data['profileId']);
    }
  }

  saveBorrowingProduct(loanProduct: IBorrowingProduct) {
    if (loanProduct) {
      this.borrowingFormExtraService.getFirstMaturityDate(loanProduct['scheduleType']).subscribe(date => {
        this.formComponent.form.controls['preferredRepaymentDate'].setValue(date, {emitEvent: false});
      });
      const dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
      this.formComponent.form.controls['disbursementDate'].setValue(dateNow, {emitEvent: false});
      if (this.cachedLoanProductId !== loanProduct.id) {
        this.cachedLoanProductId = loanProduct.id;
        this.borrowingFormState.data.amount = 0;
        this.formComponent.form.controls['amount'].setValue(0);
      }
      this.borrowingFormState.borrowingProduct = loanProduct;
      this.formComponent.form.controls['scheduleType'].setValue(loanProduct.scheduleType, {emitEvent: false});
    } else {
      this.borrowingFormState.borrowingProduct = null;
    }
  }

  ngOnDestroy() {
    this.borrowingFormSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    this.borrowingFormStore$.dispatch(new fromStore.PopulateLL({
        data: this.borrowingFormState.data,
        valid: this.borrowingFormState.valid && this.borrowingFormState.data.amount > 0,
        borrowingProduct: this.borrowingFormState.borrowingProduct
      }
    ));
  }
}
