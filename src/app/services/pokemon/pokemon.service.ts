import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private pokemonState = {
    name: '',
    imageUrl: '',
    silhouetteUrl: '',
    options: [] as string[]
  };

  private pokemonSubject = new BehaviorSubject<any>(this.pokemonState);
  pokemonState$ = this.pokemonSubject.asObservable();

  private showImageSubject = new BehaviorSubject<boolean>(false);
  showImage$ = this.showImageSubject.asObservable();

  private showStartSubject = new BehaviorSubject<boolean>(true);
  showStartButton$ = this.showStartSubject.asObservable();

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getRandomPokemon(): void {
    this.http.get<any>(`${this.apiUrl}/pokemon/random`).subscribe((data) => {
      if (data && data.name && data.sprites && data.sprites.official_artwork) {
        const pokemonData = {
          name: data.name,
          imageUrl: data.sprites.official_artwork,
          silhouetteUrl: data.sprites.silhouette_artwork || '',
          options: data.options
        };
        this.setRandomPokemon(pokemonData);
      } else {
        console.error("Unexpected data structure", data);
      }
    }, (error) => {
      console.error('Error fetching random Pokémon:', error);
    });
  }

  showStart(value: boolean): void {
    this.showStartSubject.next(value);
  }

  setRandomPokemon(pokemon: any): void {
    this.pokemonState = pokemon;
    this.updatePokemonState();
  }

  setShowImage(value: boolean): void {
    this.showImageSubject.next(value);
  }

  resetPokemonState(): void {
    // Resetear el estado del Pokémon a sus valores iniciales
    this.pokemonState = {
      name: '',
      imageUrl: '',
      silhouetteUrl: '',
      options: []
    };
    this.updatePokemonState();
  }

  private updatePokemonState(): void {
    this.pokemonSubject.next({ ...this.pokemonState });
  }
}
