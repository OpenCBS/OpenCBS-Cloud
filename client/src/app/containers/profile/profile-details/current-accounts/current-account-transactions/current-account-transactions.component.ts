import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import * as ProfileUtils from '../../../shared/profile.utils';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  CurrentAccountTransactionsService,
  CurrentUserService,
  getProfileStatus,
  ICurrentAccountTransactions,
  IProfile
} from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService, ParseDateFormatService, PrintOutService } from '../../../../../core/services';
// tslint:disable-next-line:max-line-length
import { AccountingEntriesTransactionService } from '../../../../accounting/accounting-entries/accounting-entries-transaction-service/accounting-entries-transaction.service';
import { BankAccountListService } from '../../../shared/bank-account-list.service';

@Component({
  selector: 'cbs-current-account-transactions',
  templateUrl: 'current-account-transactions.component.html',
  styleUrls: ['current-account-transactions.component.scss']
})

export class CurrentAccountTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild('dropdown', {static: false}) dropdown: ElementRef;
  public navElements = [];
  public profileId: any;
  public profileType: any;
  public permissions = [];
  public profile: any;
  public form: FormGroup;
  public transactionForm: FormGroup;
  public transactions: any;
  public transactionDebit: boolean;
  public transactionsData: any;
  public startDate: any;
  public isOpen = false;
  public currentInstance: string;
  public isLoading: boolean;
  public isModalOpened = false;
  public modalTitle: string;
  public bankAccounts = [];
  public receiptFormId: number;
  public receiptFormLabel: any;
  public queryObject = {
    page: 1
  };
  public config = {
    url: `${environment.API_ENDPOINT}accounting/lookup/BANK_ACCOUNT`
  };
  public type: string;

  private MONTH_AGO = moment().startOf('month').format('YYYY-MM-DD');
  private currentAccountId: number;
  private routeSub: Subscription;
  private paramsSub: Subscription;
  private routeParentSub: Subscription;
  private transactionsSub: Subscription;
  private permissionSub: Subscription;
  private currentPageSub: Subscription;
  private statusSub: Subscription;

  constructor(private route: ActivatedRoute,
              private profileStore$: Store<IProfile>,
              private fb: FormBuilder,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private printingFormService: PrintOutService,
              private accountingEntriesTransactionService: AccountingEntriesTransactionService,
              private currentAccountTransactionsStore$: Store<ICurrentAccountTransactions>,
              private bankAccountListService: BankAccountListService,
              private currentAccountTransactionsService: CurrentAccountTransactionsService,
              private currentUserService: CurrentUserService,
              private parseDateFormatService: ParseDateFormatService,
              private commonService: CommonService) {
  }

  loadTransaction() {
    this.startDate = this.MONTH_AGO;

    this.currentAccountTransactionsStore$.dispatch(new fromStore.LoadCurrentAccountTransactions({
      id: this.currentAccountId,
      period: {
        start: this.MONTH_AGO,
        end: moment().format('YYYY-MM-DD')
      }
    }));
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.routeSub = this.route.params.subscribe(params => {
      this.currentAccountId = +params['id']
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;

      if ( this.queryObject.page !== 1 ) {
        this.currentAccountTransactionsStore$.dispatch(new fromStore.LoadCurrentAccountTransactions({
          id: this.currentAccountId,
          period: {start: this.startDate, end: moment().format('YYYY-MM-DD')},
          query: this.queryObject
        }));
      } else {
        this.currentAccountTransactionsStore$.dispatch(new fromStore.LoadCurrentAccountTransactions({
          id: this.currentAccountId,
          period: {
            start: this.MONTH_AGO,
            end: moment().format('YYYY-MM-DD')
          }
        }));
      }
    });

    this.routeParentSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
    });

    this.transactionForm = this.fb.group({
      debitAccountId: new FormControl('', Validators.required),
      creditAccountId: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      createdAt: new FormControl('', Validators.required),
      autoPrint: new FormControl(''),
    });

    this.bankAccountListService.getBankAccounts(['BANK_ACCOUNT'])
      .subscribe((data: any) => {
        if ( data.content ) {
          this.bankAccounts = data.content.map(account => ({
            value: account.id,
            name: account.name
          }))
        }
      });

    this.loadTransaction();
    this.form = this.fb.group({
      start: new FormControl(this.MONTH_AGO, Validators.required),
      end: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    });

    this.profile = this.store$.pipe(select(fromRoot.getProfileState));

    this.transactionsSub = this.store$.pipe(select(fromRoot.getCurrentAccountTransactionsState))
      .subscribe((transactions: ICurrentAccountTransactions) => {
        this.transactions = transactions;
      });

    this.transactionsData = this.store$.pipe(select(fromRoot.getCurrentAccountTransactionsState));
    this.currentPageSub = this.transactionsData.pipe(this.getTransactionsCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.statusSub = this.store$.pipe(select(fromRoot.getProfileState), (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });

    this.printingFormService.getForms('GENERAL_LEDGER').subscribe(res => {
      if ( res.err ) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.receiptFormId = res[0]['id'];
        this.receiptFormLabel = res[0]['label'];
      }
    });
  }

  public isImpactFinance() {
    return this.currentInstance === 'impact-finance';
  }

  makeTransaction(type) {
    this.type = type;
    this.transactionDebit = this.type === 'deposit';
    this.transactionForm.reset();
    this.modalTitle = type === 'deposit' ? 'DEPOSIT' : 'WITHDRAW';
    this.isModalOpened = true;
    if ( this.type === 'deposit' ) {
      this.transactionForm.controls['creditAccountId'].setValue(this.currentAccountId);
    } else {
      this.transactionForm.controls['debitAccountId'].setValue(this.currentAccountId);
    }
  }

  setBankAccount(bankAccountData) {
    if ( this.type !== 'deposit' ) {
      this.transactionForm.controls['creditAccountId'].setValue(bankAccountData);
    } else {
      this.transactionForm.controls['debitAccountId'].setValue(bankAccountData);
    }
  }

  cancel() {
    this.isModalOpened = false;
  }

  submit() {
    this.isLoading = true;
    // tslint:disable-next-line:max-line-length
    const dateNow = this.parseDateFormatService.parseDateValue(this.transactionForm.controls['createdAt'].value);
    let dateOperation = '';
    if ( dateNow.length < 19 ) {
      dateOperation = dateNow + moment().format('THH:mm:ss');
    } else {
      dateOperation = dateNow;
    }
    this.transactionForm.controls['createdAt'].setValue(dateOperation);
    this.accountingEntriesTransactionService.addSingleTransaction(this.transactionForm.value)
      .subscribe(res => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          if ( this.transactionForm.controls['autoPrint'].value ) {
            const objToSend = {
              entityId: res.id,
              templateId: this.receiptFormId
            };
            setTimeout(() => {
              this.downloadForm(objToSend);
            }, 500)
          }
          this.toastrService.clear();
          this.translate.get('CREATE_SUCCESS')
            .subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
          this.isLoading = false;
          this.isModalOpened = false;
          this.loadTransaction();
        }
      });
  }

  downloadForm(objToSend) {
    this.printingFormService.downloadForm(objToSend, 'GENERAL_LEDGER')
      .subscribe(resp => {
        if ( resp.err ) {
          this.translate.get('CREATE_ERROR').subscribe((response: string) => {
            this.toastrService.error(resp.err, response, environment.ERROR_TOAST_CONFIG);
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
          FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
        }
      })
  }

  filter() {
    this.currentAccountTransactionsStore$.dispatch(new fromStore.ResetCurrentAccountTransactionsReset());

    this.form.controls['start'].setValue(this.parseDateFormatService.parseDateValue(this.form.value.start));
    this.form.controls['end'].setValue(this.parseDateFormatService.parseDateValue(this.form.value.end));
    this.startDate = this.form.controls['start'].value;
    this.currentAccountTransactionsStore$
      .dispatch(new fromStore.LoadCurrentAccountTransactions({id: this.currentAccountId, period: this.form.value}));
  }

  getTransactionsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  filterByPeriod(period) {
    let startDate = this.MONTH_AGO;
    let endDate = moment().endOf('month').format('YYYY-MM-DD');
    switch (period) {
      case 2:
        startDate = moment().subtract(period, 'days').format('YYYY-MM-DD');
        endDate = moment().format('YYYY-MM-DD');
        break;
      case 7:
        startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
        endDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
        break;
    }

    this.startDate = startDate;

    this.currentAccountTransactionsStore$.dispatch(new fromStore.ResetCurrentAccountTransactionsReset());
    this.currentAccountTransactionsStore$
      .dispatch(new fromStore.LoadCurrentAccountTransactions({
        id: this.currentAccountId,
        period: {start: startDate, end: endDate}
      }));
    this.form.setValue({
      start: startDate,
      end: endDate
    });
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };

    this.router.navigate([`profiles/${this.profileType}/${this.profileId}/current-accounts/${this.currentAccountId}/transactions`]
      , navigationExtras);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.routeParentSub.unsubscribe();
    this.transactionsSub.unsubscribe();
    this.permissionSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.currentAccountTransactionsStore$
      .dispatch(new fromStore.ResetCurrentAccountTransactionsReset());
  }
}
