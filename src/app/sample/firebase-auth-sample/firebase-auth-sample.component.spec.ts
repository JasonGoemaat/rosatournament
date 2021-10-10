import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';

import { FirebaseAuthSampleComponent } from './firebase-auth-sample.component';

xdescribe('NOTFirebaseAuthSampleComponent', () => {
  let component: FirebaseAuthSampleComponent;
  let fixture: ComponentFixture<FirebaseAuthSampleComponent>;
  const authSpy = jasmine.createSpyObj('Auth', ['notAMethod']);
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseAuthSampleComponent ],
      providers: [{ provide: Auth, useValue: authSpy }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseAuthSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('duh duh dum dum stupid angular testing should create', () => {
    expect(component).toBeTruthy();
  });
});
