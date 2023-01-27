import { TestBed, inject } from '@angular/core/testing';
import { BondRollbackService } from './bond-rollback.service';

describe('BondRollbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BondRollbackService]
    });
  });

  it('should be created', inject([BondRollbackService], (service: BondRollbackService) => {
    expect(service).toBeTruthy();
  }));
});
