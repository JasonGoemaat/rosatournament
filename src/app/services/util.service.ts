import { Injectable } from '@angular/core';

const rxTime = /([0-9]+:)([0-9]+):[0-9]+( AM| PM)/

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() { }

  static formatTime(utc: number) {
    const lts = new Date(utc).toLocaleTimeString();
    const arr = lts.match(rxTime);
    return arr ? arr.slice(1).join('') : 'BAD TIME';
  }
}
