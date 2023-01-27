import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';

import {
  IBusinessSectorList,
  BusinessSectorListActions,
  ICreateBusinessSector,
  BusinessSectorCreateActions,
  IUpdateBusinessSector,
  BusinessSectorUpdateActions
} from '../../../../../core/store/business-sectors';
import { environment } from '../../../../../../environments/environment';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';


@Component({
  selector: 'cbs-business-sectors',
  templateUrl: 'business-sectors.component.html'
})
export class BusinessSectorsListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private businessSectorFormModal: CustomFormModalComponent;

  public newBusinessSectorFields = [
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
  public businessSectors: Observable<any>;
  public businessSectorCreateState: ICreateBusinessSector;
  public businessSectorUpdateState: IUpdateBusinessSector;
  public svgData = {
    collection: 'custom',
    class: 'custom57',
    name: 'custom57'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'BUSINESS_SECTORS',
      link: '/configuration/business-sectors'
    }
  ];

  private createBusinessSectorSub: any;
  private updateBusinessSectorSub: any;


  constructor(private businessSectorListStore$: Store<IBusinessSectorList>,
              private businessSectorListActions: BusinessSectorListActions,
              private businessSectorCreateStore$: Store<ICreateBusinessSector>,
              private businessSectorCreateActions: BusinessSectorCreateActions,
              private businessSectorUpdateStore$: Store<IUpdateBusinessSector>,
              private businessSectorUpdateActions: BusinessSectorUpdateActions,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
    this.businessSectors = this.store$.select(fromRoot.getBusinessSectorListState);
  }

  ngOnInit() {
    this.loadBusinessSectors();

    this.createBusinessSectorSub = this.businessSectorCreateStore$.select(fromRoot.getBusinessSectorCreateState)
    .subscribe((state: ICreateBusinessSector) => {
      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadBusinessSectors();
        this.resetState('create');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.businessSectorFormModal.disableSubmitBtn(false);
        this.resetState('create');
      }

      this.businessSectorCreateState = state;
    });

    this.updateBusinessSectorSub = this.businessSectorUpdateStore$.select(fromRoot.getBusinessSectorUpdateState)
    .subscribe((state: IUpdateBusinessSector) => {
      if (state.loaded && state.success && !state.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadBusinessSectors();
        this.resetState('update');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.businessSectorFormModal.disableSubmitBtn(false);
        this.resetState('update');
      }

      this.businessSectorUpdateState = state;
    });
  }

  ngOnDestroy() {
    this.createBusinessSectorSub.unsubscribe();
    this.updateBusinessSectorSub.unsubscribe();
  }

  loadBusinessSectors() {
    this.businessSectorListStore$.dispatch(this.businessSectorListActions.fireInitialAction());
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

  openCreateModal(parent?: { parentId, parentName }) {
    this.isNew = true;
    let newTranslatedFields;
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
      newTranslatedFields = this.translateCaption([...this.newBusinessSectorFields, parentField]);
      this.businessSectorFormModal.openModal(newTranslatedFields);
    } else {
      newTranslatedFields = this.translateCaption(this.newBusinessSectorFields);
      this.businessSectorFormModal.openModal(newTranslatedFields);
    }
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
    this.businessSectorFormModal.openModal(newTranslatedFields);
  }

  saveNewBusinessSector(data) {
    const businessSectorName = data.fields[0];
    const businessSectorParent = data.fields[1];

    if (businessSectorParent) {
      this.businessSectorCreateStore$.dispatch(this.businessSectorCreateActions.fireInitialAction({
        name: businessSectorName.value,
        parentId: businessSectorParent.fieldId
      }));
    } else {
      this.businessSectorCreateStore$.dispatch(this.businessSectorCreateActions
      .fireInitialAction({name: businessSectorName.value}));
    }
  }

  saveEditBusinessSector(data) {
    const businessSectorName = data.fields[0];

    const businessSectorEditData = {name: businessSectorName.value};

    if (data.fields.length === 2) {
      const parentId = data.fields[1]['fieldId'];
      if (parentId) {
        businessSectorEditData['parentId'] = parentId;
      }
    }
    this.businessSectorUpdateStore$.dispatch(this.businessSectorUpdateActions
    .fireInitialAction({businessSectorEditData: businessSectorEditData, id: businessSectorName.fieldId}));
  }

  submitBusinessSector(data) {
    if (this.isNew) {
      this.saveNewBusinessSector(data);
    } else {
      this.saveEditBusinessSector(data);
    }
  }

  closeModal() {
    this.businessSectorFormModal.cancel();
  }

  resetState(state?: string) {
    if (state === 'create') {
      this.businessSectorCreateStore$.dispatch(this.businessSectorCreateActions.fireResetAction());
    } else if (state === 'update') {
      this.businessSectorUpdateStore$.dispatch(this.businessSectorUpdateActions.fireResetAction());
    }
  }

}
