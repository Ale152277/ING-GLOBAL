import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionPagos } from './revision-pagos';

describe('RevisionPagos', () => {
  let component: RevisionPagos;
  let fixture: ComponentFixture<RevisionPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionPagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionPagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
