import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPago } from './estado-pago';

describe('EstadoPago', () => {
  let component: EstadoPago;
  let fixture: ComponentFixture<EstadoPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
