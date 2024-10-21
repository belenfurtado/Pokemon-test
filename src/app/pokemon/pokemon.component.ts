import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoreService } from '../services/score/score.service';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit, OnDestroy {
  pokemonName: string = '';
  pokemonImageUrl: string = '';
  showImage = false;
  showWrongMessage = false;
  options: string[] = [];
  showStartButton = false;
  private pokemonSubscription!: Subscription;

  constructor(private scoreService: ScoreService, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemonSubscription = this.pokemonService.pokemonState$.subscribe((data) => {
      if (data) {
        this.pokemonName = data.name;
        this.pokemonImageUrl = data.imageUrl;
        this.options = data.options;
        this.pokemonService.showImage$.subscribe((data) => {
          this.showImage = data;
        });
        console.log(this.showImage);
        this.pokemonService.showStartButton$.subscribe((data) => {
          this.showStartButton = data;
        })
      }
    });
  }

  startGame(): void {
    this.pokemonService.showStart(false);
    this.getRandomPokemon();
  }

  getRandomPokemon(): void {
    this.pokemonService.getRandomPokemon();
  }

  ngOnDestroy(): void {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
  }
}
