import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPromocional } from './banner-promocional';

describe('BannerPromocional', () => {
  let component: BannerPromocional;
  let fixture: ComponentFixture<BannerPromocional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerPromocional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPromocional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
