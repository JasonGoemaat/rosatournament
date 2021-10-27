import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentParticipantBracketComponent } from './tournament-participant-bracket.component';

describe('TournamentParticipantBracketComponent', () => {
  let component: TournamentParticipantBracketComponent;
  let fixture: ComponentFixture<TournamentParticipantBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentParticipantBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentParticipantBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
