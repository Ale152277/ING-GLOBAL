import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPago } from './resumen-pago';

describe('ResumenPago', () => {
  let component: ResumenPago;
  let fixture: ComponentFixture<ResumenPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
