import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceStylesComponent } from './device-styles.component';

describe('DeviceStylesComponent', () => {
  let component: DeviceStylesComponent;
  let fixture: ComponentFixture<DeviceStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceStylesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
