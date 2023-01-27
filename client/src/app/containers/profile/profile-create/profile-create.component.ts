import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

import {
  CreateProfileState,
  ProfileFieldsState,
  getProfileCustomFields
} from '../../../core/store/index';
import { CustomFieldSectionMeta } from '../../../core/models/customField.model';
import { FieldConfig } from '../../../shared/modules/cbs-form/models/field-config.interface';

const SVG_DATA = {collection: 'standard', class: 'user', name: 'user'};

@Component({
  selector: 'cbs-new-profile',
  templateUrl: 'profile-create.component.html',
  styleUrls: ['profile-create.component.scss']
})
export class NewProfileComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public profileBreadcrumbLabel = '';
  public profileForm: FormGroup;
  public createProfileState: CreateProfileState;
  public profileFieldSections: CustomFieldSectionMeta[] = [];
  public profileFieldsStore: any;
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public sectionNavData: any = [];
  public activeSectionId = 1;
  public loading = true;

  private createProfileSub: any;
  private routeSub: any;
  private type: string;
  private profileFieldsSub: any;

  constructor(private createProfileStore$: Store<CreateProfileState>,
              private profileFieldsMetaStore$: Store<ProfileFieldsState>,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private route: ActivatedRoute,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
    this.profileFieldsStore = this.store$.pipe(select(fromRoot.getProfileFieldsState));
  }

  ngOnInit() {
    this.buildProfileForm();

    this.routeSub = this.route.params
      .subscribe(
        params => {
          this.type = params['type'];
          if ( this.type === 'people' ) {
            this.profileBreadcrumbLabel = 'CREATE_PERSON';
          } else if ( this.type === 'companies' ) {
            this.profileBreadcrumbLabel = 'CREATE_COMPANIES';
          } else if ( this.type === 'groups' ) {
            this.profileBreadcrumbLabel = 'CREATE_GROUP';
          }

          this.breadcrumbLinks = [
            {
              name: 'PROFILES',
              link: '/profiles'
            },
            {
              name: this.profileBreadcrumbLabel,
              link: ''
            }
          ];

          if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
            this.profileFieldsMetaStore$.dispatch(new fromStore.LoadProfileFieldsMeta(this.type));
          }
        });

    this.profileFieldsSub = this.profileFieldsStore.pipe(getProfileCustomFields())
      .subscribe(
        (sectionsMeta: CustomFieldSectionMeta[]) => {
          this.profileFieldSections = sectionsMeta;
          this.sectionNavData = [];

          sectionsMeta.map(section => {
            this.sectionNavData.push({
              title: section.caption,
              id: section.id
            });
          });

          this.generateSections(this.profileFieldSections);
        }
      );

    this.createProfileSub = this.store$.pipe(select(fromRoot.getCreateProfileState))
      .subscribe(
        (state: CreateProfileState) => {
          this.createProfileState = state;
          if ( state.loaded && state.success && !state.error ) {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS')
              .subscribe(
                (res: string) => {
                  this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
                });
            this.goToProfileInfo();
          } else if ( state.loaded && !state.success && state.error ) {
            this.translate.get('CREATE_ERROR')
              .subscribe(
                (res: string) => {
                  this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
                });
            this.resetState();
            this.disableSubmitBtn(false);
          }
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.profileFieldsSub.unsubscribe();
    this.createProfileSub.unsubscribe();

    this.profileFieldsStore.dispatch(new fromStore.ResetProfileFieldsMeta());
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

  generateSections(sectionsMeta) {
    if ( sectionsMeta.length ) {
      const sections = <FormArray>this.profileForm.controls['fieldSections'];

      if ( sections.length ) {
        sections.value.map(item => {
          sections.removeAt(sections.controls.indexOf(item));
        });
      }

      sectionsMeta.map((section, index) => {
        sections.push(this.fb.array([]));
        this.generateCustomFields(section.customFields, index);
      });
      this.loading = false;
    }
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
  }

  submit({valid, value}) {
    if ( valid ) {
      this.disableSubmitBtn(true);
      const profileDataToSend = {
        fieldValues: []
      };
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.profileFieldSections, 'customFields');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.name ) {
            profileDataToSend.fieldValues.push({
              fieldId: field.id,
              value: valItem[key] ? valItem[key] : null
            });
          }
        });
      });

      this.createProfileStore$.dispatch(new fromStore.CreateProfile({data: profileDataToSend, type: this.type}));
    }
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

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  goToProfileInfo() {
    this.resetState();
    this.router.navigate(['profiles']);
  }

  resetState() {
    this.createProfileStore$.dispatch(new fromStore.CreateProfileReset());
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
}
