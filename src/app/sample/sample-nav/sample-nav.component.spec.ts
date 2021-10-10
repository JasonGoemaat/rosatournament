import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SampleNavComponent } from './sample-nav.component';

@Component({ template: '' })
class DummyComponent { }

describe('SampleNavComponent', () => {
  let component: SampleNavComponent;
  let fixture: ComponentFixture<SampleNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: '', component: DummyComponent }
       ])
      ],
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
