import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import {
  LocationListState,
  CreateLocationState,
  UpdateLocationState,
} from '../../../../../core/store/locations';
import { environment } from '../../../../../../environments/environment';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';


@Component({
  selector: 'cbs-locations',
  templateUrl: 'locations.component.html'
})
export class LocationsComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private locationFormModal: CustomFormModalComponent;

  public newLocationFields = [
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
  public locations: Observable<any>;
  public locationCreateState: CreateLocationState;
  public locationUpdateState: UpdateLocationState;
  public svgData = {
    collection: 'standard',
    class: 'location',
    name: 'location'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'LOCATIONS',
      link: '/configuration/locations'
    }
  ];

  private createLocationSub: any;
  private updateLocationSub: any;
  private name = 'Location Name';

  constructor(private locationListStore$: Store<LocationListState>,
              private locationCreateStore$: Store<CreateLocationState>,
              private locationUpdateStore$: Store<UpdateLocationState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.locations = this.store$.select(fromRoot.getLocationList);
  }

  ngOnInit() {
    this.loadLocations();

    this.createLocationSub = this.locationCreateStore$.select(fromRoot.getLocationCreate)
    .subscribe((state: CreateLocationState) => {
      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });


        this.closeModal();
        this.loadLocations();
        this.resetState('create');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('create');
        this.locationFormModal.disableSubmitBtn(false);
      }

      this.locationCreateState = state;
    });

    this.updateLocationSub = this.locationUpdateStore$.select(fromRoot.getLocationUpdate).subscribe((state: UpdateLocationState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });


        this.closeModal();
        this.loadLocations();
        this.resetState('update');
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('update');
        this.locationFormModal.disableSubmitBtn(false);
      }

      this.locationUpdateState = state;
    });
  }

  ngOnDestroy() {
    this.createLocationSub.unsubscribe();
    this.updateLocationSub.unsubscribe();
  }

  loadLocations() {
    this.locationListStore$.dispatch(new fromStore.LoadLocations());
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
      newTranslatedFields = this.translateCaption([...this.newLocationFields, parentField]);
      this.locationFormModal.openModal(newTranslatedFields);
    } else {
      newTranslatedFields = this.translateCaption(this.newLocationFields);
      this.locationFormModal.openModal(newTranslatedFields);
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
      caption: 'LOCATION_NAME',
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
    this.locationFormModal.openModal(newTranslatedFields);
  }

  saveNewLocation(data) {
    const locationName = data.fields[0];
    const locationParent = data.fields[1];

    if (locationParent) {
      this.locationCreateStore$.dispatch(new fromStore.CreateLocation({
        name: locationName.value,
        parentId: locationParent.fieldId
      }));
    } else {
      this.locationCreateStore$.dispatch(new fromStore.CreateLocation({name: locationName.value}));
    }
  }

  saveEditLocation(data) {
    const locationName = data.fields[0];

    const locationEditData = {name: locationName.value};

    if (data.fields.length === 2) {
      const parentId = data.fields[1]['fieldId'];
      if (parentId) {
        locationEditData['parentId'] = parentId;
      }
    }
    this.locationUpdateStore$.dispatch(new fromStore.UpdateLocation({
      editData: locationEditData,
      fieldId: locationName.fieldId
    }));
  }

  submitLocation(data) {
    if (this.isNew) {
      this.saveNewLocation(data);
    } else {
      this.saveEditLocation(data);
    }
  }

  closeModal() {
    this.locationFormModal.cancel();
  }

  resetState(state?: string) {
    if (state === 'create') {
      this.locationCreateStore$.dispatch(new fromStore.CreateLocationReset());
    } else if (state === 'update') {
      this.locationUpdateStore$.dispatch(new fromStore.UpdateLocationReset());
    }
  }

}
