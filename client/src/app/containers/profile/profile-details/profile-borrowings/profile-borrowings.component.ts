import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CurrentUserService } from '../../../../core/store/users/current-user';
import { getProfileStatus, IProfile } from '../../../../core/store/profile';
import { environment } from '../../../../../environments/environment';
import * as ProfileUtils from '../../shared/profile.utils';
import * as fromRoot from '../../../../core/core.reducer';
import { BorrowingListService } from '../../../../core/store/borrowings/borrowing-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-profile-borrowings',
  templateUrl: 'profile-borrowings.component.html',
  styleUrls: ['profile-borrowings.component.scss']
})
export class ProfileBorrowingsComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public borrowings: any;
  public imageUrl = '';
  public opened = false;
  public url: string;
  public currencies: any;
  public profileType: string;
  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private profileSub: Subscription;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private borrowingService: BorrowingListService,
              private router: Router,
              private currentUserService: CurrentUserService) {

  }

  ngOnInit() {
    this.profile = this.profileStore$.select(fromRoot.getProfileState);
    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
      if ( this.profileType === 'people' || this.profileType === 'companies' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
      this.borrowings = this.borrowingService.getProfileBorrowingList(this.profileId);
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });
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

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  resetModal() {
    this.imageUrl = '';
  }

  goToBorrowingInfo(borrowing: any) {
    this.router.navigate(['/borrowings', borrowing.data.id, 'info']);
  }

  goToCreateBorrowing(profSub) {
    this.profileSub = profSub.subscribe(profile => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          profileId: profile.id,
          profileName: profile.name,
          profileType: profile.type
        }
      };
      this.router.navigate(['/borrowings', 'create', 'info'], navigationExtras);
    });
  }

  ngOnDestroy() {
    this.permissionSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    if ( this.profileSub ) {
      this.profileSub.unsubscribe();
    }
  }
}
