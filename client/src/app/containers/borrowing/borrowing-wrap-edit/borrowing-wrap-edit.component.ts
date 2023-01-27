import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { IBorrowingFormState } from '../../../core/store/borrowings';
import { Observable } from 'rxjs';
import { BorrowingFormExtraService } from '../shared/services/borrowing-extra.service';
import { IBorrowingState } from '../../../core/store/borrowings';
import { IBorrowingUpdateState } from '../../../core/store/borrowings';
import { BorrowingSideNavService } from '../shared/services/borrowing-side-nav.service';
import { ParseDateFormatService } from '../../../core/services';
import { Subscription } from 'rxjs/Rx';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-borrowing-wrap-edit',
  templateUrl: 'borrowing-wrap-edit.component.html'
})

export class BorrowingWrapEditComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = {
    collection: 'custom',
    class: 'custom42',
    name: 'custom42'
  };
  public borrowingNavConfig = [];
  public borrowingFormState: IBorrowingFormState;
  public formStatus: Observable<boolean>;
  public breadcrumbLinks = [];
  public borrowing: any;
  public borrowingId: number;

  private routeSub: Subscription;
  private borrowingSub: Subscription;
  private updateBorrowingSub: Subscription;
  private borrowingDataSub: Subscription;

  constructor(private updateBorrowingStore$: Store<IBorrowingUpdateState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private borrowingFormStore$: Store<IBorrowingFormState>,
              private borrowingFormExtraService: BorrowingFormExtraService,
              private parseDateFormatService: ParseDateFormatService,
              private borrowingSideNavService: BorrowingSideNavService,
              private borrowingStore$: Store<IBorrowingState>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formStatus = this.borrowingFormExtraService.formStatusSourceChanged$;

    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
    this.borrowingFormStore$.dispatch(new fromStore.SetRouteLL('edit'));

    this.updateBorrowingSub = this.store$.select(fromRoot.getBorrowingUpdateState).subscribe(
      (state: IBorrowingUpdateState) => {
        if (state.loaded && state.success && !state.error) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewBorrowingDetails(state.response.id);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params && params.id) {
        this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(params.id));
      }
    });


    this.borrowingSub = this.store$.select(fromRoot.getBorrowingState).subscribe(
      (borrowing: IBorrowingState) => {
        if (borrowing.success && borrowing.loaded && borrowing.borrowing) {
          this.borrowing = borrowing.borrowing;
          const borrowingProfile = this.borrowing['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
            },
            {
              name: this.borrowing['code'],
              link: ''
            },
            {
              name: 'EDIT',
              link: ''
            }
          ];
          this.borrowingNavConfig = this.borrowingSideNavService.getNavList('borrowings', {
            editMode: true,
            createMode: false,
            borrowingId: this.borrowing['id'],
            status: this.borrowing['status']
          });
          const formData = {
            amount: this.borrowing.amount,
            code: this.borrowing.code,
            preferredRepaymentDate: this.borrowing.preferredRepaymentDate,
            disbursementDate: this.borrowing.disbursementDate,
            gracePeriod: this.borrowing.gracePeriod,
            installments: this.borrowing.installments,
            interestRate: this.borrowing.interestRate,
            borrowingId: this.borrowing.id,
            borrowingProduct: this.borrowing.borrowingProduct,
            borrowingProductId: this.borrowing.borrowingProduct.id,
            maturity: this.borrowing.maturity,
            profile: this.borrowing.profile,
            profileId: this.borrowing.profile.id,
            correspondenceAccountId: this.borrowing.correspondenceAccount.id,
            scheduleType: this.borrowing.borrowingProduct.scheduleType
          };
          this.borrowingFormStore$.dispatch(new fromStore.PopulateLL({
              data: formData,
              valid: true,
            }
          ));
        } else if (borrowing.loaded && !borrowing.success && borrowing.error) {
          this.toastrService.error(`ERROR: ${borrowing.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.router.navigateByUrl('borrowings');
        }
      });

    this.borrowingDataSub = this.borrowingFormExtraService.borrowingStateSourceChange$.subscribe(data => {
      this.borrowingFormState = data;
    });
  }


  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.updateBorrowingStore$.dispatch(new fromStore.UpdateBorrowingReset());
  }

  goToViewBorrowingDetails(id) {
    this.router.navigate(['borrowings', `${id}`]);
  }

  previewSchedule() {
    this.router.navigate(['/borrowings', this.borrowing['id'], 'edit', 'schedule']);
  }


  submitForm() {
    if (this.borrowingFormState.valid && this.borrowingFormState.data.amount > 0) {
      this.disableSubmitBtn(true);

      const objectToSend = Object.assign({}, {
        amount: this.borrowingFormState.data.amount.toString(),
        preferredRepaymentDate: this.parseDateFormatService.parseDateValue(this.borrowingFormState.data['preferredRepaymentDate']),
        disbursementDate: this.parseDateFormatService.parseDateValue(this.borrowingFormState.data['disbursementDate']),
        gracePeriod: this.borrowingFormState.data['gracePeriod'],
        interestRate: this.borrowingFormState.data['interestRate'],
        borrowingProductId: this.borrowingFormState.data['borrowingProductId'],
        maturity: this.borrowingFormState.data['maturity'],
        profileId: this.borrowingFormState.data['profileId'],
        correspondenceAccountId: this.borrowingFormState.data['correspondenceAccountId'],
        scheduleType: this.borrowingFormState.data['scheduleType'],
      });
      this.updateBorrowingStore$.dispatch(new fromStore.UpdateBorrowing({
        data: objectToSend,
        borrowingId: this.borrowing['id']
      }));
    }
  }


  ngOnDestroy() {
    this.updateBorrowingSub.unsubscribe();
    this.borrowingSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.borrowingDataSub.unsubscribe();
    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
    this.borrowingStore$.dispatch(new fromStore.ResetBorrowing());
  }
}
