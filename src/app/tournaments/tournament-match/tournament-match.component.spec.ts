import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentMatchComponent } from './tournament-match.component';

describe('TournamentMatchComponent', () => {
  let component: TournamentMatchComponent;
  let fixture: ComponentFixture<TournamentMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
