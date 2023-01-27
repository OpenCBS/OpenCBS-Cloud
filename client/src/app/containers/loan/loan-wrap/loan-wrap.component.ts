import { filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  ILoanInfo,
  ILoanAppState,
} from '../../../core/store';
import { LoanAppSideNavService } from '../../loan-application/shared/services/loan-app-side-nav.service';
import { RepaymentService } from '../shared/services/repayment.service';
import { RollbackService } from '../shared/services/rollback.service';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { LoanAttachmentsExtraService } from '../shared/services/loan-attachments-extra.service';
import { TopUpService } from '../shared/services/top-up.service';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loan-wrap',
  templateUrl: 'loan-wrap.component.html',
  styleUrls: ['loan-wrap.component.scss']
})
export class LoanWrapComponent implements OnInit, AfterViewInit, OnDestroy {
  public LoanAppStatus = LoanAppStatus;
  public loanLoaded = false;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'LOANS',
      link: '/loans'
    }
  ];
  public oldAppStatus: any;
  public loanStatus: any;
  public loan: any;
  public routeSub: any;
  public loanId: number;
  public loanNavConfig: any;
  public loanApplication: any;
  public showHeader = true;
  public loanAppLoaded = false;
  public showRollback = false;
  public showTopUpBtn = false;
  public showEntityInfo = false;
  public topUpFormStatus = true;
  public readOnly = false;
  public checkedShowSystemEvents = false;
  public checkedShowDeletedEvents = false;
  public isLoading = false;

  private loanSub: Subscription;
  private loanAppSub: Subscription;
  private repaymentChangeSub: Subscription;
  private firstChildRouteSub: Subscription;

  constructor(private route: ActivatedRoute,
              private loanApplicationStore$: Store<ILoanAppState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private translate: TranslateService,
              private loanInfoStore$: Store<ILoanInfo>,
              private repaymentService: RepaymentService,
              private loanAppSideNavService: LoanAppSideNavService,
              private rollbackService: RollbackService,
              private topUpService: TopUpService,
              private loanExtraService: LoanAttachmentsExtraService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.params
      .subscribe(
        (params: { id, loanType }) => {
          if ( params && params.id ) {
            this.loanId = params.id;
            this.store$.dispatch(new fromStore.LoadLoanInfo({id: params.id, loanType: params.loanType}));
          }
        });

    // Initial children route check
    this.route.firstChild.url.subscribe((data: UrlSegment[]) => {
      this.showRollback = data[0].path === 'events';
    });

    if ( this.route.firstChild.children.length ) {
      this.route.firstChild.children[0].url.subscribe(res => {
        if ( res.length ) {
          this.showTopUpBtn = res[0].path === 'top-up';
        }
      });
    }

    this.firstChildRouteSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const url = val.url.split('/');
        this.showRollback = url[url.length - 1] === 'events';
        this.showTopUpBtn = url[url.length - 1] === 'top-up';
        if ( !this.showRollback ) {
          this.checkedShowSystemEvents = false;
          this.checkedShowDeletedEvents = false;
        }
      });

    let navListGenerated = false;
    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe((loanState: ILoanInfo) => {
        if ( loanState.success && loanState.loaded && loanState['loan'] ) {
          this.loan = loanState['loan'];
          this.readOnly = this.loan.readOnly;
          this.loanLoaded = true;
          this.loanStatus = loanState['loan']['status'];
          this.breadcrumbLinks = loanState['breadcrumb'];
          if ( !this.loanAppLoaded ) {
            this.loadLoanApp(this.loan.loanApplicationId);
          }
          this.showEntityInfo = true;
        } else if ( loanState.loaded && !loanState.success && loanState.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(loanState.errorMessage, res, environment.ERROR_TOAST_CONFIG);
            this.router.navigate(['loans']);
          });
        }
      });

    this.loanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState['loanApplication'] ) {
          this.loanAppLoaded = true;
          this.loanApplication = loanAppState['loanApplication'];
          this.oldAppStatus = this.loanStatus;
          if ( !navListGenerated || this.loanStatus !== this.oldAppStatus ) {
            this.loanNavConfig = this.loanAppSideNavService.getNavList('loans', {
              loanAppId: this.loan ? this.loan['id'] : this.loanApplication['loan']['id'],
              editMode: false,
              createMode: false,
              hasPayee: loanAppState['loanApplication']['payees'],
              status: this.loanApplication['status'],
              loanType: this.loan ? this.loan['profile']['type'] : this.loanApplication['profile']['profileType']
            });
            this.isLoading = false;
            navListGenerated = true;
          }
        }
      });
  }

  showSystemEvents() {
    this.checkedShowSystemEvents = !this.checkedShowSystemEvents;
    this.loanExtraService.announceShowSystemEventsStatusChange(true);
  }

  showDeletedEvents() {
    this.checkedShowDeletedEvents = !this.checkedShowDeletedEvents;
    this.loanExtraService.announceShowDeletedEventsStatusChange(true);
  }

  submitTopUpForm() {
    this.topUpService.submitTopUpStatusChange(true);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.repaymentChangeSub = this.repaymentService.repaymentActiveSourceChanged$
        .subscribe(
          (change: boolean) => {
            this.showHeader = !change;
          }
        );
    });
    this.topUpService.topUpFormStatusChanged$
      .subscribe(
        status => {
          this.topUpFormStatus = status;
        });
    this.cdr.detectChanges();
  }

  loadLoanApp(id) {
    this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(id));
  }

  resetState() {
    this.loanInfoStore$.dispatch(new fromStore.ResetLoanInfo());
    this.loanApplicationStore$.dispatch(new fromStore.ResetLoanApplication());
  }

  rollBack() {
    this.rollbackService.fireRollback();
    if ( this.checkedShowSystemEvents ) {
      this.showSystemEvents();
    }
    if ( this.checkedShowDeletedEvents ) {
      this.showDeletedEvents();
    }
  }

  ngOnDestroy() {
    this.loanAppSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanSub.unsubscribe();
    if ( this.repaymentChangeSub ) {
      this.repaymentChangeSub.unsubscribe();
    }
    this.firstChildRouteSub.unsubscribe();
    this.resetState();
  }
}
