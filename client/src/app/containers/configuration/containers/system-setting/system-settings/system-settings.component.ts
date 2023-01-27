import { Component, OnInit } from '@angular/core';

const SVG_DATA = {collection: 'custom', class: 'custom108', name: 'custom108'};

@Component({
  selector: 'cbs-system-settings',
  templateUrl: 'system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  public svgData = SVG_DATA;
  public breadcrumb = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: `SYSTEM_SETTINGS`,
      link: ''
    }
  ];

  constructor() {
  }

  ngOnInit() {

  }

  public list = [{
    name: 'PASSWORD_SETTINGS',
    link: '/configuration/system-setting/containers/password-setting/password-settings/password',
    description: 'PASSWORD_SETTINGS_DESC',
    icon: {collection: 'action', name: 'password_unlock', className: 'password-unlock'}
  }, {
    name: 'REGIONAL_FORMATS',
    link: '/configuration/system-setting/containers/regional-formats-date',
    description: 'REGIONAL_FORMATS_DESC',
    icon: {collection: 'action', name: 'web_link', className: 'web-link'}
  }];
}
