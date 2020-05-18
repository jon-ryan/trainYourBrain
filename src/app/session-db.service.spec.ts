import { TestBed } from '@angular/core/testing';

import { SessionDBService } from './session-db.service';

describe('SessionDBService', () => {
  let service: SessionDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
