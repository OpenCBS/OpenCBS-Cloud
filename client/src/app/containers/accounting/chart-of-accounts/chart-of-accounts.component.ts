
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ChartOfAccountsActions, ChartOfAccountsService, IChartOfAccounts } from '../../../core/store';
import { ChildrenAccountsService } from './shared/services/children-accounts.service';
import { LoadingService } from './shared/services/loading-service';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartOfAccountCreateActions, ICreateChartOfAccount } from '../../../core/store/chart-of-account-create';
import { ChartOfAccountUpdateActions, IUpdateChartOfAccount } from '../../../core/store/chart-of-accounts-update';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';


const SVG_DATA = {collection: 'custom', class: 'custom102', name: 'custom102'};
const BRANCH_CONFIG = {url: `${environment.API_ENDPOINT}branches`};
const CURRENCY_CONFIG = {url: `${environment.API_ENDPOINT}currencies/lookup`};

@Component({
  selector: 'cbs-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartOfAccountsComponent implements OnInit, OnDestroy {
  public nodes = [];
  public openedModal = false;
  public showAccount = false;
  public isLoading = false;
  public form: FormGroup;
  public headerTitle: string;
  public selectLabel = 'SELECT';
  public branchId: number;
  public accountId: number;
  public currentNode: any;
  public accountData: any;
  public dataType: any;
  public isNew = false;
  public chartOfAccountsData: any;
  public svgData = SVG_DATA;
  public branchConfig = BRANCH_CONFIG;
  public currencyConfig = CURRENCY_CONFIG;

  private loadingSub: Subscription;
  private accountsByBranchSub: Subscription;
  private accountsForEditSub: Subscription;
  private ngDestroyed$ = new Subject();

  constructor(private accountsActions: ChartOfAccountsActions,
              private accountCreateActions: ChartOfAccountCreateActions,
              private accountUpdateActions: ChartOfAccountUpdateActions,
              private accountsStore$: Store<fromRoot.State>,
              private childrenAccountsService: ChildrenAccountsService,
              private chartOfAccountsService: ChartOfAccountsService,
              private loadingService: LoadingService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      childNumber: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      currencyId: new FormControl(''),
      isDebit: new FormControl('', Validators.required),
      allowedTransferFrom: new FormControl(''),
      allowedTransferTo: new FormControl(''),
      allowedCashDeposit: new FormControl(''),
      allowedCashWithdrawal: new FormControl(''),
      allowedManualTransaction: new FormControl(''),
      locked: new FormControl(''),
      id: new FormControl('')
    });

    this.loadingSub = this.loadingService.statusSource.subscribe(bool => {
      this.isLoading = bool;
    });

    this.accountsStore$.pipe(takeUntil(this.ngDestroyed$)).pipe(select(fromRoot.getChartOfAccountCreateState))
      .subscribe((data: ICreateChartOfAccount) => {
        if ( data.loaded && data.success && !data.error ) {
          this.toastrService.clear();
          this.accountsStore$.dispatch(this.accountsActions.fireInitialAction());
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.accountsStore$.dispatch(this.accountCreateActions.fireResetAction());
        } else if ( data.loaded && !data.success && data.error ) {
          this.toastrService.clear();
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(data.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });

    this.accountsStore$.pipe(takeUntil(this.ngDestroyed$)).pipe(select(fromRoot.getChartOfAccountUpdateState))
      .subscribe((data: IUpdateChartOfAccount) => {
        if ( data.loaded && data.success && !data.error ) {
          this.toastrService.clear();
          this.accountsStore$.dispatch(this.accountsActions.fireInitialAction());
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.accountsStore$.dispatch(this.accountUpdateActions.fireResetAction());
        } else if ( data.loaded && !data.success && data.error ) {
          this.toastrService.clear();
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(data.errorMessage, '', environment.ERROR_TOAST_CONFIG);
          });
        }
      });

    this.accountsStore$.dispatch(this.accountsActions.fireInitialAction());
    this.accountsStore$.pipe(takeUntil(this.ngDestroyed$)).pipe(select(fromRoot.getChartOfAccountsState))
      .subscribe((data: IChartOfAccounts) => {
        this.chartOfAccountsData = data;
        if ( data.loaded && data.success && !data.error ) {
          this.nodes = data.data.map(node => {
            return Object.assign({}, node, {
              expanded: false
            });
          });
        }
      });
  }

  toggle(node) {
    node.expanded = !node.expanded;
    if ( node.expanded && node.hasChildren && !node.data ) {
      this.loadingService.showLoader(true);
      const params = this.branchId > 0 ? {accountId: node['id'], branchId: this.branchId} : {accountId: node['id']};
      this.childrenAccountsService.getAccounts(params)
        .subscribe(data => {
          node.data = data;
          this.loadingService.showLoader(false);
        });
    }
  }

  setLookupValue(branch) {
    if ( branch ) {
      this.branchId = branch.id;
      if ( this.accountsByBranchSub ) {
        this.accountsByBranchSub.unsubscribe();
      }
      this.accountsByBranchSub = this.chartOfAccountsService.getChartOfAccountsByBranchId(branch.id)
        .subscribe(data => {
          this.nodes = data;
          this.nodes.map(node => {
            node['expanded'] = false;
            return node;
          });
        });
    } else {
      this.branchId = 0;
      this.accountsStore$.dispatch(this.accountsActions.fireInitialAction());
    }
  }

  show(data) {
    if ( data.type === 'edit' || data.type === 'show' ) {
      this.accountId = data.node.id;
      this.accountsForEditSub = this.chartOfAccountsService.getChartOfAccountsForEdit(this.accountId)
        .subscribe(res => {
          this.accountData = res;
        });
    }
    setTimeout(() => {
      this.form.reset();
      this.dataType = data.type;
      this.currentNode = data.node;
      this.headerTitle = data.type === 'add' ? 'ADD_ACCOUNT' : data.type === 'edit' ? 'EDIT_ACCOUNT' : 'ACCOUNT_INFO';
      this.isNew = data.type === 'add';
      if ( !this.isNew ) {
        this.form.controls['name'].setValue(data['node']['name']);
        this.form.controls['branchId'].setValue(data['node']['branch']['id']);
        this.form.controls['childNumber'].setValue(this.accountData.number);
        this.form.controls['isDebit'].setValue(data['node']['isDebit']);
        this.form.controls['allowedTransferFrom'].setValue(data['node']['allowedTransferFrom']);
        this.form.controls['allowedTransferTo'].setValue(data['node']['allowedTransferTo']);
        this.form.controls['allowedCashDeposit'].setValue(data['node']['allowedCashDeposit']);
        this.form.controls['allowedCashWithdrawal'].setValue(data['node']['allowedCashWithdrawal']);
        this.form.controls['allowedManualTransaction'].setValue(data['node']['allowedManualTransaction']);
        this.form.controls['locked'].setValue(data['node']['locked']);
        if ( data['node']['currency'] && data['node']['currency']['id'] ) {
          this.form.controls['currencyId'].setValue(data['node']['currency']['id']);
        }
      } else {
        this.setDefaultRadioButtonsValues();
      }

      this.showAccount = data.type === 'show';
      if ( this.showAccount ) {
        this.form.controls['name'].disable();
        this.form.controls['childNumber'].disable();
        this.form.controls['branchId'].disable();
        this.form.controls['currencyId'].disable();
        this.form.controls['isDebit'].disable();
        this.form.controls['allowedTransferFrom'].disable();
        this.form.controls['allowedTransferTo'].disable();
        this.form.controls['allowedCashDeposit'].disable();
        this.form.controls['allowedCashWithdrawal'].disable();
        this.form.controls['allowedManualTransaction'].disable();
        this.form.controls['locked'].disable();
      } else {
        this.form.controls['name'].enable();
        this.form.controls['childNumber'].enable();
        this.form.controls['branchId'].enable();
        this.form.controls['currencyId'].enable();
        this.form.controls['isDebit'].enable();
        this.form.controls['allowedTransferFrom'].enable();
        this.form.controls['allowedTransferTo'].enable();
        this.form.controls['allowedCashDeposit'].enable();
        this.form.controls['allowedCashWithdrawal'].enable();
        this.form.controls['allowedManualTransaction'].enable();
        this.form.controls['locked'].enable();
      }
      this.openedModal = true
    }, 500);
  }

  setDefaultRadioButtonsValues() {
    this.form.controls['isDebit'].setValue(true);
    this.form.controls['allowedTransferFrom'].setValue(true);
    this.form.controls['allowedTransferTo'].setValue(true);
    this.form.controls['allowedCashDeposit'].setValue(true);
    this.form.controls['allowedCashWithdrawal'].setValue(true);
    this.form.controls['allowedManualTransaction'].setValue(true);
  }

  submit() {
    this.openedModal = false;
    const objToSendCreate = Object.assign({}, this.form.value, {
      parentAccountId: this.currentNode['id'],
      childNumber: this.form.controls['childNumber'].value,
      locked: false,
      parentNumber: this.currentNode['number']
    });
    const objToSendUpdate = Object.assign({}, this.form.value, {
      childNumber: this.form.controls['childNumber'].value,
      parentNumber: this.currentNode['parentAccountNumber'] || ''
    });
    if ( this.isNew ) {
      this.accountsStore$.dispatch(this.accountCreateActions.fireInitialAction(objToSendCreate));
    } else {
      objToSendUpdate.id = this.currentNode['id'];
      this.accountsStore$.dispatch(
        this.accountUpdateActions.fireInitialAction({chartOfAccountEditData: objToSendUpdate, id: this.currentNode['id']}));
    }
  }

  cancel() {
    this.openedModal = false;
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.loadingSub.unsubscribe();
    if ( this.accountsByBranchSub ) {
      this.accountsByBranchSub.unsubscribe();
    }
    if ( this.accountsForEditSub ) {
      this.accountsForEditSub.unsubscribe();
    }
    this.accountsStore$.dispatch(this.accountCreateActions.fireResetAction());
    this.accountsStore$.dispatch(this.accountUpdateActions.fireResetAction());
  }
}
