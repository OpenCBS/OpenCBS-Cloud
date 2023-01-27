import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { environment } from '../../../../../../environments/environment';

import {
  CreateProfessionState,
  ProfessionListState,
  UpdateProfessionState
} from '../../../../../core/store/profession';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';
import { BorrowingProductFormComponent } from '../../borrowing-product/shared/borrowing-product-form/borrowing-product-form.component';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'standard', class: 'person-account', name: 'person_account'};

@Component({
  selector: 'cbs-profession',
  templateUrl: 'professions.component.html'
})
export class ProfessionsComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private professionFormModal: CustomFormModalComponent;

  public newProfessionFields = [
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
  public professions: Observable<any>;

  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'PROFESSIONS',
      link: '/configuration/professions'
    }
  ];


  private createProfessionSub: Subscription;
  private updateProfessionSub: Subscription;

  constructor(private professionListStore$: Store<ProfessionListState>,
              private professionCreateStore$: Store<CreateProfessionState>,
              private professionUpdateStore$: Store<UpdateProfessionState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.professions = this.store$.pipe(select(fromRoot.getProfessionListState));

    this.createProfessionSub = this.store$.pipe(select(fromRoot.getProfessionCreateState))
      .subscribe((state: CreateProfessionState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });

          this.closeModal();
          this.loadProfessions();
          this.resetState('create');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.professionFormModal.disableSubmitBtn(false);
          this.resetState('create');
        }
      });

    this.updateProfessionSub = this.store$.pipe(select(fromRoot.getProfessionUpdateState))
      .subscribe((state: UpdateProfessionState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadProfessions();
          this.resetState('update');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.professionFormModal.disableSubmitBtn(false);
          this.resetState('update');
        }
      });
  }

  ngOnInit() {
    this.loadProfessions();
  }

  ngOnDestroy() {
    this.createProfessionSub.unsubscribe();
    this.updateProfessionSub.unsubscribe();
  }

  loadProfessions() {
    this.professionListStore$.dispatch(new fromStore.LoadProfessions());
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
      const newTranslatedFields = this.translateCaption([...this.newProfessionFields, parentField]);
      this.professionFormModal.openModal(newTranslatedFields);
    } else {
      const newTranslatedFields = this.translateCaption(this.newProfessionFields);
      this.professionFormModal.openModal(newTranslatedFields);
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
    this.professionFormModal.openModal(newTranslatedFields);
  }

  saveNewProfession(data) {
    const professionName = data.fields[0];
    const professionParent = data.fields[1];

    if ( professionParent ) {
      this.professionCreateStore$.dispatch(new fromStore.CreateProfession({
        name: professionName.value,
        parentId: professionParent.fieldId
      }));
    } else {
      this.professionCreateStore$.dispatch(new fromStore.CreateProfession({name: professionName.value}));
    }
  }

  saveEditProfession(data) {
    const professionName = data.fields[0];

    const professionEditData = {name: professionName.value};

    if ( data.fields.length === 2 ) {
      const parentId = data.fields[1]['fieldId'];
      if ( parentId ) {
        professionEditData['parentId'] = parentId;
      }
    }
    this.professionUpdateStore$.dispatch(new fromStore.UpdateProfession({
      data: professionEditData,
      fieldId: professionName.fieldId
    }));
  }

  submitProfession(data) {
    if ( this.isNew ) {
      this.saveNewProfession(data);
    } else {
      this.saveEditProfession(data);
    }
  }

  closeModal() {
    this.professionFormModal.cancel();
  }

  resetState(state?: string) {
    if ( state === 'create' ) {
      this.professionCreateStore$.dispatch(new fromStore.CreateProfessionReset());
    } else if ( state === 'update' ) {
      this.professionUpdateStore$.dispatch(new fromStore.UpdateProfessionReset());
    }
  }
}
