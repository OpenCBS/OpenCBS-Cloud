import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { environment } from '../../../../../../environments/environment';

import {
  CreatePaymentMethodState,
  PaymentMethodListState,
  UpdatePaymentMethodState
} from '../../../../../core/store/payment-method';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'standard', class: 'client', name: 'client'};

@Component({
  selector: 'cbs-payment-method',
  templateUrl: 'payment-methods.component.html'
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private paymentMethodFormModal: CustomFormModalComponent;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'PAYMENT_METHODS',
      link: '/configuration/payment-methods'
    }
  ];
  public newPaymentMethodFields = [
    {
      id: -1,
      caption: 'NAME',
      extra: null,
      fieldType: 'TEXT',
      name: 'name',
      order: 1,
      required: true,
      unique: false,
      value: ''
    }
  ];
  public isNew: boolean;
  public paymentMethods: Observable<any>;


  private createPaymentMethodSub: Subscription;
  private updatePaymentMethodSub: Subscription;

  constructor(private paymentMethodListStateStore$: Store<PaymentMethodListState>,
              private createPaymentMethodStateStore$: Store<CreatePaymentMethodState>,
              private updatePaymentMethodStateStore$: Store<UpdatePaymentMethodState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.paymentMethods = this.store$.pipe(select(fromRoot.getPaymentMethodListState));

    this.createPaymentMethodSub = this.store$.pipe(select(fromRoot.getPaymentMethodCreateState))
      .subscribe((state: CreatePaymentMethodState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });

          this.closeModal();
          this.loadPaymentMethods();
          this.resetState('create');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.paymentMethodFormModal.disableSubmitBtn(false);
          this.resetState('create');
        }
      });

    this.updatePaymentMethodSub = this.store$.pipe(select(fromRoot.getPaymentMethodUpdateState))
      .subscribe((state: UpdatePaymentMethodState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadPaymentMethods();
          this.resetState('update');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.paymentMethodFormModal.disableSubmitBtn(false);
          this.resetState('update');
        }
      });
  }

  ngOnInit() {
    this.loadPaymentMethods();
  }

  ngOnDestroy() {
    this.createPaymentMethodSub.unsubscribe();
    this.updatePaymentMethodSub.unsubscribe();
  }

  loadPaymentMethods() {
    this.paymentMethodListStateStore$.dispatch(new fromStore.LoadPaymentMethods());
  }

  openCreateModal(parent?: { parentId, parentName }) {
    this.isNew = true;
    if ( parent ) {
      const parentField = {
        id: parent.parentId,
        caption: 'BELONGS_TO',
        extra: null,
        fieldType: 'TEXT',
        name: 'parentName',
        order: 1,
        required: true,
        unique: false,
        readOnly: true,
        value: parent.parentName
      };
      const newTranslatedFields = this.translateCaption([...this.newPaymentMethodFields, parentField]);
      this.paymentMethodFormModal.openModal(newTranslatedFields);
    } else {
      const newTranslatedFields = this.translateCaption(this.newPaymentMethodFields);
      this.paymentMethodFormModal.openModal(newTranslatedFields);
    }
  }

  translateCaption(fields) {
    return fields.map(field => {
      const newFieldObj = Object.assign({}, field);
      this.translate.get(field.caption).subscribe((res: string) => {
        newFieldObj.caption = res;
      });
      return newFieldObj;
    });
  }

  openEditModal(details: { children, data, parent }) {
    this.isNew = false;
    const field = {
      id: details.data.id,
      caption: 'NAME',
      extra: null,
      fieldType: 'TEXT',
      name: 'name',
      order: 1,
      required: true,
      unique: false,
      value: details.data.name
    };

    const fields = [field];

    if ( details.parent ) {
      const parentField = {
        id: details.parent.id,
        caption: 'BELONGS_TO',
        extra: null,
        fieldType: 'TEXT',
        name: 'parentName',
        order: 1,
        required: false,
        unique: false,
        readOnly: true,
        value: details.parent.name
      };
      fields.push(parentField);
    }
    const newTranslatedFields = this.translateCaption(fields);
    this.paymentMethodFormModal.openModal(newTranslatedFields);
  }

  saveNewPaymentMethod(data) {
    const paymentMethodName = data.fields[0];
    const paymentMethodParent = data.fields[1];

    if ( paymentMethodParent ) {
      this.createPaymentMethodStateStore$.dispatch(new fromStore.CreatePaymentMethod({
        name: paymentMethodName.value,
        parentId: paymentMethodParent.fieldId
      }));
    } else {
      this.createPaymentMethodStateStore$.dispatch(new fromStore.CreatePaymentMethod({name: paymentMethodName.value}));
    }
  }

  saveEditPaymentMethod(data) {
    const paymentMethodName = data.fields[0];

    const paymentMethodEditData = {name: paymentMethodName.value};

    if ( data.fields.length === 2 ) {
      const parentId = data.fields[1]['fieldId'];
      if ( parentId ) {
        paymentMethodEditData['parentId'] = parentId;
      }
    }
    this.updatePaymentMethodStateStore$.dispatch(new fromStore.UpdatePaymentMethod({
      data: paymentMethodEditData,
      fieldId: paymentMethodName.fieldId
    }));
  }

  submitPaymentMethod(data) {
    if ( this.isNew ) {
      this.saveNewPaymentMethod(data);
    } else {
      this.saveEditPaymentMethod(data);
    }
  }

  closeModal() {
    this.paymentMethodFormModal.cancel();
  }

  resetState(state?: string) {
    if ( state === 'create' ) {
      this.createPaymentMethodStateStore$.dispatch(new fromStore.CreatePaymentMethodReset());
    } else if ( state === 'update' ) {
      this.createPaymentMethodStateStore$.dispatch(new fromStore.UpdatePaymentMethodReset());
    }
  }
}
