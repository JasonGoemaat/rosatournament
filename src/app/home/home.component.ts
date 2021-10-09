import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sliderValue = 25;

  constructor() {
    (window as any).chome = this;
  }

  ngOnInit(): void {
  }

  changeSliderValue($event: MatSliderChange) {
    console.log(`slider now: ${$event.value}`);
  }
}
