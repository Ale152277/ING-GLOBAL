import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstruccionesPago } from './instrucciones-pago';

describe('InstruccionesPago', () => {
  let component: InstruccionesPago;
  let fixture: ComponentFixture<InstruccionesPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstruccionesPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstruccionesPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
