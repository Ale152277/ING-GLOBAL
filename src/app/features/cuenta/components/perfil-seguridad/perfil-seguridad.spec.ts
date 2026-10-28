import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilSeguridad } from './perfil-seguridad';

describe('PerfilSeguridad', () => {
  let component: PerfilSeguridad;
  let fixture: ComponentFixture<PerfilSeguridad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilSeguridad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilSeguridad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
