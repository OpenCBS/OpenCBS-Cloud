import { TestBed, inject } from '@angular/core/testing';

import { LoanAppCustomFieldsService } from './loan-app-custom-fields.service';

describe('LoanAppCustomFieldsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanAppCustomFieldsService]
    });
  });

  it('should be created', inject([LoanAppCustomFieldsService], (service: LoanAppCustomFieldsService) => {
    expect(service).toBeTruthy();
  }));
});
