import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TimeSlot } from 'src/app/models/tournament';
import { TournamentViewModel } from 'src/app/models/tournament-view-model';
import { UtilService } from 'src/app/services/util.service';

export interface GameTimeSlotDialogData {
  timeSlots: TimeSlot[],
  gameId: number,
  newTimeSlot: number,
  currentTimeSlot: number,
  vm: TournamentViewModel,
}

@Component({
  selector: 'app-game-time-slot-dialog',
  templateUrl: './game-time-slot-dialog.component.html',
  styleUrls: ['./game-time-slot-dialog.component.scss'],
})
export class GameTimeSlotDialogComponent implements OnInit {
  currentTimeSlotIndex: number = 5;
  timeSlots: any[];
  currentTimeSlot: any;

  constructor(
    public dialogRef: MatDialogRef<GameTimeSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameTimeSlotDialogData,
  ) {
    (window as any).cDialog = this;
    this.timeSlots = data.vm.tournament.timeSlots.map((ts, index) => {
      const result = {
        ...ts,
        timeString: UtilService.formatTime(ts.utc),
        gameName: data.vm.config.games[ts.gameId].name
      };

      if (ts.gameId === data.gameId) {
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
