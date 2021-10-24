import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentMenuComponent } from './tournament-menu.component';

describe('TournamentMenuComponent', () => {
  let component: TournamentMenuComponent;
  let fixture: ComponentFixture<TournamentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
