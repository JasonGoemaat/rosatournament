import { Component, OnInit } from '@angular/core';
import { Auth, User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-firebase-auth-sample',
  templateUrl: './firebase-auth-sample.component.html',
  styleUrls: ['./firebase-auth-sample.component.scss']
})
export class FirebaseAuthSampleComponent implements OnInit {
  public user: User | null = null;
  
  constructor(public auth: Auth) {
    (window as any).cfas = this;
    console.log({ auth });
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, user => {
      console.log({ user });
      this.user = user;
    })
  }

  signIn() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut() {
    await signOut(this.auth)
  }
}
