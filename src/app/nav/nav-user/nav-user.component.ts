import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@firebase/auth';
import { faAngleUp, faAngleRight, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.scss']
})
export class NavUserComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() signOut = new EventEmitter<boolean>();

  // Font Awesome Icons
  faAngleUp = faAngleUp;
  faAngleRight = faAngleRight;
  faSignOutAlt = faSignOutAlt;

  public isExpanded: boolean = false;


  constructor() {
    (window as any).cnavuser = this;
  }

  ngOnInit(): void {
  }

  get photoURL(): string | null {
    if (this.user && this.user.providerData && this.user.providerData[0]) {
      return this.user.providerData[0].photoURL;
    }
    return null;
  }

  toggleExpanded() {
    console.log('toggleExpanded()!', this.isExpanded);
    this.isExpanded = !this.isExpanded;
  }
}
