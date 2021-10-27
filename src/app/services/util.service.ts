import { Injectable } from '@angular/core';

const rxTime = /([0-9]+:)([0-9]+):[0-9]+( AM| PM)/

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() {
    (window as any).sUtil = this;
  }

  static formatTime(utc: number) {
    const lts = new Date(utc).toLocaleTimeString();
    const arr = lts.match(rxTime);
    return arr ? arr.slice(1).join('') : 'BAD TIME';
  }

  /**
   * Utility function to sort array using a function to find value
   * on the element of an array.  For instance if you want to sort
   * an array of objects with a utc property (i.e. Tournament.timeSlots),
   * you would call it like this:
   * 
   * timeSlots.sort(UtilService.sortBy(x => x.utc));
   */
  static sortBy(fn: (o: any) => any): ((a: any, b: any) => number) {
    return (a: any, b: any) => {
      if (fn(a) < fn(b)) return -1;
      return 1;
    }
  }

  static getPlaceString(place?: number): string {
    const places: Record<number, string> = {
      1: '1st', 2: '2nd', 3: '3rd', 4: '4th',
      5: '5th', 6: '6th', 7: '7th', 8: '8th'
    };

    if (typeof(place) === 'number' && places[place]) {
      return `${places[place]} Place`;
    }

    return 'not placed';
  }
}
