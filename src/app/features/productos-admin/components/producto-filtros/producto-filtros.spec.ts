import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoFiltros } from './producto-filtros';

describe('ProductoFiltros', () => {
  let component: ProductoFiltros;
  let fixture: ComponentFixture<ProductoFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoFiltros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoFiltros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
