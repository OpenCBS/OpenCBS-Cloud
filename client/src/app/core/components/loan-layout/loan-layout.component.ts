import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-loan-layout',
  templateUrl: 'loan-layout.component.html',
  styleUrls: ['loan-layout.component.scss']
})
export class LoanLayoutComponent implements OnInit {
  @Input() sidebar = false;
  @Input() sidePanel = true;
  @Input() bottomToolbar = false;
  @Input() rightPanelScrollable = false;

  constructor() {
  }

  ngOnInit() {
  }
}
