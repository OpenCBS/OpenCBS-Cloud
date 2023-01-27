import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { getProfileStatus, IProfile } from '../../../../core/store/profile';
import { CurrentUserService } from '../../../../core/store/users/current-user';
import * as ProfileUtils from '../../shared/profile.utils';
  import * as fromRoot from '../../../../core/core.reducer';
import { Observable, Subscription } from 'rxjs';
import * as fromStore from '../../../../core/store';
import { ISavingProfileList } from '../../../../core/store/saving/saving-profile-list';

@Component({
  selector: 'cbs-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss']
})
export class SavingsComponent implements OnInit, OnDestroy {
  public profile: Observable<IProfile>;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public savings: any;
  public isLoading: any;
  public profileType: string;
  public opened = false;
  public savingData: Observable<ISavingProfileList>;
  public queryObject = {
    page: 1
  };

  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private profileSub: Subscription;
  private paramsSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private savingProfileListStore$: Store<ISavingProfileList>,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
    });

    this.isLoading = true;
    this.profile = this.profileStore$.pipe(select(fromRoot.getProfileState));

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.savingData = this.store$.pipe(select(fromRoot.getSavingProfileListState));
    this.currentPageSub = this.savingData.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;
      if (this.queryObject.page !== 1) {
        this.savingProfileListStore$.dispatch(new fromStore.LoadSavingsProfile({
          queryObject: this.queryObject,
          profileId: this.profileId
        }));
      } else {
        this.savingProfileListStore$.dispatch(new fromStore.LoadSavingsProfile({
          profileId: this.profileId
        }));
      }
    });

    this.statusSub = this.profileStore$.pipe(select(fromRoot.getProfileState), getProfileStatus())
      .subscribe(() => {
        this.isLoading = false;
        if ( this.profileType === 'people' || this.profileType === 'companies' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });
  }

  getCurrentPage = () => {
    return state => state
      .map(s => {
        return s.currentPage;
      });
  };

  goToNextPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate([`profiles/${this.profileType}/${this.profileId}/savings`], navigationExtras);
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  goToSavingInfo(saving: any) {
    this.router.navigate(['/savings', saving.data.id, 'info']);
  }

  goToCreateSaving(profSub) {
    this.profileSub = profSub.subscribe(profile => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          profileId: profile.id,
          profileName: profile.name,
          profileType: profile.type
        }
      };
      this.router.navigate(['/savings', 'create', 'info'], navigationExtras);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
    if ( this.profileSub ) {
      this.profileSub.unsubscribe();
    }
    this.permissionSub.unsubscribe();
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }
}
