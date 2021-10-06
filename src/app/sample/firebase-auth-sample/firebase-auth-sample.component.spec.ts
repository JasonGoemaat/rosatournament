import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseAuthSampleComponent } from './firebase-auth-sample.component';

describe('FirebaseAuthSampleComponent', () => {
  let component: FirebaseAuthSampleComponent;
  let fixture: ComponentFixture<FirebaseAuthSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseAuthSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseAuthSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
