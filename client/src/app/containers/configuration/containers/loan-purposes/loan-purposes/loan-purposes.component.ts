import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import {
  LoanPurposeListState,
  CreateLoanPurposeState,
  UpdateLoanPurposeState
} from '../../../../../core/store/loan-purposes';
import { environment } from '../../../../../../environments/environment';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';
import { UpdateLoanPurpose } from '../../../../../core/store/loan-purposes/loan-purpose-update/loan-purpose-update.actions';
import {CCRulesFormComponent} from '../../credit-committee/shared/credit-committee-form.component';


@Component({
  selector: 'cbs-loan-purposes',
  templateUrl: 'loan-purposes.component.html'
})

export class LoanPurposesListComponent implements OnInit, OnDestroy {

  @ViewChild(CustomFormModalComponent, {static: false}) private loanPurposeFormModal: CustomFormModalComponent;

  public newLoanPurposeFields = [
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
  public loan_purposes: Observable<any>;
  public loanPurposeCreateState: CreateLoanPurposeState;
  public loanPurposeUpdateState: UpdateLoanPurposeState;
  public svgData = {
    collection: 'standard',
    class: 'report',
    name: 'report'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'LOAN_PURPOSES',
      link: '/configuration/loan-purposes'
    }
  ];

  private createLoanPurposeSub: any;
  private updateLoanPurposeSub: any;


  constructor(
    private loanPurposeListStore$: Store<LoanPurposeListState>,
    private loanPurposeCreateStore$: Store<CreateLoanPurposeState>,
    private loanPurposeUpdateStore$: Store<UpdateLoanPurposeState>,
    private toastrService: ToastrService,
    private store$: Store<fromRoot.State>,
    private translate: TranslateService
  ) {
    this.loan_purposes = this.store$.select(fromRoot.getLoanPurposeListState);
  }

  ngOnInit() {
    this.loadLoanPurposes();

    this.createLoanPurposeSub = this.store$.select(fromRoot.getLoanPurposeCreateState)
    .subscribe((state: CreateLoanPurposeState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadLoanPurposes();
        this.resetState('create');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('create');
        this.loanPurposeFormModal.disableSubmitBtn(false);
      }

      this.loanPurposeCreateState = state;
    });

    this.updateLoanPurposeSub = this.store$.select(fromRoot.getLoanPurposeUpdateState)
    .subscribe((state: UpdateLoanPurposeState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadLoanPurposes();
        this.resetState('update');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('update');
        this.loanPurposeFormModal.disableSubmitBtn(false);
      }

      this.loanPurposeUpdateState = state;
    });
  }

  ngOnDestroy() {
    this.createLoanPurposeSub.unsubscribe();
    this.updateLoanPurposeSub.unsubscribe();
  }

  loadLoanPurposes() {
    this.loanPurposeListStore$.dispatch(new fromStore.LoadLoanPurposes());
  }


  openCreateModal(parent?: { parentId, parentName }) {
    this.isNew = true;
    if (parent) {
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
      const newTranslatedFields = this.translateCaption([...this.newLoanPurposeFields, parentField]);
      this.loanPurposeFormModal.openModal(newTranslatedFields);
    } else {
      const newTranslatedFields = this.translateCaption(this.newLoanPurposeFields);
      this.loanPurposeFormModal.openModal(newTranslatedFields);
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
      caption: 'LOAN_PURPOSE_NAME',
      extra: null,
      fieldType: 'TEXT',
      name: 'name',
      order: 1,
      required: true,
      unique: false,
      value: details.data.name
    };

    const fields = [field];

    if (details.parent) {
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
    this.loanPurposeFormModal.openModal(newTranslatedFields);
  }

  saveNewLoanPurpose(data) {
    const loanPurposeName = data.fields[0];
    const loanPurposeParent = data.fields[1];

    if (loanPurposeParent) {
      this.loanPurposeCreateStore$.dispatch(new fromStore.CreateLoanPurpose({
        name: loanPurposeName.value,
        parentId: loanPurposeParent.fieldId
      }));
    } else {
      this.loanPurposeCreateStore$.dispatch(new fromStore.CreateLoanPurpose({name: loanPurposeName.value}));
    }
  }

  saveEditLoanPurpose(data) {
    const loanPurposeName = data.fields[0];

    const loanPurposeEditData = {name: loanPurposeName.value};

    if (data.fields.length === 2) {
      const parentId = data.fields[1]['fieldId'];
      if (parentId) {
        loanPurposeEditData['parentId'] = parentId;
      }
    }
    this.loanPurposeUpdateStore$.dispatch(new UpdateLoanPurpose({data: loanPurposeEditData, fieldId: loanPurposeName.fieldId}));
  }

  submitBusinessSector(data) {
    if (this.isNew) {
      this.saveNewLoanPurpose(data);
    } else {
      this.saveEditLoanPurpose(data);
    }
  }

  closeModal() {
    this.loanPurposeFormModal.cancel();
  }

  resetState(state?: string) {
    if (state === 'create') {
      this.loanPurposeCreateStore$.dispatch(new fromStore.CreateLoanPurposeReset());
    } else if (state === 'update') {
      this.loanPurposeUpdateStore$.dispatch(new fromStore.UpdateLoanProductReset());
    }
  }
}
