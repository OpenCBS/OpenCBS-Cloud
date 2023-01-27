import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ILoanAppState } from '../../../../core/store/loan-application/loan-application';
import { ILoanInfo } from '../../../../core/store/loans/loan';
import { LoanAppCustomFieldsService } from '../../../../core/store/loan-application';
import * as _ from 'lodash';
import * as fromRoot from '../../../../core/core.reducer';
import { CustomFieldValue } from '../../../../core/models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loan-custom-fields',
  templateUrl: './loan-custom-fields.component.html',
  styleUrls: ['loan-custom-fields.component.scss']
})
export class LoanCustomFieldsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public attachments = [];
  public customFields: any;
  public profileType: string;
  public profile: any;
  public loan: any;
  public isLoading = true;

  private loanSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCustomFieldService: LoanAppCustomFieldsService,
              private router: Router) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan.loan;
          this.profile = this.loan.profile;
          this.profileType = this.profile.type;
          const profileType = this.profileType  === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.profile['name'],
              link: `/profiles/${profileType}/${this.profile['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: this.loan ['code'],
              link: ''
            },
            {
              name: 'ADDITIONAL_INFORMATION',
              link: ''
            }
          ];
        }
      });

    this.loanApplicationSub = this.loanApplicationStore$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          // this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
          this.getCustomFields(loanAppState.loanApplication['id'])
        }
      });
  }

  getCustomFields(id) {
    this.loanAppCustomFieldService.getCustomFields(id)
      .subscribe(fields => {
          this.isLoading = false;
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
        }
      )
  }

  goToProfile(profileField: CustomFieldValue) {
    const extraKey: string = _.get(profileField, 'extra.key', '');
    let profileType = '';
    if ( extraKey === 'profiles/people' ) {
      profileType = 'people'
    } else if ( extraKey === 'profiles/company' ) {
      profileType = 'company'
    }
    if ( !profileType ) {
      return
    }
    this.router.navigate(['/profiles', profileType, profileField.value['id'], 'info']);
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.loanSub.unsubscribe();
  }
}
