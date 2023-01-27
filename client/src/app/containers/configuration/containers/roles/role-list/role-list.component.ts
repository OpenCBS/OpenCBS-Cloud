import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { RoleListState } from '../../../../../core/store/roles';

const SVG_DATA = {
  collection: 'standard',
  class: 'service-resource',
  name: 'service_resource'
};

@Component({
  selector: 'cbs-config-roles',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  public roles;
  public showAll = false;
  public queryObjectShowAll = {
    showAll: false
  };
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'ROLES',
      link: '/configuration/roles'
    }
  ];

  private paramsSub: any;

  constructor(private roleStore$: Store<RoleListState>,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private route: ActivatedRoute) {
    this.roles = this.store$.pipe(select(fromRoot.getRolesState));
  }

  ngOnInit() {
    this.roleStore$.dispatch(new fromStore.LoadRoleList());

    this.paramsSub = this.route.queryParams.subscribe(() => {
      if ( this.queryObjectShowAll.showAll ) {
        this.roleStore$.dispatch(new fromStore.LoadRoleList(this.queryObjectShowAll));
      } else {
        this.roleStore$.dispatch(new fromStore.LoadRoleList());
      }
    });
  }

  rowStyleClass(row) {
    return row.statusType !== 'ACTIVE' ? 'is-deleted' : '';
  }

  showAllRoles() {
    this.showAll = !this.showAll;
    this.queryObjectShowAll = {
      showAll: this.showAll
    };
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObjectShowAll
    };
    this.router.navigate(['configuration/roles'], navigationExtras);
  }
  goToRoleDetails(role) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/roles', role.id, 'info'], navigationExtras)
  }
}
