import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import {
  PayeeListState,
  CreatePayeeState,
  UpdatePayeeState,
} from '../../../../../core/store/payees';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FormLookupControlComponent } from '../../../../../shared/modules/cbs-form/components';
import { map } from 'rxjs/operators';
import { PayeeListService } from '../../../../../core/store';

const SVG_DATA = {collection: 'standard', class: 'groups', name: 'groups'};
const ACCOUNTING_CONFIG = {
  url: `${environment.API_ENDPOINT}accounting/lookup`,
  defaultQuery: ''
};

@Component({
  selector: 'cbs-config-payees',
  templateUrl: 'payees.component.html',
  styleUrls: ['payees.component.scss']
})
export class PayeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('account', {static: false}) account: FormLookupControlComponent;
  public opened = false;
  public form: FormGroup;
  public currentPayee: any;
  public formChanged = false;
  public isNew: boolean;
  public payees: Observable<PayeeListState>;
  public isExpanded = false;
  public svgData = SVG_DATA;
  public formConfig = ACCOUNTING_CONFIG;
  public queryObject = {
    page: 1
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'PAYEES',
      link: '/configuration/payees'
    }
  ];

  private accountDefaultValue = {};
  private currentPageSub: Subscription;
  private paramsSub: Subscription;
  private createPayeeSub: Subscription;
  private updatePayeeSub: Subscription;

  constructor(private payeeListStore$: Store<PayeeListState>,
              private payeeCreateStore$: Store<CreatePayeeState>,
              private payeeUpdateStore$: Store<UpdatePayeeState>,
              private toastrService: ToastrService,
              private payeeListService: PayeeListService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private router: Router) {
    this.payees = this.store$.pipe(select(fromRoot.getPayeeList));
    this.payeeListService.getCurrentAccountPayee()
      .subscribe((res: any) => {
        if ( res && res.content.length ) {
          const accountValue = res.content[0];
          this.accountDefaultValue = {
            id: accountValue.id,
            name: accountValue.name,
            number: accountValue.number
          }
        }
      });
  }

  ngOnInit() {
    this.currentPageSub = this.payees.pipe(this.getPayeesCurrentPage())
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {page: page + 1});
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      this.queryObject.page !== 1 ? this.loadPayees(this.queryObject) : this.loadPayees();
    });

    this.createPayeeSub = this.store$.pipe(select(fromRoot.getPayeeCreate))
      .subscribe((state: CreatePayeeState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });

          this.closeModal();
          this.loadPayees();
          this.resetState('create');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('create');
        }
      });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      currentAccountId: new FormControl('', Validators.required),
      description: new FormControl('')
    });

    this.updatePayeeSub = this.store$
      .pipe(select(fromRoot.getPayeeUpdate))
      .subscribe((state: UpdatePayeeState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadPayees();
          this.resetState('update');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('update');
        }
      });
  }

  getPayeesCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/payees'], navigationExtras);
  }

  loadPayees(params ?: Object) {
    this.payeeListStore$.dispatch(new fromStore.LoadPayees(params));
  }

  openModal(details ?: { name, id, currentAccountId, description }) {
    this.form.reset();
    if ( !details ) {
      this.isNew = true;
      this.opened = true;
      this.account.setLookupValue(this.accountDefaultValue);
    } else {
      this.isNew = false;
      this.opened = true;
      this.currentPayee = details;
      this.formConfig = {
        url: `${environment.API_ENDPOINT}accounting/lookup`,
        defaultQuery: details['accountNumber']
      };
      this.currentPayee = Object.assign({}, this.currentPayee, {
        currentAccountId: this.currentPayee.accountId
      });
      this.form.controls['name'].setValue(details['name']);
      this.form.controls['currentAccountId'].setValue(details['accountId']);
      this.form.controls['description'].setValue(details['description']);
    }
  }

  submitPayee() {
    const objectToSend = {
      name: this.form.controls['name'].value,
      currentAccounts: [this.form.controls['currentAccountId'].value],
      description: this.form.controls['description'].value
    };
    if ( this.isNew ) {
      this.payeeCreateStore$
        .dispatch(new fromStore.CreatePayee(objectToSend));
    } else {
      this.payeeUpdateStore$
        .dispatch(new fromStore.UpdatePayee({data: objectToSend, payeeId: this.currentPayee['id']}));
    }
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(fields => {
      this.formChanged = this.isNew ? !this.form.invalid : this.checkFormChanges(fields);
    });
  }

  checkFormChanges(fields) {
    let status = false;

    for (const prop in this.currentPayee) {
      if ( fields.hasOwnProperty(prop) && fields[prop] !== this.currentPayee[prop] ) {
        status = true;
      }
    }

    return status;
  }

  setLookupValue(account) {
    if ( account ) {
      this.form.controls['currentAccountId'].setValue(account['id']);
    }
  }

  changeModalSize(e, boolean) {
    this.isExpanded = boolean;
  }

  closeModal() {
    this.opened = false;
  }

  private resetState(state?: string) {
    if ( state === 'create' ) {
      this.payeeCreateStore$
        .dispatch(new fromStore.CreatePayeeReset());
    } else if ( state === 'update' ) {
      this.payeeUpdateStore$
        .dispatch(new fromStore.UpdatePayeeReset());
    }
  }

  ngOnDestroy() {
    this.createPayeeSub.unsubscribe();
    this.updatePayeeSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

