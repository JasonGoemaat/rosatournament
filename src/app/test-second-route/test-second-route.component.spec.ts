import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSecondRouteComponent } from './test-second-route.component';

describe('TestSecondRouteComponent', () => {
  let component: TestSecondRouteComponent;
  let fixture: ComponentFixture<TestSecondRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSecondRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSecondRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
