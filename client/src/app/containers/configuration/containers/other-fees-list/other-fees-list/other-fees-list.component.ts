import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { OtherFeesListFormModalComponent } from '../shared/other-fees-list-form-modal.component';
import {
  OtherFeeListState,
  CreateOtherFeeState,
  UpdateOtherFeeState
} from '../../../../../core/store/other-fees-list';

import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';

const SVG_DATA = {  collection: 'custom',  class: 'custom41',  name: 'custom41'};

@Component({
  selector: 'cbs-other-fees-list',
  templateUrl: 'other-fees-list.component.html',
  styleUrls: ['other-fees-list.component.scss']
})
export class OtherFeesListComponent implements OnInit, OnDestroy {
  @ViewChild(OtherFeesListFormModalComponent, {static: false}) private formModal: OtherFeesListFormModalComponent;
  public svgData = SVG_DATA;
  public otherFeesList: Observable<OtherFeeListState>;
  public isNew = false;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'OTHER_FEES',
      link: '/configuration/other-fees-list'
    }
  ];

  private fields = {
    name: '',
    description: '',
    chargeAccountId: '',
    incomeAccountId: '',
    expenseAccountId: ''
  };
  private editingOtherFeeListId: number;
  private createOtherFeeListSub: Subscription;
  private updateOtherFeeListSub: Subscription;

  constructor(private otherFeeListStore$: Store<OtherFeeListState>,
              private otherFeeListCreateStore$: Store<CreateOtherFeeState>,
              private otherFeeListUpdateStore$: Store<UpdateOtherFeeState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.otherFeesList = this.store$.select(fromRoot.getOtherFeeListState);
  }

  ngOnInit() {
    this.createOtherFeeListSub = this.store$.select(fromRoot.getOtherFeeCreateState)
    .subscribe((state: CreateOtherFeeState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadOtherFeesList();
        this.resetState('create');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('create');
        this.formModal.disableSubmitBtn(false);
      }
    });

    this.updateOtherFeeListSub = this.store$.select(fromRoot.getOtherFeeUpdateState)
    .subscribe((state: UpdateOtherFeeState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadOtherFeesList();
        this.resetState('update');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('update');
        this.formModal.disableSubmitBtn(false);
      }
    });
    this.loadOtherFeesList();
  }

  ngOnDestroy() {
    this.createOtherFeeListSub.unsubscribe();
    this.updateOtherFeeListSub.unsubscribe();
    this.resetState('listUpdate');
  }

  loadOtherFeesList() {
    this.otherFeeListStore$.dispatch(new fromStore.LoadOtherFeesList());
  }

  openCreateModal() {
    this.isNew = true;
    this.formModal.openCreateModal(this.fields);
  }

  openEditModal(otherFee) {
    this.editingOtherFeeListId = otherFee.id;
    this.isNew = false;
    const newOtherFeeList = Object.assign({}, {
      name: otherFee.name,
      description: otherFee.description,
      chargeAccountId: otherFee.chargeAccount.id,
      incomeAccountId: otherFee.incomeAccount.id,
      expenseAccountId: otherFee.expenseAccount.id
    });
    this.formModal.openEditModal(newOtherFeeList);
  }

  submitOtherFeeList(data) {
    if (this.isNew) {
      this.saveNewOtherFeeList(data);
    } else {
      this.saveEditOtherFeeList(data);
    }
  }

  private saveNewOtherFeeList(data) {
    this.otherFeeListCreateStore$
    .dispatch(new fromStore.CreateOtherFee(data));
  }

  private saveEditOtherFeeList(data) {
    this.otherFeeListUpdateStore$
    .dispatch(new fromStore.UpdateOtherFee({data: data, otherFeeId: this.editingOtherFeeListId}));
  }

  private closeModal() {
    this.formModal.cancel();
  }

  private resetState(state?: string) {
    if (state === 'create') {
      this.otherFeeListCreateStore$
      .dispatch(new fromStore.CreateOtherFeeReset());
    } else if (state === 'update') {
      this.otherFeeListUpdateStore$
      .dispatch(new fromStore.UpdateOtherFeeReset());
    } else if (state === 'listUpdate') {
      this.otherFeeListStore$
      .dispatch(new fromStore.OtherFeesListReset());
    }
  }
}
