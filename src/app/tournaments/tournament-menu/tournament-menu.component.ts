import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tournament-menu',
  templateUrl: './tournament-menu.component.html',
  styleUrls: ['./tournament-menu.component.scss']
})
export class TournamentMenuComponent implements OnInit {
  expanded = true;

  @Input() tournamentId: string = '';

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }

  clickBracket(): void {
    this.router.navigate(['tournaments', this.tournamentId]);
  }

  clickGames(): void {
    this.router.navigate(['tournaments', this.tournamentId, 'games']);
  }

  clickParticipants(): void {
    this.router.navigate(['tournaments', this.tournamentId, 'participants']);
  }
}
