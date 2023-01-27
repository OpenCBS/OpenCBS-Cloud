import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { CurrentUserAppState } from '../../store/users';
import { AuthAppState } from '../../store/auth';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { LocationService } from '../../services';

@Component({
  selector: 'cbs-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  providers: [CommonService]
})
export class HeaderComponent implements OnInit, OnDestroy {
  public mainNavElements: Object[] = [];
  public currentUser: Observable<any>;
  public open = false;
  public openLang = false;
  public version: any;
  public userId: number;
  public currentLang: string;

  private user: any;

  constructor(private commonService: CommonService,
              private userStore$: Store<CurrentUserAppState>,
              private authStore$: Store<AuthAppState>,
              private router: Router,
              private locationService: LocationService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.currentUser = this.store$.pipe(select(fromRoot.getCurrentUserState));
  }

  ngOnInit() {
    this.currentLang = this.locationService.getData();
    this.mainNavElements = environment.NAVS['MAIN_NAV'];

    this.user = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(res => {
      this.userId = res.id;
    });

    if ( window.history.state.navigationId === 1 ) {
      this.logout();
    }
  }

  logout() {
    this.authStore$.dispatch(new fromStore.PurgeAuth());
    this.router.navigate(['/login']);
  }

  changeLang(lang) {
    this.locationService.setData(lang);
    this.openLang = false;
    this.currentLang = lang;
    this.translate.use(lang);
  }

  goToUserDetails() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/users', this.userId, 'info'], navigationExtras)
  }

  openVersionModal() {
    this.commonService.getVersion().subscribe(res => {
      this.version = res;
      this.open = true;
    });
  }

  ngOnDestroy() {
    this.locationService.setData(this.currentLang);
    this.user.unsubscribe();
  }
}
