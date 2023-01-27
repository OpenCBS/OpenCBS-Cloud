import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import * as fromRoot from '../../../../core/core.reducer';
import { BondListService } from '../../../../core/store/bond/bond-list';

@Component({
  selector: 'cbs-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss']
})
export class BondsComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public bonds: any;
  public isLoading: any;
  public profileType: string;
  public opened = false;

  private permissionSub: any;
  private statusSub: any;
  private routeSub: any;
  private permissions: any[];
  private profileSub: any;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private bondService: BondListService,
              private router: Router,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.profile = this.profileStore$.select(fromRoot.getProfileState);

    this.permissionSub = this.currentUserService.currentUserPermissions$
      .subscribe(userPermissions => {
        this.permissions = userPermissions;
      });

    this.routeSub = this.route.parent.params
      .subscribe(params => {
        this.profileId = +params['id'];
        this.profileType = params['type'];
      });

    this.statusSub = this.profileStore$
      .select(fromRoot.getProfileState)
      .pipe(getProfileStatus())
      .subscribe(() => {
        if (this.profileType === 'people' || this.profileType === 'companies') {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });

    this.bonds = this.bondService.getProfileBondList(this.profileId);
  }

  goToBondInfo(bond: any) {
    this.router.navigate(['/bonds', bond.data.id, 'info']);
  }

  goToCreateBond(profSub) {
    this.profileSub = profSub.subscribe(profile => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          profileId: profile.id,
          profileName: profile.name,
          profileType: profile.type
        }
      };
      this.router.navigate(['/bonds', 'create', 'info'], navigationExtras);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }
}
