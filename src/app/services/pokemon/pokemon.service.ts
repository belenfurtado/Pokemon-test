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

  // Obtener un Pokémon aleatorio del backend
  getRandomPokemon(): void {
    this.http.get<any>(`${this.apiUrl}/pokemon/random`).subscribe((data) => {
      if (data && data.name && data.sprites && data.sprites.official_artwork) {
        const pokemonData = {
          name: data.name,
          imageUrl: data.sprites.official_artwork,
          silhouetteUrl: data.sprites.silhouette_artwork || '', // Si no existe la silueta, asigna una cadena vacía
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

  // Mostrar u ocultar el botón de inicio
  showStart(value: boolean): void {
    this.showStartSubject.next(value);
  }

  // Actualizar el estado del Pokémon con un nuevo Pokémon
  setRandomPokemon(pokemon: any): void {
    this.pokemonState = pokemon;
    this.updatePokemonState();
  }

  // Mostrar u ocultar la imagen del Pokémon
  setShowImage(value: boolean): void {
    this.showImageSubject.next(value);
  }

  // Actualizar el estado del Pokémon (notificar a los suscriptores)
  private updatePokemonState(): void {
    this.pokemonSubject.next({ ...this.pokemonState });
  }

  // Verificar si el Pokémon adivinado es correcto (post request al backend)
  verifyPokemon(pokemonId: number, guessedName: string): any {
    return this.http.post<any>(`${this.apiUrl}/pokemon/verify`, {
      pokemon_id: pokemonId,
      guessed_name: guessedName
    });
  }
}
