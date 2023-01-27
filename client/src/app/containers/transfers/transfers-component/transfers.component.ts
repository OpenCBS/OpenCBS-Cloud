import { Component, OnDestroy, OnInit } from '@angular/core';

const SVG_DATA = {
  collection: 'standard',
  class: 'apps',
  name: 'apps'
};

@Component({
  selector: 'cbs-transfers',
  templateUrl: 'transfers.component.html'
})

export class TransfersComponent implements OnInit, OnDestroy {
  svgData = SVG_DATA;
  list = [{
    name: 'BANK_TO_VAULT',
    link: '/transfers/from-bank-to-vault',
    description: 'Transfer from bank to vault',
    icon: {collection: 'standard', name: 'portal', className: 'portal'}
  }, {
    name: 'VAULT_TO_BANK',
    link: '/transfers/from-vault-to-bank',
    description: 'Transfer from vault to bank',
    icon: {collection: 'custom', name: 'custom57', className: 'custom57'}
  }, {
    name: 'BETWEEN_MEMBERS',
    link: '/transfers/between-members',
    description: 'Transfer between members',
    icon: {collection: 'standard', name: 'asset_relationship', className: 'asset-relationship'}
  }];

  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
