import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseAuthTestComponent } from './firebase-auth-test.component';

describe('FirebaseAuthTestComponent', () => {
  let component: FirebaseAuthTestComponent;
  let fixture: ComponentFixture<FirebaseAuthTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseAuthTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseAuthTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
