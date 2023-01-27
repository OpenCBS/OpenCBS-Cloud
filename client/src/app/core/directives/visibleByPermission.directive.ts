import { Directive, ViewContainerRef, TemplateRef, Input, OnDestroy } from '@angular/core';
import { checkPermissions } from '../utils/common.utils';
import { CurrentUserService } from '../store/users/current-user';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromRoot from '../../core/core.reducer';

@Directive({
  selector: '[cbsVisibleByPermission]'
})
export class VisibleByPermissionDirective implements OnDestroy {
  private permissionSub: any;

  @Input() set cbsVisibleByPermission(data: { group: string, permissions?: any }) {

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      if ( data && data['permissions'] ) {
        checkPermissions(userPermissions, data) ? this.view.createEmbeddedView(this.template) : this.view.clear();
      } else {
        if ( data['group']['hasChildren'] && data['group']['children'].length ) {
          data['group']['children'].some(child => {
            return this.checkPermissionByGroupName(userPermissions, {group: child}) ?
              this.view.createEmbeddedView(this.template) : this.view.clear();
          });
        } else {
          this.checkPermissionByGroupName(userPermissions, data) ? this.view.createEmbeddedView(this.template) : this.view.clear();
        }
      }
    });
  }

  checkPermissionByGroupName(permissions, data) {
    return permissions.some((section: {}) => {
      if ( section['group'] === 'AUDIT_TRAIL' ) {
        return section['permissions'].some((sec: {}) => {
          return sec === data['group']['name'];
        })
      } else {
        return section['group'] === data['group']['name'];
      }
    });
  }

  constructor(private view: ViewContainerRef,
              private template: TemplateRef<any>,
              private store$: Store<fromRoot.State>,
              private currentUserService: CurrentUserService) {
  }

  ngOnDestroy() {
    this.permissionSub.unsubscribe();
  }
}
