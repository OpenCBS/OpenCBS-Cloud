import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../../core/core.module';
import { Store } from '@ngrx/store';

import { ProfilesListActions } from '../../../core/store/profile/profile-list/profiles-list.actions';
import { ProfileListComponent } from './profile-list.component';
import { NewProfileComponent } from '../profile-create/profile-create.component';
import { ProfileWrapComponent } from '../profile-details/profile-wrap.component';
import { ProfileInfoEditComponent } from '../profile-details/info-edit/profile-info-edit.component';
import { ProfileInfoComponent } from '../profile-details/info/profile-info.component';
import { ProfileAttachmentComponent } from '../profile-details/attachments/profile-attachment.component';
import { ProfileMakerCheckerComponent } from '../profile-details/maker-checker/profile-maker-checker.component';
import { ProfileCurrentAccountsComponent } from '../profile-details/current-accounts/profile-current-accounts.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileStateActions } from '../../../core/store/profile/profile-state/profile.actions';
import { Observable } from 'rxjs/Observable';
import { ProfilesListService } from '../../../core/store/profile/profile-list/profiles-list.service';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

class MockProfileListService {
  getProfiles() {
    return Observable.of(null);
  }
}

describe('PROFILE LIST', () => {
  describe('Component: ProfileListComponent', () => {
    let actions: ProfilesListActions;
    let store: Store<any>;
    let router: Router;
    let component: ProfileListComponent;
    let fixture: ComponentFixture<ProfileListComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          CoreModule.forRoot(),
          NglModule,
          TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useClass: FakeLoader}
          })
        ],
        declarations: [
          ProfileListComponent,
          NewProfileComponent,
          ProfileWrapComponent,
          ProfileInfoEditComponent,
          ProfileInfoComponent,
          ProfileAttachmentComponent,
          ProfileMakerCheckerComponent,
          ProfileCurrentAccountsComponent
        ],
        providers: [
          ProfilesListActions,
          ProfileStateActions,
          {
            provide: ProfilesListService,
            useClass: MockProfileListService
          }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ProfileListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      router = TestBed.get(Router);
      store = TestBed.get(Store);
      actions = TestBed.get(ProfilesListActions);
    });

    it('should have a defined component', () => {
      expect(component).toBeDefined();
    });

    it(`should dispatch the ${ProfilesListActions.LOAD_PROFILES} action on ngOnInit()`, () => {
      spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(actions.loadProfiles());
    });

    describe('search()', () => {
      it('should call search with given search term and dispatch search action', () => {
        const query = 'opencbs';
        spyOn(component, 'search');

        component.search(query);
        expect(component.search).toHaveBeenCalledWith(query);
      });

      it('should navigate route with given search query params', () => {
        const query = 'opencbs';
        const navigationExtras: NavigationExtras = {
          queryParams: {search: query || '', page: 1}
        };
        spyOn(router, 'navigate');

        component.search(query);

        expect(router.navigate).toHaveBeenCalledWith(['/profiles'], navigationExtras);
      });

      it('should navigate route with empty search query params', () => {
        const navigationExtras: NavigationExtras = {
          queryParams: {}
        };
        spyOn(router, 'navigate');

        component.search();

        expect(router.navigate).toHaveBeenCalledWith(['/profiles'], navigationExtras);
      });
    });

    describe('clearSearch()', () => {
      it('should clear search and dispatch clearSearch action', () => {
        spyOn(store, 'dispatch');
        spyOn(component, 'search');

        component.clearSearch();

        expect(component.search).toHaveBeenCalled();
      });
    });

    describe('gotoPage()', () => {
      it('should navigate route with page value and existing search term params', () => {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            search: '',
            page: 2
          }
        };
        spyOn(router, 'navigate');
        component.gotoPage(2);
        expect(router.navigate).toHaveBeenCalledWith(['/profiles'], navigationExtras);
      });
    });
  });
});



