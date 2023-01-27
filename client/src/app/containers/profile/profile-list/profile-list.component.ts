import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {
  IProfileList,
  IProfile,
  getProfilesCurrentPage
} from '../../../core/store/index';
import { CommonService } from '../../../core/services';

const SVG_DATA = {
  collection: 'standard',
  class: 'record',
  name: 'record'
};

@Component({
  selector: 'cbs-profiles',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss']
})
export class ProfileListComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public profilesData: any;
  public searchQuery = '';
  public open = false;
  public profileType: string;
  public currentInstance: string;
  public queryObject = {
    search: '',
    page: 1
  };

  private paramsSub: any;
  private currentPageSub: any;

  constructor(private profilesStore$: Store<IProfileList>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private profileStore$: Store<IProfile>,
              private commonService: CommonService) {
    this.profilesData = this.store$.select(fromRoot.getProfilesState);
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.resetProfile();
    this.currentPageSub = this.profilesData.pipe(getProfilesCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
        this.profilesStore$.dispatch(new fromStore.LoadProfiles(this.queryObject));
      } else {
        this.profilesStore$.dispatch(new fromStore.LoadProfiles());
      }
    });
  }

  ngOnDestroy() {
    if ( this.currentPageSub ) {
      this.currentPageSub.unsubscribe();
    }
    if ( this.paramsSub ) {
      this.paramsSub.unsubscribe();
    }
  }

  resetProfile() {
    this.profileStore$.dispatch(new fromStore.ResetProfileInfo());
  }

  clearSearch() {
    this.search();
  }

  search(query?) {
    this.queryObject.search = query || '';
    this.queryObject.page = 1;

    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject.search ? this.queryObject : {}
    };

    this.router.navigate(['/profiles'], navigationExtras);
  }

  gotoPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/profiles'], navigationExtras);
  }

  goToProfile(profile) {
    this.profileType = profile.type === 'PERSON' ? 'people' : profile.type === 'COMPANY' ? 'companies' : 'groups';
    this.router.navigate(['/profiles', this.profileType, profile['id'], 'info']);
    this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id: profile['id'], type: this.profileType}));
  }
}
