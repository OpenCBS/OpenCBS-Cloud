import { Component } from '@angular/core';

const SVG_DATA = {
  collection: 'standard',
  class: 'apps',
  name: 'apps'
};

@Component({
  selector: 'cbs-configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  public searchQuery = '';
  public svgData = SVG_DATA;

  public list = [{
    name: 'BRANCHES',
    link: '/configuration/branches',
    description: 'BRANCH_CONFIGURATIONS_DESCRIPTION',
    icon: {collection: 'standard', name: 'hierarchy', className: 'hierarchy'}
  }, {
    name: 'BUSINESS_SECTORS',
    link: '/configuration/business-sectors',
    description: 'BUSINESS_SECTORS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom57', className: 'custom57'}
  }, {
    name: 'TYPES_OF_COLLATERAL',
    link: '/configuration/collateral-types',
    description: 'TYPES_OF_COLLATERALS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'asset_relationship', className: 'asset-relationship'}
  }, {
    name: 'CREDIT_COMMITTEE',
    link: '/configuration/credit-committee-rules',
    description: 'CREDIT_COMMITTEES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'team_member', className: 'team-member'}
  }, {
    name: 'CUSTOM_FIELDS',
    link: '/configuration/custom-field',
    description: 'CUSTOM_FIELDS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'record', className: 'record'}
  }, {
    name: 'ENTRY_FEES',
    link: '/configuration/entry-fees',
    description: 'ENTRY_FEES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom41', className: 'custom41'}
  }, {
    name: 'HOLIDAYS',
    link: '/configuration/holidays',
    description: 'HOLIDAYS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'reward', className: 'reward'}
  }, {
    name: 'LOAN_PRODUCTS',
    link: '/configuration/loan-products',
    description: 'LOAN_PRODUCTS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'product_required', className: 'product-required'}
  }, {
    name: 'BORROWING_PRODUCTS',
    link: '/configuration/borrowing-products',
    description: 'BORROWING_PRODUCTS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'calibration', className: 'calibration'}
  }, {
    name: 'LOAN_PURPOSES',
    link: '/configuration/loan-purposes',
    description: 'LOAN_PURPOSES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'report', className: 'report'}
  }, {
    name: 'LOCATIONS',
    link: '/configuration/locations',
    description: 'LOCATIONS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'location', className: 'location'}
  }, {
    name: 'PAYEES',
    link: '/configuration/payees',
    description: 'PAYEES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'groups', className: 'groups'}
  }, {
    name: 'PROFESSIONS',
    link: '/configuration/professions',
    description: 'PROFESSIONS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'person_account', className: 'person-account'}
  }, {
    name: 'ROLES',
    link: '/configuration/roles',
    description: 'ROLES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'service_resource', className: 'service-resource'}
  }, {
    name: 'TELLER_MANAGEMENT',
    link: '/configuration/tills',
    description: 'TELLER_MANAGEMENT_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'client', className: 'client'}
  }, {
    name: 'USERS',
    link: '/configuration/users',
    description: 'USERS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom15', className: 'custom15'}
  }, {
    name: 'VAULTS',
    link: '/configuration/vaults',
    description: 'VAULTS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom17', className: 'custom17'}
  }, {
    name: 'SAVING_PRODUCTS',
    link: '/configuration/saving-products',
    description: 'SAVING_PRODUCTS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'case', className: 'case'}
  }, {
    name: 'OTHER_FEES',
    link: '/configuration/other-fees-list',
    description: 'OTHER_FEES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom41', className: 'custom41'}
  }, {
    name: 'TERM_DEPOSIT_PRODUCTS',
    link: '/configuration/term-deposit-products',
    description: 'TERM_DEPOSIT_PRODUCTS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom17', className: 'custom17'}
  }, {
    name: 'SYSTEM_SETTINGS',
    link: '/configuration/system-settings',
    description: 'SYSTEM_SETTINGS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom108', className: 'custom108'}
  }, {
    name: 'PENALTIES',
    link: '/configuration/penalties',
    description: 'PENALTIES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'custom', name: 'custom9', className: 'custom9'}
  }, {
    name: 'TRANSACTION_TEMPLATES',
    link: '/configuration/transaction-templates',
    description: 'TRANSACTION_TEMPLATES_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'work_type', className: 'work-type'}
  }, {
    name: 'PAYMENT_METHODS',
    link: '/configuration/payment-methods',
    description: 'PAYMENT_METHODS_CONFIGURATION_DESCRIPTION',
    icon: {collection: 'standard', name: 'client', className: 'client'}
  }];
}
