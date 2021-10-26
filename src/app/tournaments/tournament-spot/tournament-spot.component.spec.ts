import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSpotComponent } from './tournament-spot.component';

describe('TournamentSpotComponent', () => {
  let component: TournamentSpotComponent;
  let fixture: ComponentFixture<TournamentSpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentSpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
