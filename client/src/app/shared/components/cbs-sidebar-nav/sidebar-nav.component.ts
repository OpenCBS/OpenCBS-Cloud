import { Component, Input } from '@angular/core';

@Component({
  selector: 'cbs-sidebar-nav',
  template: `
    <div class="cbs-sidebar-nav">
      <ul>
        <ng-container *ngFor="let nav of navElements">
          <a *ngIf="nav.visible" routerLinkActive="active" [routerLink]="nav.link">
            <li>
              <cbs-icon [iconConfig]="nav?.icon" [size]="'small'"></cbs-icon>
              {{ nav.name | translate }}
            </li>
          </a>
        </ng-container>
      </ul>
    </div>  `,
  styleUrls: ['sidebar-nav.component.scss']
})
export class SidebarNavComponent {
  @Input() navElements: Object[] = [];

}
