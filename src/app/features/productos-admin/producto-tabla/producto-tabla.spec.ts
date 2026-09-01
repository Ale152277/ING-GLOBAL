import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoTabla } from './producto-tabla';

describe('ProductoTabla', () => {
  let component: ProductoTabla;
  let fixture: ComponentFixture<ProductoTabla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoTabla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoTabla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
