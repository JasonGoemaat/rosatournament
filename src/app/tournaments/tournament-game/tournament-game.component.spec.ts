import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentGameComponent } from './tournament-game.component';

describe('TournamentGameComponent', () => {
  let component: TournamentGameComponent;
  let fixture: ComponentFixture<TournamentGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
