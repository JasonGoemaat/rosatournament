import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TimeSlot } from 'src/app/models/tournament';
import { TournamentViewModel } from 'src/app/models/tournament-view-model';
import { UtilService } from 'src/app/services/util.service';

export interface MatchTimeSlotDialogData {
  timeSlots: TimeSlot[],
  matchId: number,
  newTimeSlot: number,
  currentTimeSlot: number,
  vm: TournamentViewModel,
}

@Component({
  selector: 'app-match-time-slot-dialog',
  templateUrl: './match-time-slot-dialog.component.html',
  styleUrls: ['./match-time-slot-dialog.component.scss'],
})
export class MatchTimeSlotDialogComponent implements OnInit {
  currentTimeSlotIndex: number = 5;
  timeSlots: any[];
  currentTimeSlot: any;

  constructor(
    public dialogRef: MatDialogRef<MatchTimeSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatchTimeSlotDialogData,
  ) {
    (window as any).cDialog = this;
    this.timeSlots = data.vm.tournament.timeSlots.map((ts, index) => {
      const result = {
        ...ts,
        timeString: UtilService.formatTime(ts.utc),
        matchName: data.vm.config.matches[ts.matchId].name
      };

      if (ts.matchId === data.matchId) {
        //this.currentTimeSlotIndex = `${index}`;
        this.currentTimeSlotIndex = index;
        this.currentTimeSlot = result;
      }

      return result;
    });

    console.log('timeSlots:', this.timeSlots);
    (window as any).timeSlots = this.timeSlots;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
