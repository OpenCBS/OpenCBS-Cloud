import { Component } from '@angular/core';

const SVG_DATA = {
  collection: 'standard',
  class: 'record',
  name: 'record'
};

@Component({
  selector: 'cbs-custom-fields',
  templateUrl: 'custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})

export class CustomFieldsComponent {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'CUSTOM_FIELDS',
      link: '/configuration/custom-field'
    }
  ];

  public list = [{
    name: 'PROFILE_PERSON_FIELDS',
    link: '/configuration/profile-custom-field/people',
    description: 'PROFILE_PERSON_FIELDS_DESC',
    icon: {collection: 'action', name: 'add_contact', className: 'add-contact'}
  }, {
    name: 'PROFILE_COMPANY_FIELDS',
    link: '/configuration/profile-custom-field/companies',
    description: 'PROFILE_COMPANY_FIELDS_DESC',
    icon: {collection: 'action', name: 'description', className: 'description'}
  }, {
    name: 'GROUP_FIELDS',
    link: '/configuration/profile-custom-field/groups',
    description: 'GROUP_FIELDS_DESC',
    icon: {collection: 'action', name: 'new_group', className: 'new-group'}
  }, {
    name: 'LOAN_APPLICATION_FIELDS',
    link: '/configuration/loan-application-custom-field',
    description: 'LOAN_APPLICATION_FIELDS_DESC',
    icon: {collection: 'action', name: 'add_relationship', className: 'add-relationship'}
  }, {
    name: 'BRANCH_FIELDS',
    link: '/configuration/branch-custom-field',
    description: 'BRANCH_FIELDS_DESC',
    icon: {collection: 'action', name: 'web_link', className: 'web-link'}
  }];
}
