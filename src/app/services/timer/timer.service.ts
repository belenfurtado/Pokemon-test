import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: number = 60; // Duración del temporizador en segundos
  private timerSubject = new BehaviorSubject<number>(this.timer);
  timer$ = this.timerSubject.asObservable();
  private intervalId: any;

  startTimer(): void {
    // Limpiar cualquier temporizador existente antes de iniciar uno nuevo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Reiniciar el temporizador a 60 segundos
    this.timer = 60;
    this.timerSubject.next(this.timer);

    // Iniciar la cuenta regresiva
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