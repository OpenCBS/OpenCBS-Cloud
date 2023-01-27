import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfigurationComponent } from './configuration.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

describe('CONFIGURATION', () => {
  describe('Component: ConfigurationComponent', () => {
    let fixture: ComponentFixture<ConfigurationComponent>;
    let component: ConfigurationComponent;

    beforeEach(() => {
      const injector = TestBed.configureTestingModule({
        declarations: [
          ConfigurationComponent,
        ],
        providers: [],
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useClass: FakeLoader}
          })
        ]
      });

      fixture = TestBed.createComponent(ConfigurationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have a defined component', () => {
      expect(component).toBeDefined();
    });

  });
});



