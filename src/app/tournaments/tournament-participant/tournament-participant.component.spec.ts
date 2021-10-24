import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentParticipantComponent } from './tournament-participant.component';

describe('TournamentParticipantComponent', () => {
  let component: TournamentParticipantComponent;
  let fixture: ComponentFixture<TournamentParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentParticipantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
