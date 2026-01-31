import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazCarrito } from './interfaz-carrito';

describe('InterfazCarrito', () => {
  let component: InterfazCarrito;
  let fixture: ComponentFixture<InterfazCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterfazCarrito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfazCarrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
