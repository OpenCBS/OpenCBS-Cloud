import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {
  collection: 'standard',
  class: 'apps',
  name: 'apps'
};

@Component({
  selector: 'cbs-audit-trails',
  templateUrl: 'audit-trails.component.html',
  styleUrls: ['./audit-trails.component.scss']
})
export class AuditTrailsComponent implements OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'SETTINGS',
      link: '/settings'
    },
    {
      name: 'AUDIT_TRAIL',
      link: ''
    }
  ];
  public list = [];

  private currentUser: any;
  private currentUserSub: Subscription;

  constructor(private store$: Store<fromRoot.State>) {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe(user => {
        if ( user.loaded && user.success && !user.error ) {
          this.currentUser = user;
        }
      });
  }

  ngOnInit() {
    this.list = [{
      name: 'AUDIT_TRAIL_BUSINESS_OBJECTS',
      link: '/audit-trail/business-objects',
      disabled: this.hasPermission('AUDIT_TRAIL_BUSINESS_OBJECTS'),
      icon: {collection: 'standard', name: 'social', className: 'social'}
    }, {
      name: 'AUDIT_TRAIL_EVENTS',
      link: '/audit-trail/events',
      disabled: this.hasPermission('AUDIT_TRAIL_EVENTS'),
      icon: {collection: 'standard', name: 'event', className: 'event'}
    }, {
      name: 'AUDIT_TRAIL_TRANSACTIONS',
      link: '/audit-trail/transactions',
      disabled: this.hasPermission('AUDIT_TRAIL_TRANSACTIONS'),
      icon: {collection: 'custom', name: 'custom41', className: 'custom41'}
    }, {
      name: 'AUDIT_TRAIL_USER_SESSIONS',
      link: '/audit-trail/user-sessions',
      disabled: this.hasPermission('AUDIT_TRAIL_USER_SESSIONS'),
      icon: {collection: 'standard', name: 'sossession', className: 'sossession'}
    }];
  }

  hasPermission(permission) {
    return this.currentUser['permissions'].some((a) => {
      if ( a['group'] === 'AUDIT_TRAIL' ) {
        return !a['permissions'].includes(permission);
      }
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}
