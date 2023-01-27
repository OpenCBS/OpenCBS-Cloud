import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import * as fromRoot from '../../../../core/core.reducer';
import { Subscription } from 'rxjs';
import * as fromStore from '../../../../core/store';
import { ITermDepositProfileList } from '../../../../core/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cbs-term-deposits',
  templateUrl: './term-deposits.component.html',
  styleUrls: ['./term-deposits.component.scss']
})
export class TermDepositsComponent implements OnInit, OnDestroy {
  public profile: Observable<IProfile>;
  public navElements = [];
  public profileId: number;
  public url: string;
  public termDepositData: Observable<ITermDepositProfileList>;
  public imageUrl = '';
  public termDeposits: any;
  public isLoading: any;
  public profileType: string;
  public opened = false;
  public queryObject = {
    page: 1
  };

  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private profileSub: Subscription;
  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private termDepositProfileListStore$: Store<ITermDepositProfileList>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
    });

    this.isLoading = true;
    this.profile = this.profileStore$.pipe(select(fromRoot.getProfileState));

    this.termDepositData = this.store$.pipe(select(fromRoot.getTermDepositProfileListState));
    this.currentPageSub = this.termDepositData.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.parent.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;
      if (this.queryObject.page !== 1) {
        this.termDepositProfileListStore$.dispatch(new fromStore.LoadTermDepositsProfile({
          queryObject: this.queryObject,
          profileId: this.profileId
        }));
      } else {
        this.termDepositProfileListStore$.dispatch(new fromStore.LoadTermDepositsProfile({
          profileId: this.profileId
        }));
      }
    });

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.statusSub = this.profileStore$.pipe(select(fromRoot.getProfileState))
      .pipe((getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
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
    this.router.navigate([`profiles/${this.profileType}/${this.profileId}/term-deposits`], navigationExtras);
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

  goToTermDepositInfo(termDeposit: any) {
    this.router.navigate(['/term-deposits', termDeposit.data.id, 'info']);
  }

  goToCreateTermDeposit(profSub) {
    this.profileSub = profSub.subscribe(profile => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          profileId: profile.id,
          profileName: profile.name,
          profileType: profile.type
        }
      };
      this.router.navigate(['/term-deposits', 'create', 'info'], navigationExtras);
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
