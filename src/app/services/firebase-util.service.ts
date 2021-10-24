import { Injectable } from '@angular/core';
import { User } from '@firebase/auth';
import { ReplaySubject } from 'rxjs';
import { FirebaseFunctionsService } from './firebase-functions.service';

export interface AuthInfo {
  isAuthReceived: boolean;
  photoURL: string | null | undefined;
  name: string | null | undefined;
  uid: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilService {
  auth: ReplaySubject<AuthInfo>;

  constructor(public ff: FirebaseFunctionsService) {
    this.auth = new ReplaySubject<AuthInfo>(1);
    this.auth.next({ isAuthReceived: false, photoURL: undefined, name: undefined, uid: undefined });
    this.ff.getAuth().onAuthStateChanged((user: User | null) => {
      this.auth.next({ 
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
