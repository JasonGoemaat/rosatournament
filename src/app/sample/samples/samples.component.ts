import { Component, OnInit } from '@angular/core';

import * as RSET from '../../models/reset';

(window as any)['RSET'] = RSET;

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
