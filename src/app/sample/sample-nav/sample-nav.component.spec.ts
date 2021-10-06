import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleNavComponent } from './sample-nav.component';

describe('SampleNavComponent', () => {
  let component: SampleNavComponent;
  let fixture: ComponentFixture<SampleNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
