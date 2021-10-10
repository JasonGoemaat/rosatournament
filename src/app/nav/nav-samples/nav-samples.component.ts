import { Component, OnInit } from '@angular/core';
import { faListOl, faAngleRight, faAngleUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router"

@Component({
  selector: 'app-nav-samples',
  templateUrl: './nav-samples.component.html',
  styleUrls: ['./nav-samples.component.scss']
})
export class NavSamplesComponent implements OnInit {
  faListOl = faListOl;
  faAngleUp = faAngleUp;
  faAngleRight = faAngleRight;
  faCircle = faCircle;

  isExpanded = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  navigate(paths: string[]) {
    this.router.navigate(paths);
  }
}
