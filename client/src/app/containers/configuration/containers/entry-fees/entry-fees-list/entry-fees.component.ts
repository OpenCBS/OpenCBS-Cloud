import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { EntryFeesFormModalComponent } from '../shared/entry-fees-form-modal.component';
import {
  EntryFeeListState,
  CreateEntryFeeState,
  UpdateEntryFeeState
} from '../../../../../core/store/entry-fees';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};


@Component({
  selector: 'cbs-entry-fees',
  templateUrl: 'entry-fees.component.html'
})
export class EntryFeesComponent implements OnInit, OnDestroy {
  @ViewChild(EntryFeesFormModalComponent, {static: false}) private formModal: EntryFeesFormModalComponent;
  public svgData = SVG_DATA;
  public entryFees: Observable<EntryFeeListState>;
  public isNew = false;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'ENTRY_FEES',
      link: '/configuration/entry-fees'
    }
  ];

  private fields = {
    name: '',
    minValue: '',
    maxValue: '',
    percentage: false,
    minLimit: '',
    maxLimit: '',
    accountId: ''
  };
  private editingEntryFeeId: number;
  private createEntryFeeSub: Subscription;
  private updateEntryFeeSub: Subscription;

  constructor(private entryFeeListStore$: Store<EntryFeeListState>,
              private entryFeeCreateStore$: Store<CreateEntryFeeState>,
              private entryFeeUpdateStore$: Store<UpdateEntryFeeState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.entryFees = this.store$.pipe(select(fromRoot.getEntryFeeListState));
  }

  ngOnInit() {
    this.createEntryFeeSub = this.store$.pipe(select(fromRoot.getEntryFeeCreateState))
      .subscribe((state: CreateEntryFeeState) => {

        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadEntryFees();
          this.resetState('create');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('create');
          this.formModal.disableSubmitBtn(false);
        }
      });

    this.updateEntryFeeSub = this.store$.pipe(select(fromRoot.getEntryFeeUpdateState))
      .subscribe((state: UpdateEntryFeeState) => {

        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadEntryFees();
          this.resetState('update');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('update');
          this.formModal.disableSubmitBtn(false);
        }
      });
    this.loadEntryFees();
  }

  ngOnDestroy() {
    this.createEntryFeeSub.unsubscribe();
    this.updateEntryFeeSub.unsubscribe();
    this.resetState('listUpdate');
  }

  loadEntryFees() {
    this.entryFeeListStore$.dispatch(new fromStore.LoadEntryFees());
  }

  openCreateModal() {
    this.isNew = true;
    this.formModal.openCreateModal(this.fields);
  }

  openEditModal(entryFee) {
    this.editingEntryFeeId = entryFee.id;
    this.isNew = false;
    const newEntryFee = Object.assign({}, entryFee, {accountId: entryFee.account.id});
    delete newEntryFee.id;
    delete newEntryFee.account;
    this.formModal.openEditModal(newEntryFee);
  }

  submitEntryFee(data) {
    if ( this.isNew ) {
      this.saveNewEntryFee(data);
    } else {
      this.saveEditEntryFee(data);
    }
  }

  private saveNewEntryFee(data) {
    this.entryFeeCreateStore$
      .dispatch(new fromStore.CreateEntryFee(data));
  }

  private saveEditEntryFee(data) {
    this.entryFeeUpdateStore$
      .dispatch(new fromStore.UpdateEntryFee({data: data, entryFeeId: this.editingEntryFeeId}));
  }

  private closeModal() {
    this.formModal.cancel();
  }

  private resetState(state?: string) {
    if ( state === 'create' ) {
      this.entryFeeCreateStore$
        .dispatch(new fromStore.CreateEntryFeeReset());
    } else if ( state === 'update' ) {
      this.entryFeeUpdateStore$
        .dispatch(new fromStore.UpdateEntryFeeReset());
    } else if ( state === 'listUpdate' ) {
      this.entryFeeListStore$
        .dispatch(new fromStore.EntryFeesListReset());
    }
  }
}
