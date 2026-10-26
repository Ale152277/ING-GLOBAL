import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoPedido } from './pago-pedido';

describe('PagoPedido', () => {
  let component: PagoPedido;
  let fixture: ComponentFixture<PagoPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoPedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
