import { Component } from '@angular/core';
import { PokemonService } from './services/pokemon/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pokemon-test';
  gameStart = true;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.pokemonService.showStartButton$.subscribe((data) => {
      this.gameStart = !data;
    });
  }
}
