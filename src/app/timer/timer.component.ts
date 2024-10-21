import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimerService } from '../services/timer/timer.service';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  timer: number = 60;
  private timerSubscription!: Subscription;

  constructor(private timerService: TimerService, private pokemonService: PokemonService, private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.timerSubscription = this.timerService.timer$.subscribe((time: number) => {
      this.timer = time;
    });
    this.timerService.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}