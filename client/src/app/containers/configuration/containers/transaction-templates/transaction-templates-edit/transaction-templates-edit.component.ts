import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { TransactionTemplatesFormComponent } from '../transaction-templates-form/transaction-templates-form.component';
import { TransactionTemplatesInfoState, UpdateTransactionTemplatesState } from '../../../../../core/store';
import { Subscription } from 'rxjs/Rx';
import { values, flatten } from 'lodash'

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-transaction-templates-edit',
  templateUrl: 'transaction-templates-edit.component.html'
})

export class TransactionTemplatesEditComponent implements OnInit, OnDestroy {
  @ViewChild(TransactionTemplatesFormComponent, {static: false}) transactionTemplatesForm: TransactionTemplatesFormComponent;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TRANSACTION TEMPLATES',
      link: '/configuration/transaction-templates'
    },
    {
      name: '',
      link: ''
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];

  private transactionTemplatesId: number;
  private transactionTemplatesUpdateSub: Subscription;
  private routeSub: Subscription;
  private transactionTemplatesSub: Subscription;

  constructor(private toastrService: ToastrService,
              private translate: TranslateService,
              private transactionTemplatesInfoStateStore: Store<TransactionTemplatesInfoState>,
              private UpdateTransactionTemplatesState: Store<UpdateTransactionTemplatesState>,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.transactionTemplatesUpdateSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesUpdateState))
    .subscribe((transactionTemplatesUpdate: UpdateTransactionTemplatesState) => {
      if (transactionTemplatesUpdate.loaded && transactionTemplatesUpdate.success && !transactionTemplatesUpdate.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.goToViewInfo();
      } else if (transactionTemplatesUpdate.loaded && !transactionTemplatesUpdate.success && transactionTemplatesUpdate.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState();
      }
    });

    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params.id) {
        this.transactionTemplatesId = params.id;
        this.transactionTemplatesInfoStateStore.dispatch(new fromStore.LoadTransactionTemplatesInfo(params.id));
      }
    });

    this.transactionTemplatesSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesInfoState))
    .subscribe((transactionTemplatesInfo: TransactionTemplatesInfoState) => {
      if (transactionTemplatesInfo.loaded && transactionTemplatesInfo.success && !transactionTemplatesInfo.error) {
        this.breadcrumbLinks[2] = {
          name: transactionTemplatesInfo['name'],
          link: ''
        }
      }
    });
  }

  goToViewInfo() {
    this.router.navigate(['configuration', 'transaction-templates', this.transactionTemplatesId])
  }

  submitForm() {
    let debitAccounts = [];
    this.transactionTemplatesForm.form.value.debitAccounts.map(res => {
      debitAccounts.push(values(res));
    });
    debitAccounts = flatten(debitAccounts);

    let creditAccounts = [];
    this.transactionTemplatesForm.form.value.creditAccounts.map(res => {
      creditAccounts.push(values(res));
    });
    creditAccounts = flatten(creditAccounts);

    const objectToSendObject = {
      debitAccounts: debitAccounts,
      creditAccounts: creditAccounts,
      name: this.transactionTemplatesForm.form.value.name
    };

    this.UpdateTransactionTemplatesState.dispatch(new fromStore.UpdateTransactionTemplates({
      transactionTemplates: objectToSendObject,
      id: this.transactionTemplatesId
    }));
  }

  resetState() {
    this.UpdateTransactionTemplatesState.dispatch(new fromStore.UpdateTransactionTemplatesReset());
  }

  ngOnDestroy() {
    this.resetState();
    this.transactionTemplatesUpdateSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.transactionTemplatesSub.unsubscribe();
  }
}
