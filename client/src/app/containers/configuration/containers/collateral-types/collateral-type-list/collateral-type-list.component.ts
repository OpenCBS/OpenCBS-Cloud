import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import {
  CollateralTypeListState,
  CreateCollateralTypeState
} from '../../../../../core/store/collateral-type';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';


@Component({
  selector: 'cbs-config-collateral-types',
  templateUrl: 'collateral-type-list.component.html',
  styleUrls: ['collateral-type-list.component.scss']
})
export class CollateralTypeListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private collateralTypeFormModal: CustomFormModalComponent;

  public newCollateralTypeFields = [
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

  public collateralTypes: Observable<any>;
  public svgData = {
    collection: 'standard',
    class: 'asset-relationship',
    name: 'asset_relationship'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'COLLATERAL_TYPES',
      link: '/configuration/collateral-types'
    }
  ];

  private createCollateralTypeSub: any;

  constructor(private collateralTypeListStore$: Store<CollateralTypeListState>,
              private collateralTypeCreateStore$: Store<CreateCollateralTypeState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private translate: TranslateService) {
    this.collateralTypes = this.store$.select(fromRoot.getCollateralTypeListState);

    this.createCollateralTypeSub = this.store$.select(fromRoot.getCollateralTypeCreateState)
    .subscribe((state: CreateCollateralTypeState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.closeModal();
        this.loadCollateralTypes();
        this.resetState();
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });

        this.closeModal();
        this.resetState();
      }
    });
  }

  ngOnInit() {
    this.loadCollateralTypes();
  }

  ngOnDestroy() {
    this.createCollateralTypeSub.unsubscribe();
    this.collateralTypeListStore$.dispatch(new fromStore.ResetCollateralTypes);
  }

  loadCollateralTypes() {
    this.collateralTypeListStore$.dispatch(new fromStore.LoadCollateralTypes());
  }

  openCreateModal() {
    const newTranslatedFields = this.translateCaption(this.newCollateralTypeFields);
    this.collateralTypeFormModal.openModal(newTranslatedFields);
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

  submitCollateralType(data) {
    this.saveNewCollateralType(data);
  }

  private saveNewCollateralType(data) {
    const collateralTypeName = data.fields[0]['value'];
    this.collateralTypeCreateStore$
    .dispatch(new fromStore.CreateCollateralType({caption: collateralTypeName}));
  }

  private closeModal() {
    this.collateralTypeFormModal.cancel();
  }

  private resetState() {
    this.collateralTypeCreateStore$
    .dispatch(new fromStore.CreateCollateralTypeReset);

  }

  goToCollateral(collatType) {
    this.router.navigate(['/configuration', 'collateral-types', collatType.id])
  }
}

