import { Component, OnInit, ViewChild, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { IBorrowingCreateState } from '../../../core/store/borrowings/borrowing-create/borrowing-create.reducer';
import { IBorrowingFormState } from '../../../core/store/borrowings/borrowing-form/borrowing-form.interfaces';
import { BorrowingFormExtraService } from '../shared/services/borrowing-extra.service';
import { Observable } from 'rxjs';
import { BorrowingSideNavService } from '../shared/services/borrowing-side-nav.service';
import { ParseDateFormatService } from '../../../core/services';
import { Subscription } from 'rxjs/Rx';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-borrowing-wrap-create',
  templateUrl: 'borrowing-wrap-create.component.html'
})

export class BorrowingWrapCreateComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = {
    collection: 'custom',
    class: 'custom42',
    name: 'custom42'
  };
  public borrowingNavConfig = [];
  public profile: any;
  public isLoading = false;
  public borrowingFormState: IBorrowingFormState;
  public formStatus: Observable<boolean>;
  public breadcrumb = [];

  private createBorrowingSub: Subscription;
  private borrowingFormSub: Subscription;

  constructor(private createBorrowingStore$: Store<IBorrowingCreateState>,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private store$: Store<fromRoot.State>,
              private borrowingFormStore$: Store<IBorrowingFormState>,
              private borrowingFormExtraService: BorrowingFormExtraService,
              private parseDateFormatService: ParseDateFormatService,
              private borrowingNavConfigSideNavService: BorrowingSideNavService) {
  }

  ngOnInit() {
    this.borrowingNavConfig = this.borrowingNavConfigSideNavService.getNavList('borrowings', {
      editMode: false,
      createMode: true
    });
    this.formStatus = this.borrowingFormExtraService.formStatusSourceChanged$;

    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
    this.borrowingFormStore$.dispatch(new fromStore.SetRouteLL('create'));

    this.borrowingFormSub = this.borrowingFormExtraService.borrowingStateSourceChange$.subscribe(
      (borrowingFormState: IBorrowingFormState) => {
        this.borrowingFormState = borrowingFormState;
        this.profile = this.borrowingFormState.profile;
        this.breadcrumb = [
          {
            name: 'BORROWINGS',
            link: `/profiles/${this.profile.profileType}/${this.profile.profileId}/borrowings`
          },
          {
            name: 'BORROWING_ADD',
            link: ''
          }
        ]
      });

    this.createBorrowingSub = this.store$.select(fromRoot.getBorrowingCreateState).subscribe(
      (state: IBorrowingCreateState) => {
        if (state.loaded && state.success && !state.error) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewLoanDetails(state.response.id);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createBorrowingStore$.dispatch(new fromStore.CreateBorrowingReset());
    this.isLoading = false;
  }

  goToViewBorrowings() {
    this.router.navigate(['/profiles', this.profile.profileType, this.profile.profileId, 'borrowings']);
  }

  goToViewLoanDetails(id) {
    this.router.navigate(['borrowings', `${id}`]);
  }

  previewSchedule() {
    this.router.navigate(['/borrowings', 'create', 'schedule']);
  }

  submitForm() {
    if (this.borrowingFormState.valid && this.borrowingFormState.data['amount'] > 0) {
      this.isLoading = true;
      this.disableSubmitBtn(true);

      const objectToSend = Object.assign({}, {
        amount: this.borrowingFormState.data['amount'],
        borrowingProductId: this.borrowingFormState.data['borrowingProductId'],
        interestRate: this.borrowingFormState.data['interestRate'],
        gracePeriod: this.borrowingFormState.data['gracePeriod'],
        scheduleType: this.borrowingFormState.data['scheduleType'],
        maturity: this.borrowingFormState.data['maturity'],
        preferredRepaymentDate: this.parseDateFormatService.parseDateValue(this.borrowingFormState.data['preferredRepaymentDate']),
        profileId: this.borrowingFormState.data['profileId'],
        disbursementDate: this.parseDateFormatService.parseDateValue(this.borrowingFormState.data['disbursementDate']),
        correspondenceAccountId: this.borrowingFormState.data['correspondenceAccountId']
      });

      this.createBorrowingStore$.dispatch(new fromStore.CreateBorrowing(objectToSend));
    }
  }

  ngOnDestroy() {
    this.createBorrowingSub.unsubscribe();
    this.borrowingFormSub.unsubscribe();
    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
  }
}
