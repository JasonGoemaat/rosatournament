import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTimeSlotDialogComponent } from './match-time-slot-dialog.component';

describe('MatchTimeSlotDialogComponent', () => {
  let component: MatchTimeSlotDialogComponent;
  let fixture: ComponentFixture<MatchTimeSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchTimeSlotDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTimeSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
