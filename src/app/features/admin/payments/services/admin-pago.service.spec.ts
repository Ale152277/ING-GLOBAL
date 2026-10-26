import { TestBed } from '@angular/core/testing';

import { AdminPagoService } from './admin-pago.service';

describe('AdminPagoService', () => {
  let service: AdminPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
