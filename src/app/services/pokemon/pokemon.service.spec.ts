import { TestBed } from '@angular/core/testing';
import { PokemonService } from './pokemon.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a random pokemon and update the state', () => {
    const mockResponse = {
      name: 'Pikachu',
      sprites: {
        official_artwork: 'pikachu.png',
        silhouette_artwork: 'pikachu-silhouette.png'
      },
      options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle']
    };

    service.getRandomPokemon();

    const req = httpMock.expectOne('http://localhost:8000/pokemon/random');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    service.pokemonState$.subscribe((state) => {
      expect(state.name).toBe(mockResponse.name);
      expect(state.imageUrl).toBe(mockResponse.sprites.official_artwork);
      expect(state.silhouetteUrl).toBe(mockResponse.sprites.silhouette_artwork);
      expect(state.options).toEqual(mockResponse.options);
    });
  });

  it('should handle error when getting a random pokemon', () => {
    spyOn(console, 'error');

    service.getRandomPokemon();

    const req = httpMock.expectOne('http://localhost:8000/pokemon/random');
    expect(req.request.method).toBe('GET');
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith('Error fetching random Pokémon:', jasmine.any(Object));
  });

  it('should update the showStartButton state', () => {
    service.showStart(false);
    service.showStartButton$.subscribe((value) => {
      expect(value).toBeFalse();
    });
  });

  it('should update the pokemon state', () => {
    const mockPokemon = {
      name: 'Charmander',
      imageUrl: 'charmander.png',
      silhouetteUrl: 'charmander-silhouette.png',
      options: ['Charmander', 'Pikachu', 'Bulbasaur', 'Squirtle']
    };

    service.setRandomPokemon(mockPokemon);

    service.pokemonState$.subscribe((state) => {
      expect(state).toEqual(mockPokemon);
    });
  });

  it('should update the showImage state', () => {
    service.setShowImage(true);
    service.showImage$.subscribe((value) => {
      expect(value).toBeTrue();
    });
  });
});
