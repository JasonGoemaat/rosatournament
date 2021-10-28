import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { tournamentReset } from 'src/app/models/reset';
import { AuthService } from 'src/app/services/auth.service';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournament-admin',
  templateUrl: './tournament-admin.component.html',
  styleUrls: ['./tournament-admin.component.scss']
})
export class TournamentAdminComponent implements OnInit {
  data$: Observable<MyRouteData>
  
  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public authService: AuthService,
    public router: Router,
    ) {
    (window as any).cAdmin = this;
    this.data$ = this.service.getForParams(this.route.paramMap)
    .pipe(tap(x => {
      console.log('getForParams returned:', x);
      (window as any).x = x;
    }));
  }

  ngOnInit(): void {
  }

  resetTournament(tournamentId: string): void {
    if (!confirm(`ARE YOU ABSOLUTELY SURE?\r\nThis will reset tournament "${tournamentId}"!`)) {
      return;
    }

    if (tournamentId === 'mine') {
      const answer = prompt(`Type "DELETE " and the id of the tournament and an exclamation mark to delete it.  This is required because you are trying to delete Jack's tournament!`);
      if (answer !== 'DELETE mine!') {
        alert('Whew!  You entered it wrong.  That was a close one you silly goose!');
        return;
      }
    }

    const change = {...tournamentReset};
    if (tournamentId !== 'mine') {
      change.name = `${tournamentId}: ${change.name}`;
      (change.roles as any)['tehcICyDNNaDzDT2Jzv3OVeIm9v2'] = 'admin';
    }

    this.service.setTournament(tournamentId, change).then(x => console.log('RESET!', x)).catch((err: any) => console.error(err));
  }

  copyToClipboard(object: any) {
    navigator.clipboard.writeText(JSON.stringify(object));
  }

  routeToTournament(id: string) {
    this.router.navigate(['tournaments', id]);
  }
}
