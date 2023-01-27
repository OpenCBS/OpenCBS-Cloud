import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../core/store';
import { IOperationList, ITillInfo, OperationListActions, TillInfoActions, TillInfoService } from '../../../core/store';
import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import * as fromRoot from '../../../core/core.reducer';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PrintOutService } from '../../../core/services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import { TellerListState } from '../../../core/store/tellers/teller-list';

@Component({
  selector: 'cbs-till-operation-list-details',
  templateUrl: './till-operation-list-details.component.html',
  styleUrls: ['./till-operation-list-details.component.scss']
})
export class TillOperationListDetailsComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public currencies = [];
  public balance: any;
  public tillId: number;
  public tillIdForBreadcrumb: string;
  public operations: Observable<IOperationList>;
  public till: any;
  public searchQuery = '';
  public isLoading = false;
  public queryObject = {
    search: '',
    page: 1
  };

  private routeSub: Subscription;
  private tillInfoSub: Subscription;
  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private operationListStore$: Store<IOperationList>,
              private operationListActions: OperationListActions,
              public toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private tillInfoStore$: Store<ITillInfo>,
              private tillInfoActions: TillInfoActions,
              public translate: TranslateService,
              private printingFormService: PrintOutService,
              private tillStore$: Store<TellerListState>,
              private tillService: TillInfoService) {
  }

  ngOnInit() {
    this.operations = this.store$.select(fromRoot.getOperationListState);
    this.routeSub = this.route.parent.params.subscribe((params: { id }) => {
      if ( params.id ) {
        this.tillId = params.id;
        this.tillStore$.dispatch(new fromStore.LoadTellerList(this.tillId));
        this.breadcrumbLinks = [
          {
            name: 'TELLER_MANAGEMENT',
            link: '/till'
          },
          {
            name: this.tillId,
            link: ''
          },
          {
            name: 'LIST',
            link: ''
          }
        ];
      }
    });

    this.currentPageSub = this.operations.pipe((this.getTillsCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      this.searchQuery = query['search'] ? query['search'] : '';
      if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
        this.operationListStore$.dispatch(this.operationListActions
          .fireInitialAction({tillId: this.tillId, currencyId: '', params: this.queryObject}));
      } else {
        this.operationListStore$.dispatch(this.operationListActions.fireInitialAction({tillId: this.tillId}));
      }
    });
    this.tillInfoStore$.dispatch(this.tillInfoActions.fireInitialAction(this.tillId));

    this.tillInfoSub = this.store$.select(fromRoot.getTillInfoState)
      .subscribe((tillInfo: ITillInfo) => {
        if ( tillInfo.loaded && tillInfo.success && !tillInfo.error ) {
          this.till = tillInfo['data'];
          this.tillIdForBreadcrumb = this.till.id.toString();
          this.breadcrumbLinks = [
            {
              name: 'TELLER_MANAGEMENT',
              link: '/till'
            },
            {
              name: this.tillIdForBreadcrumb,
              link: ''
            },
            {
              name: 'LIST',
              link: ''
            }
          ];

          this.currencies = tillInfo['data']['accounts'].map(account => {
            return account.currency;
          });
          this.currencies.unshift(
            {id: '', name: 'All', code: '003'});
          this.tillStore$.dispatch(new fromStore.SetTellerBreadcrumb(this.breadcrumbLinks));
        }
      });
  }

  getListByCurrency(currencyId) {
    this.operationListStore$
      .dispatch(this.operationListActions.fireInitialAction({tillId: this.tillId, currencyId: currencyId}));
    this.getCurrentBalance();
  }

  getCurrentBalance() {
    const theDate = new Date();
    theDate.setHours(theDate.getHours() + 6);
    const correctDate = theDate.toISOString().split('.')[0];
    this.tillService.getTillBalance(this.tillId, correctDate).pipe(
      catchError(err => observableOf(err)))
      .subscribe(res => this.balance = res);
  }

  getTillsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/till', this.tillId, 'list'], navigationExtras);
  }

  download(value) {
    let objToSend = {};
    let formType = value.operationType === 'DEPOSIT'
      ? 'DEPOSIT_CA'
      : value.operationType === 'WITHDRAW'
        ? 'WITHDRAWAL_CA'
        : 'TILL_CASH_RECEIPT';
    this.isLoading = true;
    this.printingFormService.getForms(formType).subscribe(res => {
      if ( res.err) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        objToSend = {
          entityId: value.id,
          templateId: res[0]['id']
        };

        this.printingFormService.downloadForm(objToSend, formType).subscribe(res => {
          if ( res.err ) {
            this.translate.get('CREATE_ERROR').subscribe((response: string) => {
              this.toastrService.error(res.err, response, environment.ERROR_TOAST_CONFIG);
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
            FileSaver.saveAs(res, `cash-receipt.docx`)
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tillInfoSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
