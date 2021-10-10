import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSamplesComponent } from './nav-samples.component';
import { RouterTestingModule } from "@angular/router/testing";

describe('NavSamplesComponent', () => {
  let component: NavSamplesComponent;
  let fixture: ComponentFixture<NavSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
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
