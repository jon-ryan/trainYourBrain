import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionDBService {

  // session variables
  totalSession: number = 0;
  correctSession: number = 0;

  constructor() { }

  public getTotalSession() {
    return this.totalSession;
  }

  public getCorrectSession() {
    return this.correctSession;
  }

  public setTotalSession(count: number) {
    this.totalSession = count;
  }

  public incrementTotalSession() {
    this.totalSession++;
  }

  public setCorrectSession(count: number) {
    this.correctSession = count;
  }

  public incrementCorrectSession() {
    this.correctSession++;
  }
}
