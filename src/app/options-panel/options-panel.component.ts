import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';
import { Subscription } from 'rxjs';
import { TimerService } from '../services/timer/timer.service';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css']
})
export class OptionsPanelComponent implements OnInit, OnDestroy {
  options: string[] = [];
  correctAnswer: string = '';
  showImage = false;
  private pokemonSubscription!: Subscription;
  private showImageSubscription!: Subscription;

  constructor(private pokemonService: PokemonService, private scoreService: ScoreService, private timerService: TimerService) { }

  ngOnInit(): void {
    this.pokemonSubscription = this.pokemonService.pokemonState$.subscribe((pokemon) => {
      if (pokemon && pokemon.options) {
        this.options = pokemon.options;
        this.correctAnswer = pokemon.name;
      }
    });

    this.showImageSubscription = this.pokemonService.showImage$.subscribe((value: boolean) => {
      this.showImage = value;
    });
    this.timerService.timer$.subscribe((data) => {
      if (data == 0) {
        this.timerService.startTimer();
        this.scoreService.increaseIncorrectCount();
        this.pokemonService.getRandomPokemon();
      }
    });
  }

  handleAnswer(selectedOption: string): void {
    if (selectedOption === this.correctAnswer) {
      this.pokemonService.setShowImage(true);
      this.scoreService.increaseScore();
      setTimeout(() => {
        this.pokemonService.getRandomPokemon();
        this.pokemonService.setShowImage(false);
        this.timerService.resetTimer();
      }, 3000);
    } else {
      this.scoreService.increaseIncorrectCount();
      this.pokemonService.getRandomPokemon();
      this.timerService.resetTimer();

    }
  }

  handleSkip(): void {
    this.scoreService.increaseSkippedCount();
    this.pokemonService.getRandomPokemon();
    this.timerService.resetTimer();
  }

  ngOnDestroy(): void {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
    if (this.showImageSubscription) {
      this.showImageSubscription.unsubscribe();
    }
  }
}