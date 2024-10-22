import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: number = 60;
  private timerSubject = new BehaviorSubject<number>(this.timer);
  timer$ = this.timerSubject.asObservable();
  private intervalId: any;

  startTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.timer = 60;
    this.timerSubject.next(this.timer);

    this.intervalId = setInterval(() => {
      this.timer--;
      this.timerSubject.next(this.timer);
      if (this.timer === 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }
}