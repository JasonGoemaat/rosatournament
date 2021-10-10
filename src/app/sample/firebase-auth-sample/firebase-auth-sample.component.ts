import { Component, OnInit, Optional } from '@angular/core';
import { Auth, User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, authState } from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-firebase-auth-sample',
  templateUrl: './firebase-auth-sample.component.html',
  styleUrls: ['./firebase-auth-sample.component.scss']
})
export class FirebaseAuthSampleComponent implements OnInit {
  public readonly user: Observable<User | null> = EMPTY;
  
  constructor(@Optional() public auth: Auth) {
    (window as any).cfas = this;
    console.log({ auth });
    if (auth) {
      this.user = authState(this.auth);
    }
  }

  ngOnInit(): void {
    // this causes failed test because we don't inject Auth for tests
    if (this.auth) {
      onAuthStateChanged(this.auth, user => {
        console.log('ngOnInit() looking at onAuthStateChanged:', { user });
      })
    }
  }

  signIn() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut() {
    await signOut(this.auth)
  }
}
