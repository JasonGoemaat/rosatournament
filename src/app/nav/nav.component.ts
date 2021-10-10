import { Component, OnInit, Optional } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public readonly user: Observable<User | null> = EMPTY;
  private readonly userDisposable: Subscription | undefined;
  private showSignIn: boolean = false;
  private showSignOut: boolean = false;
  public displayDropDown: boolean = false;

  toggleDropDown() {
    this.displayDropDown = !this.displayDropDown;
  }

  constructor(@Optional() public auth: Auth) {
    // https://github.com/angular/angularfire/blob/master/samples/modular/src/app/auth/auth.component.ts
    (window as any).cnav = this;
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isSignedIn => {
        this.showSignIn = !isSignedIn;
        this.showSignOut = isSignedIn;
      })
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  async signIn() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider);
  }

  getPhotoUrl(user: User) {
    if (user && user.providerData && user.providerData) {
      return (user.providerData as any).photoURL;
    }
  }

  onSignOut() {
    signOut(this.auth);
  }
}
