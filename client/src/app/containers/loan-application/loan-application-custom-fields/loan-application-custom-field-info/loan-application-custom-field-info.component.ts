import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import * as fromRoot from '../../../../core/core.reducer';
import { Router } from '@angular/router';

import {
  ILoanAppState,
} from '../../../../core/store/loan-application';
import { LoanAppSubmitService } from '../../shared/services/loan-app-submit.service';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import { LoanAppCustomFieldsService } from '../../../../core/store/loan-application/loan-app-custom-fields.service';
import { CustomFieldValue } from '../../../../core/models';


const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-application-custom-field-info',
  templateUrl: './loan-application-custom-field-info.component.html',
  styleUrls: ['./loan-application-custom-field-info.component.scss']
})
export class LoanApplicationCustomFieldInfoComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public loanApplicationState: ILoanAppState;
  public loanApplication: any;
  public url = '';
  public loanAppId: number;
  public text: string;
  public opened = false;
  public submitService = this.loanAppSubmitService;
  public isVisible = false;
  public customFields = [];
  public sectionNavData: any = [];
  public progressValue: any;
  public activeSectionId = 1;
  public readOnly = false;

  private loanApplicationSub: any;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppSubmitService: LoanAppSubmitService,
              private loanAppCustomFieldService: LoanAppCustomFieldsService,
              private router: Router) {
  }

  ngOnInit() {
    this.loanApplicationSub = this.loanApplicationStore$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        this.loanApplicationState = loanAppState;
        this.loanApplication = loanAppState.loanApplication;
        this.readOnly = this.loanApplication.readOnly;
        this.loanAppStatus = loanAppState.loanApplication['status'];
        switch (this.loanAppStatus) {
          case 'IN_PROGRESS':
            this.progressValue = 25 + '%';
            break;
          case 'PENDING':
            this.progressValue = 50 + '%';
            break;
          case 'APPROVED':
            this.progressValue = 75 + '%';
            break;
          default:
            this.progressValue = 100 + '%';
        }
        if (loanAppState.success && loanAppState.loaded && loanAppState.loanApplication) {
          this.loanAppId = loanAppState.loanApplication['id'];
          const loanProfile = loanAppState.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: loanAppState.loanApplication['code'],
              link: ''
            },
            {
              name: 'ADDITIONAL_INFORMATION',
              link: ''
            }
          ];

          this.url = `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/attachments`;
          this.loanAppCustomFieldService.getCustomFields(this.loanAppId).subscribe(fields => {
            this.customFields = _.map(fields, (section: any) => {
              return {
                ...section,
                values: _.map(section.values, (field: any) => {
                  return {
                    ...field.customField,
                    value: field.value
                  }
                })
              }
            });
            fields.map(section => {
              this.sectionNavData.push({
                title: section.caption,
                id: section.id
              });
            });
          });
        }
      });
  }

  informVisibleBlock(sectionEl: HTMLElement) {
    const section = sectionEl.id;

    this.activeSectionId = +section.split('_')[1];
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
  }

  closeConfirmPopup() {
    this.isVisible = false;
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

  goToProfile(profileField: CustomFieldValue) {
    const extraKey: string = _.get(profileField, 'extra.key', '');
    let profileType: string = '';
    if (extraKey === 'profiles/people') {
      profileType = 'people'
    } else if (extraKey === 'profiles/company') {
      profileType = 'company'
    }
    if (!profileType) {
      return
    }
    this.router.navigate(['/profiles', profileType, profileField.value['id'], 'info']);
  }
}
