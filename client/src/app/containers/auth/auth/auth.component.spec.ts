import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AuthActions } from '../../../core/store/index';
import { AuthComponent } from './auth.component';

import { CoreModule } from '../../../core/core.module';
import { Observable } from 'rxjs/Observable';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

describe('AUTHENTICATION', () => {
  describe('Component: AuthComponent', () => {
    let fixture: ComponentFixture<AuthComponent>;
    let component: AuthComponent;
    let actions: AuthActions;
    let store: Store<any>;

    beforeEach(async(() => {
      const injector = TestBed.configureTestingModule({
        declarations: [AuthComponent],
        providers: [
          AuthActions
        ],
        imports: [
          RouterTestingModule,
          FormsModule,
          TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useClass: FakeLoader}
          }),
          CoreModule.forRoot(),
          StoreModule.provideStore({})
        ]
      });

      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      store = injector.get(Store);
      actions = injector.get(AuthActions);
    }));

    it('should have a defined component', () => {
      expect(component).toBeDefined();
    });

    describe('submitForm()', () => {
      it(`should dispatch the ${AuthActions.AUTHENTICATE} action`, () => {
        spyOn(store, 'dispatch');

        component.submitForm({
          value: {username: 'user', password: 'pass'},
          valid: true
        });

        expect(store.dispatch).toHaveBeenCalledWith(
          actions.login({username: 'user', password: 'pass'})
        );
      });
    });
  });
});



