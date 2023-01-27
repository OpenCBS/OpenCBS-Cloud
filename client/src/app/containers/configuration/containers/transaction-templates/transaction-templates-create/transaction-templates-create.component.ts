import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { CreateTransactionTemplatesState, ICurrencyList } from '../../../../../core/store';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-transaction-templates-create',
  templateUrl: 'transaction-templates-create.component.html',
  styleUrls: ['transaction-templates-create.component.scss']
})

export class TransactionTemplatesCreateComponent implements OnInit, OnDestroy {
  public config = {
    url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE`,
  };
  public isLoading = true;
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public form: FormGroup;
  public accounts = [];
  public type: string;
  public countAccounts: number;

  private debitAccounts = [];
  private creditAccounts = [];
  private debitAccountId: number;
  private creditAccountId: number;
  private transactionTemplatesCreateSub: Subscription;
  private routerSub: Subscription;

  constructor(private route: ActivatedRoute,
              private currencyListStore$: Store<ICurrencyList>,
              private fb: FormBuilder,
              private createTransactionTemplatesStateStore: Store<CreateTransactionTemplatesState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private router: Router) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      debitAccounts: new FormControl('', Validators.required),
      creditAccounts: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.transactionTemplatesCreateSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesCreateState))
      .subscribe((transactionTemplateCreate: CreateTransactionTemplatesState) => {
        if ( transactionTemplateCreate.loaded && transactionTemplateCreate.success && !transactionTemplateCreate.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToTransactionTemplatesInfo(transactionTemplateCreate.data['id']);
        } else if ( transactionTemplateCreate.loaded && !transactionTemplateCreate.success && transactionTemplateCreate.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            const errorMessage = transactionTemplateCreate.errorMessage ? transactionTemplateCreate.errorMessage : res;
            this.toastrService.error(errorMessage, '', environment.ERROR_TOAST_CONFIG);
          });
        }
      });

    this.routerSub = this.route.params.subscribe(params => {
      this.type = params['type'];
      this.isLoading = false;
      this.breadcrumbLinks = [
        {
          name: 'CONFIGURATION',
          link: '/configuration'
        },
        {
          name: 'TRANSACTION TEMPLATES',
          link: '/configuration/transaction-templates'
        },
        {
          name: 'CREATE',
          link: ''
        }
      ];
    });
  }

  getAccountValue(value, type) {
    if ( type === 'DEBIT_ACCOUNT' ) {
      this.debitAccountId = value ? value.id : null;
    } else {
      this.creditAccountId = value ? value.id : null;
    }
  }

  getNewAccounts(value, index, type) {
    if ( type === 'DEBIT_ACCOUNT' && value ) {
      this.debitAccounts[index] = value.id;
    } else {
      if ( value ) {
        this.creditAccounts[index] = value.id;
      }
    }
  }

  addNewAccounts() {
    this.countAccounts =  this.countAccounts ?  this.countAccounts : 0;
    this.countAccounts += 1;
    this.accounts.push(this.countAccounts)
  }

  deleteNewAccounts(value, index, type) {
    if ( type === 'DEBIT_ACCOUNT' ) {
      this.debitAccounts.filter(a => {
        if (this.debitAccounts.indexOf(a) === index) {
          this.debitAccounts.splice(this.debitAccounts.indexOf(a), 1);
        }
      });
    } else {
      this.creditAccounts.filter(a => {
        if (this.creditAccounts.indexOf(a) === index) {
          this.creditAccounts.splice(this.creditAccounts.indexOf(a), 1);
        }
      });
    }

    this.accounts.filter(a => {
      if (a === value) {
        this.accounts.splice(this.accounts.indexOf(a), 1);
      }
    });
  }

  goToTransactionTemplatesInfo(id) {
    this.router.navigate(['configuration', 'transaction-templates', id])
  }

  goToViewTransactionTemplates() {
    this.router.navigate(['configuration', 'transaction-templates'])
  }

  resetState() {
    this.createTransactionTemplatesStateStore.dispatch(new fromStore.CreateTransactionTemplatesReset());
  }

  submit() {
    const debitAccounts = [];
    this.debitAccounts.map(account => {
      debitAccounts.push(account);
    });
    debitAccounts.push(this.debitAccountId);

    const creditAccounts = [];
    this.creditAccounts.map(account => {
      creditAccounts.push(account);
    });
    creditAccounts.push(this.creditAccountId);

    this.form.controls['debitAccounts'].setValue(debitAccounts);
    this.form.controls['creditAccounts'].setValue(creditAccounts);
    this.createTransactionTemplatesStateStore.dispatch(new fromStore.CreateTransactionTemplates(this.form.value));
  }

  ngOnDestroy() {
    this.resetState();
    this.transactionTemplatesCreateSub.unsubscribe();
  }
}
