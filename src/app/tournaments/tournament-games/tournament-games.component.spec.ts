import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentGamesComponent } from './tournament-games.component';

describe('TournamentGamesComponent', () => {
  let component: TournamentGamesComponent;
  let fixture: ComponentFixture<TournamentGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
