import { Component } from '@angular/core';

const SVG_DATA = {
  collection: 'standard',
  class: 'apps',
  name: 'apps'
};

@Component({
  selector: 'cbs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public searchQuery = '';
  public svgData = SVG_DATA;

  public list = [{
    name: 'DAY_CLOSURE',
    link: '/settings/operation-day',
    description: 'CONSTRUCTOR_FOR_DAY_CLOSURE',
    icon: {collection: 'standard', name: 'entity_milestone', className: 'entity-milestone'}
  }, {
    name: 'EXCHANGE_RATE',
    link: '/settings/exchange-rate',
    description: 'CONSTRUCTOR_FOR_EXCHANGE_RATE',
    icon: {collection: 'standard', name: 'service_report', className: 'service-report'}
  }, {
    name: 'AUDIT_TRAIL',
    link: '/settings/audit-trails',
    description: 'CONSTRUCTOR_FOR_AUDIT_TRAILS',
    icon: {collection: 'standard', name: 'apps_admin', className: 'apps-admin'}
  }, {
    name: 'INTEGRATION_WITH_BANK',
    link: '/settings/integration-with-bank',
    description: 'CONSTRUCTOR_FOR_INTEGRATION_WITH_BANK',
    icon: {collection: 'standard', name: 'folder', className: 'folder'}
  }, {
    name: 'PAYMENT_GATEWAY',
    link: '/settings/payment-gateway',
    description: 'CONSTRUCTOR_FOR_PAYMENT_GATEWAY',
    icon: {collection: 'standard', name: 'task', className: 'task'}
  }];
}
