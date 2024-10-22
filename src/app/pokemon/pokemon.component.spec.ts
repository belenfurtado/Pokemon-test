import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PokemonComponent } from './pokemon.component';
import { ScoreService } from '../services/score/score.service';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;
  let mockPokemonService: any;
  let mockScoreService: any;
  let pokemonStateSubject: Subject<any>;
  let showImageSubject: Subject<boolean>;
  let showStartButtonSubject: Subject<boolean>;

  beforeEach(async () => {
    pokemonStateSubject = new Subject();
    showImageSubject = new Subject();
    showStartButtonSubject = new Subject();

    mockPokemonService = {
      pokemonState$: pokemonStateSubject.asObservable(),
      showImage$: showImageSubject.asObservable(),
      showStartButton$: showStartButtonSubject.asObservable(),
      getRandomPokemon: jasmine.createSpy('getRandomPokemon'),
      showStart: jasmine.createSpy('showStart'),
    };

    mockScoreService = {
      increaseScore: jasmine.createSpy('increaseScore'),
      increaseIncorrectCount: jasmine.createSpy('increaseIncorrectCount'),
      increaseSkippedCount: jasmine.createSpy('increaseSkippedCount'),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to pokemon state and update pokemon details', fakeAsync(() => {
    const mockPokemon = { name: 'Pikachu', imageUrl: 'pikachu.png', options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'] };
    pokemonStateSubject.next(mockPokemon);
    tick();
    fixture.detectChanges();
    expect(component.pokemonName).toBe(mockPokemon.name);
    expect(component.pokemonImageUrl).toBe(mockPokemon.imageUrl);
    expect(component.options).toEqual(mockPokemon.options);
  }));

  // it('should subscribe to showStartButton and update showStartButton', fakeAsync(() => {
  //   showStartButtonSubject.next(true);
  //   tick();
  //   fixture.detectChanges();
  //   expect(component.showStartButton).toBeTrue();
  // }));

  // it('should subscribe to showImage and update showImage', fakeAsync(() => {
  //   showImageSubject.next(true);
  //   tick();
  //   fixture.detectChanges();
  //   expect(component.showImage).toBeTrue();
  // }));

  it('should start game by hiding start button and getting a random pokemon', () => {
    component.startGame();
    expect(mockPokemonService.showStart).toHaveBeenCalledWith(false);
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
  });

  it('should get a random pokemon', () => {
    component.getRandomPokemon();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    spyOn(component['pokemonSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['pokemonSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
