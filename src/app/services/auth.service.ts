import { Injectable } from '@angular/core';
import { User } from '@firebase/auth';
import { ReplaySubject } from 'rxjs';
import { FirebaseFunctionsService } from './firebase-functions.service';
import { AuthInfo, FirebaseUtilService } from './firebase-util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth$: ReplaySubject<AuthInfo>;

  constructor(public ff: FirebaseFunctionsService) {
    (window as any).sAuth = this;
    this.auth$ = new ReplaySubject<AuthInfo>(1);
    this.auth$.next({ isAuthReceived: false, photoURL: undefined, name: undefined, uid: undefined });
    this.ff.getAuth().onAuthStateChanged((user: User | null) => {
      this.auth$.next({ 
        isAuthReceived: true,
        photoURL: user === null ? undefined : user.photoURL,
        name: user === null ? undefined : user.displayName,
        uid: user === null ? undefined : user.uid
      });
    })
  }

  signIn() {
    const provider = new this.ff.GoogleAuthProvider();
    this.ff.signInWithPopup(this.ff.getAuth(), provider)
  }

  signOut() {
    this.ff.getAuth().signOut();
  }
}
