import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppReadyService } from './core/services/app-ready.service';
import { AuthAppState, AuthState } from './core/store/auth/auth.reducer';
import * as fromStore from './core/store'
import { Router } from '@angular/router';
import * as fromRoot from './core/core.reducer';
import { Subscription } from 'rxjs/Rx';
import { SystemSettingsShareService } from './core/services';

@Component({
  selector: 'cbs-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  private systemSettingSub: Subscription;

  constructor(private store$: Store<AuthState>,
              private translate: TranslateService,
              private systemSettingsShareService: SystemSettingsShareService,
              private authStore$: Store<AuthAppState>,
              private router: Router,
              private appReadyService: AppReadyService) {
    translate.addLangs(['en', 'ru', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.store$.dispatch(new fromStore.CheckAuth());

    this.systemSettingSub = this.store$.pipe(select(fromRoot.getSystemSettingState))
      .subscribe((response: any) => {
        if ( response.systemSetting.length ) {
          const fieldsArray = [];
          const fieldData = response.systemSetting;
          fieldData.map(item => {
            const tempObj = {};
            if ( item['value'] ) {
              tempObj['value'] = item['value'];
            }

            let fieldMeta;
            if ( item['customField'] ) {
              fieldMeta = item['customField'];
            } else {
              fieldMeta = item;
            }

            for (const key in fieldMeta) {
              if ( fieldMeta.hasOwnProperty(key) ) {
                tempObj[key] = fieldMeta[key];
              }
            }

            fieldsArray.push(tempObj);
          });
          this.systemSettingsShareService.setData(fieldsArray);
        }
      });
  }

  ngAfterContentChecked() {
    this.appReadyService.trigger();

    if ( window.location.hash && window.location.hash !== '#/login'
      && window.event && window.event.type && window.event.type === 'error' ) {
      this.logout();
    }
  }

  logout() {
    this.authStore$.dispatch(new fromStore.PurgeAuth());
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.systemSettingSub.unsubscribe();
  }
}
