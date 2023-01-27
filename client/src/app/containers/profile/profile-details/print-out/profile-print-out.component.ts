import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import * as ProfileUtils from '../../shared/profile.utils';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as fromRoot from '../../../../core/core.reducer';
import { PrintOutService } from '../../../../core/services/print-out.service';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../shared/modules/cbs-form/models/field-config.interface';
import * as moment from 'moment';
import { CurrentUserService } from '../../../../core/store/users/current-user';

@Component({
  selector: 'cbs-profile-print-out',
  templateUrl: 'profile-print-out.component.html',
  styleUrls: ['profile-print-out.component.scss']
})

export class ProfilePrintOutComponent implements OnInit {
  public profile: any;
  public imageUrl = '';
  public navElements = [];
  public opened = false;
  public url = '';
  public isOpen = false;
  public reportName: string;
  public reportForm: FormGroup;
  public customFields = [];
  public fieldsReady = true;
  public routeSub: any;
  public statusSub: any;
  public currentReport: any;
  public profileType: string;
  public defaultField: any;
  public profileId: number;
  public forms = [];
  public isLoading: boolean;

  private permissions: any[];
  private permissionSub: any;

  constructor(private profileStore$: Store<IProfile>,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder,
              private currentUserService: CurrentUserService,
              private route: ActivatedRoute,
              private toastrService: ToastrService,
              private printOutService: PrintOutService) {
    this.profile = this.store$.select(fromRoot.getProfileState);

  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];

      if (this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups') {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
    });

    this.reportForm = this.fb.group({
      fieldValues: this.fb.array([])
    });

    this.printOutService.getForms('PROFILE').subscribe((forms) => {
      if (!forms.err) {
        this.forms = forms;
        this.printOutService.getExcelForms('PROFILE').subscribe(a => {
          this.forms = this.forms.concat(a);
        });
        this.isLoading = false;
      }
    });

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
    .subscribe((status: string) => {
      if (this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups') {
        this.navElements = ProfileUtils.setNavElements(
          this.profileType,
          this.profileId,
          this.permissions
        );
      }
    });
  }


  openAttachment(attachment) {
    if (attachment.contentType && this.testIfImage(attachment.contentType)) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  getFileExtension(fileName) {
    return fileName.toLowerCase().split('.').pop();
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  generateCustomFields(fieldsArray) {
    const fields = <FormArray>this.reportForm.controls['fieldValues'];
    if (fields.length) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(el => {
      if (el['fieldType'] === 'LOOKUP' && el['extra'] && el['extra']['key']) {
        el['extra']['url'] = `${environment.API_ENDPOINT}${el['extra']['key']}/lookup`;
      }
      return el;
    }).map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
    });

    this.customFields = fieldsArray;
    this.fieldsReady = false;
  }

  createControl(config: FieldConfig) {
    const newDate = new Date();
    const firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

    if (config.name === 'startDate') {
      config.value = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss');
    }
    if (config.name === 'endDate' || config.name === 'ddate') {
      config.value = moment(newDate).format('YYYY-MM-DDTHH:mm:ss');
    }

    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if (required) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  downLoad(doc) {
    this.reportName = doc['label'];
    this.currentReport = doc;
    if (doc.fields) {
      if (doc.fields.length) {
        doc.fields.map((field, i) => {
          if (field['extra']['default']) {
            this.defaultField = field;
            doc.fields.splice(i, 1);
          }
        })
      }
      const objToSend = {
        fieldsValues: {}
      };
      objToSend['fieldsValues'][this.defaultField['name']] = this.profileId;
      objToSend['templateId'] = doc['id'];
      if (doc.fields.length) {
        this.generateCustomFields(doc['fields']);
        this.isOpen = true;
      } else {
        this.printOutService.downloadExcelForm(objToSend).subscribe(res => {
          this.isOpen = false;
          if (res.err) {
            this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
          } else {
            FileSaver.saveAs(res, `${doc['label']}.xlsx`);
          }
        });
      }
    } else {
      const objToSend = {
        entityId: this.profileId,
        templateId: doc['id']
      };
      this.printOutService.downloadForm(objToSend, 'PROFILE').subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
        } else {
          FileSaver.saveAs(res, `${doc['label']}.docx`);
        }
      })
    }

  }

  submit() {
    this.isOpen = false;
    const objToSend = {
      templateId: this.currentReport['id'],
      fieldsValues: {}
    };
    this.reportForm.value.fieldValues.map((field: Object) => {
      this.customFields.map(item => {
        if (field.hasOwnProperty(item.name)) {
          objToSend.fieldsValues[item.name] = field[item.name];
        }
      });
    });
    if (this.defaultField) {
      objToSend['fieldsValues'][this.defaultField['name']] = this.profileId;
    }
    this.printOutService.downloadExcelForm(objToSend).subscribe(res => {
      if (res.err) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        FileSaver.saveAs(res, `${this.currentReport['label']}.xlsx`);
      }
    });
  }

  cancel() {
    this.isOpen = false;
  }
}
