import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonComponent } from './pokemon.component';
import { ScoreService } from '../services/score/score.service';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { of } from 'rxjs';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockScoreService: jasmine.SpyObj<ScoreService>;

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getRandomPokemon', 'showStart']);
    mockScoreService = jasmine.createSpyObj('ScoreService', ['increaseScore', 'increaseIncorrectCount', 'increaseSkippedCount']);

    await TestBed.configureTestingModule({
      declarations: [PokemonComponent],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: ScoreService, useValue: mockScoreService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;

    // Set up Observables for mock services
    mockPokemonService.pokemonState$ = of({
      name: 'pikachu',
      imageUrl: 'pikachu-image-url',
      options: ['pikachu', 'bulbasaur', 'charmander', 'squirtle']
    });
    mockPokemonService.showImage$ = of(false);
    mockPokemonService.showStartButton$ = of(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pokemon details and options on ngOnInit', () => {
    expect(component.pokemonName).toBe('pikachu');
    expect(component.pokemonImageUrl).toBe('pikachu-image-url');
    expect(component.options).toEqual(['pikachu', 'bulbasaur', 'charmander', 'squirtle']);
    expect(component.showStartButton).toBeTrue();
    expect(component.showImage).toBeFalse();
  });

  it('should call showStart(false) and getRandomPokemon on startGame', () => {
    component.startGame();
    expect(mockPokemonService.showStart).toHaveBeenCalledWith(false);
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
  });

  it('should call getRandomPokemon on getRandomPokemon', () => {
    component.getRandomPokemon();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    spyOn(component['pokemonSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['pokemonSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
