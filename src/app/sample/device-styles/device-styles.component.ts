import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-styles',
  templateUrl: './device-styles.component.html',
  styleUrls: ['./device-styles.component.scss']
})
export class DeviceStylesComponent implements OnInit, AfterViewInit {
  data: any;
  first = true;

  constructor() { }

  ngAfterViewInit(): void {
    if (!this.first) return;
    this.first = false;
    setTimeout(() => {
      const ele = (window as any).document.getElementById('test');
      const ele2 = (window as any).document.getElementById('test2');
      this.data = {
        'ele.clientHeight': ele.clientHeight,
        'ele.clientWidth': ele.clientWidth,
        'ele2.clientHeight': ele2.clientHeight,
        'ele2.clientWidth': ele2.clientWidth,
        'window.innerHeight': window.innerHeight,
        'window.innerWidth': window.innerWidth,
      }
    },1000);
  }

  ngOnInit(): void {
  }

}
