import { filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {
  IBorrowingState,
  IBorrowingFormState
} from '../../../core/store/borrowings';
import { environment } from '../../../../environments/environment';
import { BorrowingSideNavService } from '../shared/services/borrowing-side-nav.service';
import { BorrowingFormExtraService } from '../shared/services/borrowing-extra.service';
import { BorrowingRollbackService } from '../shared/services/borrowing-rollback.service';

@Component({
  selector: 'cbs-borrowing-wrap',
  templateUrl: 'borrowing-wrap.component.html'
})
export class BorrowingWrapComponent implements OnInit, OnDestroy {
  public borrowingStatus: string;
  public breadcrumb = [];
  public svgData = {
    collection: 'custom',
    class: 'custom42',
    name: 'custom42'
  };
  public isLoading = false;
  public borrowingNavConfig = [];
  public borrowing: any;
  public filterEvents: any;
  public opened = false;
  public showRollback = false;

  private routeSub: any;
  private borrowingSub: any;
  private firstChildRouteSub: any;

  constructor(public borrowingStore$: Store<IBorrowingState>,
              public route: ActivatedRoute,
              private borrowingExtraService: BorrowingFormExtraService,
              public borrowingFormStore$: Store<IBorrowingFormState>,
              public borrowingSideNavService: BorrowingSideNavService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public store$: Store<fromRoot.State>,
              private rollbackService: BorrowingRollbackService,
              public router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params && params.id) {
        this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(params.id));
      }
    });

    this.route.firstChild.url.subscribe((data: UrlSegment[]) => {
      this.showRollback = data[0].path === 'events';
      this.filterEvents = data[0].path === 'events';
    });

    this.firstChildRouteSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe((val: NavigationEnd) => {
      const url = val.url.split('/');
      this.showRollback = url[url.length - 1] === 'events';
      this.filterEvents = url[url.length - 1] === 'events';
    });

    this.borrowingSub = this.borrowingStore$.select(fromRoot.getBorrowingState).subscribe(
      (borrowingState: IBorrowingState) => {
        if (borrowingState.loaded && borrowingState.success && borrowingState.borrowing) {
          this.breadcrumb = borrowingState['breadcrumb'];
          this.borrowing = borrowingState.borrowing;
          this.borrowingStatus = borrowingState.borrowing['status'];

          this.borrowingNavConfig = this.borrowingSideNavService.getNavList('borrowings', {
            borrowingId: this.borrowing['id'],
            editMode: false,
            createMode: false,
            status: this.borrowing['status']
          });

          const formData = {
            amount: borrowingState.borrowing['amount'],
            code: borrowingState.borrowing['code'],
            disbursementDate: borrowingState.borrowing['disbursementDate'],
            preferredRepaymentDate: borrowingState.borrowing['preferredRepaymentDate'],
            gracePeriod: borrowingState.borrowing['gracePeriod'],
            installments: borrowingState.borrowing['installments'],
            interestRate: borrowingState.borrowing['interestRate'],
            borrowingId: borrowingState.borrowing['id'],
            borrowingProduct: borrowingState.borrowing['borrowingProduct'],
            maturity: borrowingState.borrowing['maturity'],
            profile: borrowingState.borrowing['profile'],
            correspondenceAccount: borrowingState.borrowing['correspondenceAccount'],
            scheduleType: borrowingState.borrowing['borrowingProduct']['scheduleType']
          };

          this.borrowingFormStore$.dispatch(new fromStore.PopulateLL({
              data: formData,
              valid: true,
            }
          ));
          this.isLoading = false;

        } else if (borrowingState.loaded && !borrowingState.success && borrowingState.error) {
          this.toastrService.error(`ERROR: ${borrowingState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.isLoading = false;
        }
      })
  }

  disburse() {
    this.borrowingStore$.dispatch(new fromStore.DisburseBorrowing(this.borrowing['id']));
  }

  openModal() {
    this.opened = true;
  }

  closeModal() {
    this.opened = false;
  }

  showSystemEvents() {
    this.borrowingExtraService.announceShowSystemEventsStatusChange(true);
  }

  showDeletedEvents() {
    this.borrowingExtraService.announceShowDeletedEventsStatusChange(true);
  }

  resetState() {
    this.borrowingStore$.dispatch(new fromStore.ResetBorrowing());
  }

  rollBack() {
    this.rollbackService.fireRollback();
  }

  ngOnDestroy() {
    this.borrowingSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.firstChildRouteSub.unsubscribe();
    this.borrowingStore$.dispatch(new fromStore.ResetBorrowing());
    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
  }
}
