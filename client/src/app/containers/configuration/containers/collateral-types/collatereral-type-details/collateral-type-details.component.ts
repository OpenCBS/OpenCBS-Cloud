import { Component, OnInit, ViewChildren, QueryList, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import {
  CollateralTypeDetails,
  UpdateCollateralTypeState
} from '../../../../../core/store/collateral-type';

const SVG_DATA = {collection: 'standard', class: 'asset-relationship', name: 'asset_relationship'};

import { CFFieldComponent } from '../../../../../shared/modules/cbs-custom-field-builder/cf-field/cf-field.component';
import { CFAddComponent } from '../../../../../shared/modules/cbs-custom-field-builder/cf-add/cf-add.component';
import { ProfileFieldsService } from '../../../../../core/store';
import { Subscription } from 'rxjs';


@Component({
  selector: 'cbs-config-collateral-type-details',
  templateUrl: 'collateral-type-details.component.html',
  styleUrls: ['collateral-type-details.component.scss']
})
export class CollateralTypeDetailsComponent implements OnInit, OnDestroy {
  @ViewChildren(CFFieldComponent) fields: QueryList<CFFieldComponent>;
  @ViewChild(CFAddComponent, {static: false}) addBtn: CFAddComponent;
  @ViewChild('caption', {read: ElementRef, static: false}) captionInput: ElementRef;
  public cachedCaption: string;
  public isEditView = false;
  public isLoading = false;
  public formChanged = false;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'COLLATERAL_TYPE',
      link: '/configuration/collateral-types'
    }
  ];
  public collateralTypeDetails: CollateralTypeDetails;
  public fieldUrl = '';
  public lookupTypes = [];
  public fieldTypes = environment.FIELD_TYPES;

  private collateralTypeId: number;
  private routeSub: Subscription;
  private collateralTypeDetailsSub: Subscription;
  private updateCollateralTypeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private collateralTypeStore$: Store<CollateralTypeDetails>,
              private store$: Store<fromRoot.State>,
              private profileFieldsService: ProfileFieldsService,
              private collateralTypeUpdateStore$: Store<UpdateCollateralTypeState>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(
      (params: { id }) => {
        if ( params.id ) {
          this.getData(params.id);
          this.collateralTypeId = params.id;
        }
      }
    );

    this.collateralTypeDetailsSub = this.store$.pipe(select(fromRoot.getCollateralTypeDetailsState))
      .subscribe(
        (details: CollateralTypeDetails) => {
          this.collateralTypeDetails = details;

          this.breadcrumbLinks[2] = {
            name: details.caption,
            link: '/configuration/collateral-types/' + details.id
          };

          this.fieldUrl = `${environment.API_ENDPOINT}types-of-collateral/${details.id}/custom-fields`;
        }
      );

    this.updateCollateralTypeSub = this.store$.pipe(select(fromRoot.getCollateralTypeUpdateState))
      .subscribe((state: UpdateCollateralTypeState) => {

        if ( state.loaded && state.success && !state.error ) {
          this.closeEdit();

          if ( this.collateralTypeId ) {
            this.getData(this.collateralTypeId);
            this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
              this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            });
          }

          this.resetState();
        } else if ( state.loaded && !state.success && state.error ) {
          this.closeEdit();
          this.resetState();
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });

    this.profileFieldsService.getLookupType()
      .subscribe((res: any) => {
        if ( res.error ) {
          this.isLoading = false;
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.lookupTypes = res;
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.collateralTypeDetailsSub.unsubscribe();
  }

  getData(id) {
    this.collateralTypeStore$.dispatch(new fromStore.LoadCollateralType(id));
  }

  addField(id) {
    let newlyAddedFieldComponent: CFFieldComponent;

    this.collateralTypeDetails = Object.assign({}, this.collateralTypeDetails, {
      customFields: Array.prototype.concat(this.collateralTypeDetails.customFields, [{
        name: '',
        caption: '',
        fieldType: '',
        unique: false,
        required: false,
        sectionId: id
      }])
    });

    setTimeout(() => {
      newlyAddedFieldComponent = this.fields.last;
      newlyAddedFieldComponent.activateNewFieldMode();

      this.addBtn.disabled = true;
    });
  }

  onFieldAddCancel() {
    this.collateralTypeDetails.customFields.pop();

    this.addBtn.disabled = false;
  }

  onError(err) {
    this.toastrService.error(err.message, '', environment.ERROR_TOAST_CONFIG);
  }

  onDeleteSuccess() {
    this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
      this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
    });
    this.resetState();
    this.getData(this.collateralTypeId);
  }

  callFieldEditSuccess(data) {
    this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
      this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
    });
    this.resetState();
    this.getData(this.collateralTypeId);
  }

  callFieldEditError(err) {
    this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
      this.toastrService.error(`${err.message}`, res, environment.ERROR_TOAST_CONFIG);
    });
    this.resetState();
  }

  callFieldAddSuccess(updatedFields: { data, id }) {
    this.addBtn.disabled = false;
    this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
      this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
    });
    this.resetState();
    this.getData(this.collateralTypeId);
  }

  callFieldAddError(err) {
    this.translate.get('CREATE_ERROR').subscribe((res: string) => {
      this.toastrService.error(`${err.message}`, res, environment.ERROR_TOAST_CONFIG);
    });
    this.resetState();
  }

  activateEdit(cachedCaption) {
    this.cachedCaption = cachedCaption;
    this.isEditView = true;
    this.focusCaptionInput();
  }

  checkValueChange(value) {
    this.formChanged = value !== this.cachedCaption;
  }

  focusCaptionInput() {
    setTimeout(() => {
      this.captionInput.nativeElement.focus();
    });
  }

  closeEdit() {
    this.cachedCaption = '';
    this.formChanged = false;
    this.isEditView = false;
  }

  submitForm({valid, value}) {
    if ( valid && value.caption !== this.cachedCaption ) {
      this.collateralTypeUpdateStore$
        .dispatch(new fromStore.UpdateCollateralType({data: {caption: value.caption}, id: value.id}));
    }
  }

  resetState() {
    this.collateralTypeUpdateStore$.dispatch(new fromStore.UpdateCollateralTypeReset);
  }
}
