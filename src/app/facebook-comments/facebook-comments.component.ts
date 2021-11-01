import { AfterContentChecked, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-facebook-comments',
  templateUrl: './facebook-comments.component.html',
  styleUrls: ['./facebook-comments.component.scss']
})
export class FacebookCommentsComponent implements OnInit, OnDestroy, AfterContentChecked {
  subscription?: Subscription;
  url$: Observable<string>;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public router: Router,
    public element: ElementRef,
  ) {
    (window as any).cFacebookComments = this;
    UtilService.colorLog('green', 'FBComments', 'CREATED');
    this.url$ = service.getForParams(route.paramMap)
    .pipe(
      map(x => x.facebookCommentsUrl),
      filter(x => x.indexOf('http') === 0),
      distinctUntilChanged(),
      tap(x => {
        setTimeout(() => (window as any).FB.XFBML.parse(), 0);
        UtilService.colorLog('green', 'FBComments', 'Re-parsed on timeout', x)
      })
    );

    // this.subscription = this.url$
    // .subscribe(url => {
    //     UtilService.colorLog('green', 'FBComments', 'Have URL!', url);
    //     const div = document.createElement('div');
    //     div.classList.add('fb-comments');
    //     div.dataset.href = url;
    //     div.dataset.width = '';
    //     div.dataset.numposts = '5';
    //     console.log('nativeElement:', element.nativeElement);
    //     element.nativeElement.innerHTML = `<h1>Url: ${url}</h1>`;
    //     element.nativeElement.appendChild(div);
    //     console.log('div:', div);
    //     (window as any).FB.XFBML.parse(div);
    // });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      delete this.subscription;
    }
  }

  ngAfterContentChecked(): void {
    //UtilService.colorLog('red', 'FBComments', 'ngAfterContentChecked()');
  }

  ngAfterContentInit(): void {
    UtilService.colorLog('red', 'FBComments', 'ngAfterContentInit()');
  }

  ngOnInit(): void {
  }
}
