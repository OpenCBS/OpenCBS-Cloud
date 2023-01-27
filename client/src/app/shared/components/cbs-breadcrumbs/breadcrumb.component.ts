import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'cbs-breadcrumb',
  template: `
    <nav role="navigation" aria-label="Breadcrumbs">
      <ol class="slds-breadcrumb slds-list--horizontal">
        <li class="slds-breadcrumb__item slds-text-title--caps" *ngFor="let item of breadcrumbLinks">
          <a href="javascript:void(0);" *ngIf="!item?.link">{{ item?.name | translate }}</a>
          <a [routerLink]="item?.link" *ngIf="item?.link">{{ item?.name | translate }}</a>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    nav {
      width: max-content;
    }

    .slds-breadcrumb .slds-list__item:before,
    .slds-breadcrumb__item:before {
      top: -0.1rem;
    }

    .slds-breadcrumb {
      height: 15px;
    }
  `]
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() breadcrumbLinks = [];
  @Input() autoGenerate = false;


  private routeSub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.autoGenerate) {
      this.routeSub = this.route.url.subscribe((urls: UrlSegment[]) => {
        this.breadcrumbLinks = [];
        const a = [];
        urls.map(url => {
          a.push(url.path);
          this.breadcrumbLinks.push({
            name: `${url.path.split('-').join(' ')}`,
            link: `/${a.join('/')}`
          });
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
