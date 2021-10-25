import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTimeSlotDialogComponent } from './game-time-slot-dialog.component';

describe('GameTimeSlotDialogComponent', () => {
  let component: GameTimeSlotDialogComponent;
  let fixture: ComponentFixture<GameTimeSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameTimeSlotDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTimeSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
