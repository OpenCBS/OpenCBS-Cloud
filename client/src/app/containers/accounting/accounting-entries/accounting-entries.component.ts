import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IAccountingEntries } from '../../../core/store/accounting-entries';
import { select, Store } from '@ngrx/store';
import { NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { AccountingEntriesTransactionService } from './accounting-entries-transaction-service/accounting-entries-transaction.service';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from '../../../core/store'
import * as fromRoot from '../../../core/core.reducer';
import { ParseDateFormatService, PrintOutService } from '../../../core/services';
import { FormLookupControlComponent } from '../../../shared/modules/cbs-form/components';
import { Subscription } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { findIndex } from 'lodash'

const SVG_DATA = {collection: 'standard', class: 'social', name: 'social'};

@Component({
  selector: 'cbs-accounting-entries',
  templateUrl: './accounting-entries.component.html',
  styleUrls: ['./accounting-entries.component.scss']
})
export class AccountingEntriesComponent implements OnInit, OnDestroy {
  @ViewChild('lookupDebitAccount', {static: false}) lookupDebitAccount: FormLookupControlComponent;
  @ViewChild('lookupCreditAccount', {static: false}) lookupCreditAccount: FormLookupControlComponent;
  @ViewChild('lookupTransactionTemplate', {static: false}) lookupTransactionTemplate: FormLookupControlComponent;
  public svgData = SVG_DATA;
  public entries: IAccountingEntries;
  public singleTransactionForm: FormGroup;
  public multipleTransactionForm: FormGroup;
  public form: FormGroup;
  public open = false;
  public isSingleTransactionModalOpened = false;
  public isMultipleTransactionModalOpened = false;
  public isLoading: boolean;
  public receiptFormId: number;
  public receiptFormLabel: any;
  public accountFilterConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=${['SUBGROUP', 'BALANCE']}`
  };
  public accountConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=${['BALANCE']}`
  };
  public transactionTemplateConfig = {
    url: `${environment.API_ENDPOINT}transaction-templates/lookup`
  };
  public accountEntriesData: any;
  public minDate = moment().startOf('month').format(environment.DATE_FORMAT_MOMENT);
  public maxDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public queryObject = {
    fromDate: moment().startOf('month').format(environment.DATE_FORMAT_MOMENT),
    toDate: moment().format(environment.DATE_FORMAT_MOMENT),
    page: 1,
    accountId: ''
  };
  public multipleTransactionDebitAccounts = [];
  public multipleTransactionCreditAccounts = [];
  public isDebitTransactionAccount = false;
  public totalAmountAccounts; number;

  private multipleTransactionDebitAccountsValue = [];
  private multipleTransactionCreditAccountsValue = [];
  private entriesSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private entries$: Store<IAccountingEntries>,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private printingFormService: PrintOutService,
              private translate: TranslateService,
              private parseDateFormatService: ParseDateFormatService,
              private accountingEntriesTransactionService: AccountingEntriesTransactionService) {
  }

  ngOnInit() {
    this.entries$.dispatch(new fromStore.LoadAccountingEntries({
      fromDate: moment().startOf('month').format(environment.DATE_FORMAT_MOMENT),
      toDate: moment().format(environment.DATE_FORMAT_MOMENT),
      page: 1,
      accountId: ''
    }));

    this.entriesSub = this.store$.pipe(select(fromRoot.getAccountingEntriesState)).subscribe(
      (state: IAccountingEntries) => {
        this.entries = state;
      });

    this.accountEntriesData = this.entries$.pipe(select(fromRoot.getAccountingEntriesState));
    this.currentPageSub = this.accountEntriesData
      .pipe(this.getLoansCurrentPage())
      .subscribe(
        (page: number) => {
          this.queryObject = Object.assign(
            {},
            this.queryObject,
            {
              page: page
            });
        });

    this.singleTransactionForm = this.fb.group({
      debitAccountId: new FormControl('', Validators.required),
      creditAccountId: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      createdAt: new FormControl('', Validators.required),
      autoPrint: new FormControl(''),
    });

    this.multipleTransactionForm = this.fb.group({
      transactionTemplateId: new FormControl('', Validators.required),
      accountId: new FormControl(''),
      accountWillBeDebit: new FormControl(''),
      amounts: new FormControl(''),
      dateTime: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      autoPrint: new FormControl(''),
    });

    this.form = this.fb.group({
      start: new FormControl(moment().startOf('month').format(environment.DATE_FORMAT_MOMENT), Validators.required),
      end: new FormControl(moment().format(environment.DATE_FORMAT_MOMENT), Validators.required),
      bankAccountId: new FormControl('', Validators.required)
    });

    this.printingFormService.getForms('GENERAL_LEDGER')
      .subscribe(res => {
        if ( res.err ) {
          this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.receiptFormId = res[0]['id'];
          this.receiptFormLabel = res[0]['label'];
        }
      });
  }

  getLoansCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  onScroll(params) {
    this.entries$.dispatch(new fromStore.LoadAccountingEntries(params));
  }

  goToPage(page: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.queryObject, page
      }
    };
    this.router.navigate(['/accounting', 'accounting-entries'], navigationExtras);
    this.entries$.dispatch(new fromStore.LoadAccountingEntries(this.queryObject));
  }

  filter() {
    this.entries$.dispatch(new fromStore.ResetAccountingEntries());
    this.queryObject = {
      page: 1,
      fromDate: this.parseDateFormatService.parseDateValue(this.form.value.start),
      toDate: this.parseDateFormatService.parseDateValue(this.form.value.end),
      accountId: this.form.value.bankAccountId ? this.form.value.bankAccountId : ''
    };
    this.entries$.dispatch(new fromStore.LoadAccountingEntries(this.queryObject));
    this.goToPage(1)
  }

  valid() {
    this.minDate = this.form.value.start;
  }

  openTransactionModal(value) {
    if ( value === 'SINGLE' ) {
      this.isSingleTransactionModalOpened = true;
    } else {
      this.isMultipleTransactionModalOpened = true;
    }
    this.singleTransactionForm.reset();
    this.multipleTransactionForm.reset();
    const dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
    this.singleTransactionForm.controls['createdAt'].setValue(dateNow);
    this.multipleTransactionForm.controls['dateTime'].setValue(dateNow);
    this.lookupDebitAccount.onClearLookup();
    this.lookupCreditAccount.onClearLookup();
    this.lookupTransactionTemplate.onClearLookup();
    this.multipleTransactionDebitAccounts = [];
    this.multipleTransactionCreditAccounts = [];
    this.multipleTransactionDebitAccountsValue = [];
    this.multipleTransactionCreditAccountsValue = [];
  }

  cancel() {
    this.isSingleTransactionModalOpened = false;
    this.isMultipleTransactionModalOpened = false;
  }

  submitSingleTransaction() {
    this.isLoading = true;
    const dateNow = moment(this.singleTransactionForm.controls['createdAt'].value)
      .format(environment.DATE_FORMAT_MOMENT) + moment().format('THH:mm:ss');
    this.singleTransactionForm.controls['createdAt'].setValue(dateNow);
    this.accountingEntriesTransactionService.addSingleTransaction(this.singleTransactionForm.value)
      .subscribe(res => {
        this.submitTransactionResponseValue(res, this.singleTransactionForm);
      });
    this.loadAccountingEntries();
  }

  selectTransactionTemplateValue(value) {
    this.totalAmountAccounts = 0;
    this.isDebitTransactionAccount = value.debitAccounts.length <= 1;
    this.multipleTransactionDebitAccounts = value.debitAccounts;
    this.multipleTransactionCreditAccounts = value.creditAccounts;
  }

  debitAccountsValue(accountId, value) {
    value = parseFloat(value);
    if ( !this.isDebitTransactionAccount ) {
      this.accountsValue(this.multipleTransactionDebitAccountsValue, accountId, value);
    } else {
      this.multipleTransactionDebitAccountsValue = [];
        this.multipleTransactionDebitAccountsValue.push({
          amount: value,
          accountId: accountId
        });
    }
  }

  creditAccountsValue(accountId, value) {
    value = parseFloat(value);
    if ( this.isDebitTransactionAccount ) {
      this.accountsValue(this.multipleTransactionCreditAccountsValue, accountId, value);
    } else {
      this.multipleTransactionCreditAccountsValue = [];
        this.multipleTransactionCreditAccountsValue.push({
          amount: value,
          accountId: accountId
        });
    }
  }

  accountsValue(multipleTransactionAccountsValue, accountId, value) {
    const indexValue = findIndex(multipleTransactionAccountsValue, {'accountId': accountId});
    if ( indexValue !== -1 ) {
      multipleTransactionAccountsValue.splice(indexValue, 1, {
        amount: value,
        accountId: accountId
      });
    } else {
      multipleTransactionAccountsValue.push({
        amount: value,
        accountId: accountId
      });
    }

    this.getAccountsValue();
  }

  getAccountsValue() {
    this.totalAmountAccounts = 0
    if ( this.isDebitTransactionAccount  ) {
      this.multipleTransactionCreditAccountsValue.map(value => {
        this.totalAmountAccounts += parseFloat(value.amount);
      });
    } else {
      this.multipleTransactionDebitAccountsValue.map(value => {
        this.totalAmountAccounts += parseFloat(value.amount);
      })
    }

    return this.totalAmountAccounts
  }

  submitMultipleTransaction() {
    this.isLoading = true;
    const dateNow = moment(this.multipleTransactionForm.controls['dateTime'].value)
      .format(environment.DATE_FORMAT_MOMENT) + moment().format('THH:mm:ss');
    this.multipleTransactionForm.controls['dateTime'].setValue(dateNow);
    this.multipleTransactionForm.controls['accountWillBeDebit'].setValue(this.isDebitTransactionAccount)
    if ( this.isDebitTransactionAccount ) {
      this.multipleTransactionForm.controls['accountId'].setValue(this.multipleTransactionDebitAccounts[0].id);
      this.multipleTransactionForm.controls['amounts'].setValue(this.multipleTransactionCreditAccountsValue);
    } else {
      this.multipleTransactionForm.controls['accountId'].setValue(this.multipleTransactionCreditAccounts[0].id);
      this.multipleTransactionForm.controls['amounts'].setValue(this.multipleTransactionDebitAccountsValue);
    }
    this.accountingEntriesTransactionService.addMultipleTransaction(this.multipleTransactionForm.value)
      .subscribe(res => {
        this.submitTransactionResponseValue(res, this.multipleTransactionForm);
        this.loadAccountingEntries();
      });
  }

  submitTransactionResponseValue(response, transactionForm) {
    if ( response.error ) {
      this.toastrService.clear();
      this.toastrService.error(response.message, '', environment.ERROR_TOAST_CONFIG);
      this.isLoading = false;
    } else {
      if ( transactionForm.controls['autoPrint'].value ) {
        const objToSend = {
          entityId: response.id,
          templateId: this.receiptFormId
        };
        setTimeout(() => {
          this.downloadPrintingForm(objToSend);
        }, 500)
      }
      this.toastrService.clear();
      this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
        this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
      });
      this.isLoading = false;
      this.isSingleTransactionModalOpened = false;
      this.isMultipleTransactionModalOpened = false;
    }
  }

  loadAccountingEntries() {
    this.entries$.dispatch(new fromStore.LoadAccountingEntries(this.queryObject));
  }

  download(id: string | number) {
    this.isLoading = true;
    const objToSend = {
      entityId: id,
      templateId: this.receiptFormId
    };
    this.downloadPrintingForm(objToSend);
  }

  downloadPrintingForm(objToSend) {
    this.printingFormService.downloadForm(objToSend, 'GENERAL_LEDGER')
      .subscribe(res => {
        if ( res.err ) {
          this.translate.get('CREATE_ERROR').subscribe((response: string) => {
            this.toastrService.error(res.err, response, environment.ERROR_TOAST_CONFIG);
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
          FileSaver.saveAs(res, `${this.receiptFormLabel}.docx`)
        }
      });
  }

  ngOnDestroy() {
    this.entriesSub.unsubscribe();
    this.entries$.dispatch(new fromStore.ResetAccountingEntries());
    this.currentPageSub.unsubscribe();
  }
}
