import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';

import { getCurrentProfileFields, getProfileStatus, IProfile, UpdateProfileState } from '../../../../core/store/index';
import * as ProfileUtils from '../../shared/profile.utils';
import { CustomFieldSectionValue } from '../../../../core/models/customField.model';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { FieldConfig } from '../../../../shared/modules/cbs-form/models/field-config.interface';


@Component({
  selector: 'cbs-profile-info-edit',
  templateUrl: 'profile-info-edit.component.html',
  styleUrls: ['profile-info-edit.component.scss']
})
export class ProfileInfoEditComponent implements OnInit, OnDestroy {
  public profile: any;
  public profileFieldSections: CustomFieldSectionValue[];
  public type: string;
  public id: any;
  public profileForm: FormGroup;
  public updateState: any;
  public isLoading = true;
  public formChanged = false;
  public sectionNavData: any = [];
  public activeSectionId = 1;
  public url = '';
  public navElements = [];
  public opened = false;
  public imageUrl = '';
  public isOpen = false;

  private isSubmitting = false;
  private fieldsSub: any;
  private updateStateSub: any;
  private routeSub: any;
  private cachedFormData: any[] = [];
  private formSub: any;
  private profileSub: any;
  private statusSub: any;
  private permissionSub: any;
  private permissions: any[];
  private isLeaving = false;
  private nextRoute: string;

  constructor(private profileStore$: Store<IProfile>,
              private updateProfileStore$: Store<UpdateProfileState>,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private route: ActivatedRoute,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private currentUserService: CurrentUserService) {
    this.profile = this.store$.pipe(select(fromRoot.getProfileState));
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngOnInit() {
    this.buildProfileForm();
    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.id = +params['id'];
      this.type = params['type'];

      if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.type}/${this.id}/attachments/`;
      }

    });

    this.statusSub = this.store$.pipe(select(fromRoot.getProfileState)).pipe(
      (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.type,
            this.id,
            this.permissions
          );
        }
      });

    this.fieldsSub = this.profile.pipe(getCurrentProfileFields())
      .subscribe(sectionsData => {
        if ( sectionsData.length ) {
          this.profileFieldSections = sectionsData;
          this.sectionNavData = [];

          sectionsData.map(section => {
            this.sectionNavData.push({
              title: section.caption,
              id: section.id
            });
          });

          const sections = <FormArray>this.profileForm.controls['fieldSections'];

          if ( sections.length ) {
            sections.value.map(item => {
              sections.removeAt(sections.controls.indexOf(item));
            });
          }

          this.profileFieldSections.map((section, index) => {
            sections.push(this.fb.array([]));
            this.generateCustomFields(section.values, index);
          });
        }
      });

    this.updateStateSub = this.store$.pipe(select(fromRoot.getUpdateProfileState))
      .subscribe((state: UpdateProfileState) => {
        this.updateState = state;

        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.navigateBack();
        } else if ( state.loaded && !state.success && state.error ) {
          this.toastrService.error(state.errorMessage, '', environment.ERROR_TOAST_CONFIG);
        }
      });

    this.profileSub = this.store$.pipe(select(fromRoot.getProfileState))
      .subscribe((state: IProfile) => {
        if ( state.loaded && state.success && !state.error ) {
          if ( this.profileForm.value.fieldSections.length ) {
            this.cachedFormData = [];
            this.profileForm.value.fieldSections.map(section => {
              section.map(field => {
                const key = Object.keys(field)[0];
                if ( typeof field[key] === 'object' ) {
                  const obj = {};
                  obj[key] = field[key]['id'];
                  this.cachedFormData.push(obj);
                } else {
                  this.cachedFormData.push(field);
                }
              });
            });
          }
          if ( this.formSub ) {
            this.formSub.unsubscribe();
          }
          this.formSub = this.profileForm.valueChanges.subscribe(data => {
            this.formChanged = this.checkFormChanges(this.flattenArray(data.fieldSections), this.cachedFormData);
          });
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.fieldsSub.unsubscribe();
    this.updateStateSub.unsubscribe();
    if (this.formSub) { this.formSub.unsubscribe() }
    this.profileSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.permissionSub.unsubscribe();

    // Clear form section data
    const sections = <FormArray>this.profileForm.controls['fieldSections'];
    if ( sections.length ) {
      sections.value.map(item => {
        sections.removeAt(sections.controls.indexOf(item));
      });
    }
  }


  buildProfileForm() {
    this.profileForm = this.fb.group({
      fieldSections: this.fb.array([])
    });
  }

  generateCustomFields(fields, index) {
    const section = <FormArray>this.profileForm.controls['fieldSections']['controls'][index];

    if ( section.length ) {
      section.value.map(item => {
        section.removeAt(section.controls.indexOf(item));
      });
    }

    fields.map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      section.push(group);
    });

    this.isLoading = false;
  }

  submitForm({valid, value}) {
    if ( valid ) {
      this.isSubmitting = true;
      const profileDataToSend = {
        fieldValues: []
      };
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.profileFieldSections, 'values');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.name ) {
            profileDataToSend.fieldValues.push({
              fieldId: field.id,
              value: valItem[key] ? valItem[key] : ''
            });
          }
        });
      });

      this.updateProfileStore$.dispatch(new fromStore.UpdateProfile({
        data: profileDataToSend,
        type: this.type,
        id: this.id
      }));
    }
  }

  navigateBack() {
    this.resetState();
    this.router.navigate(['/profiles']);
  }

  resetState() {
    this.updateProfileStore$.dispatch(new fromStore.UpdateProfileReset());
    this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id: this.id, type: this.type}));
  }

  checkFormChanges(fields, cachedData) {
    let status = false;

    if ( fields && fields.length ) {
      fields.map(field => {
        const fieldKey = Object.keys(field)[0];
        cachedData.map((item) => {
          let itemKey = Object.keys(item)[0];
          if ( typeof item[itemKey] === 'object' ) {
            itemKey = item[itemKey]['name'];
          }
          if ( itemKey === fieldKey && field[fieldKey] !== item[itemKey] ) {
            status = true;
          }
        });
      });
    }

    return status;
  }


  informVisibleBlock(sectionEl: HTMLElement) {
    const section = sectionEl.id;

    this.activeSectionId = +section.split('_')[1];
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  flattenArray(array, selector?) {
    let tempArray = [];
    array.map(item => {
      if ( Array.isArray(item) ) {
        tempArray = [...tempArray, ...item];
      }
      if ( selector && !Array.isArray(item) ) {
        tempArray = [...tempArray, ...item[selector]];
      }
    });
    return tempArray;
  }

  openAttachment(file) {
  }

  getFileExtension(file) {
  }

  resetModal() {
    this.imageUrl = '';
  }
}
