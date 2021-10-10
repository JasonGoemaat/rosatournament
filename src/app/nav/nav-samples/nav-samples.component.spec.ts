import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSamplesComponent } from './nav-samples.component';
import { RouterTestingModule } from "@angular/router/testing";
import { MockLocationStrategy } from '@angular/common/testing';
import { LocationStrategy } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NavSamplesComponent', () => {
  let component: NavSamplesComponent;
  let fixture: ComponentFixture<NavSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: LocationStrategy, useClass: MockLocationStrategy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ NavSamplesComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
