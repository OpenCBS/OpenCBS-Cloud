import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { OperationDayComponent } from './operation-day.component';
import { CoreModule } from '../../../core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NglModule } from 'ngx-lightning';
import { Observable } from 'rxjs/Observable';
import { OperationDayService } from '../shared/operation-day.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

class MockOperationDayService {
  checkStatus() {
    return Observable.of('not_started');
  }

  initStatusCheck() {
    return Observable.of([]);
  }

  startEndOfDay() {
    return Observable.of(null)
  }
}

describe('OperationDayComponent', () => {
  let component: OperationDayComponent;
  let fixture: ComponentFixture<OperationDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule.forRoot(),
        NglModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader}
        })
      ],
      declarations: [OperationDayComponent],
      providers: [
        ToastrService,
        {
          provide: OperationDayService,
          useClass: MockOperationDayService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
