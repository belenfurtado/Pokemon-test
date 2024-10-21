import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsPanelComponent } from './options-panel.component';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';
import { TimerService } from '../services/timer/timer.service';
import { of } from 'rxjs';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockScoreService: jasmine.SpyObj<ScoreService>;
  let mockTimerService: jasmine.SpyObj<TimerService>;

  beforeEach(async () => {
    // Create mock services
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getRandomPokemon', 'setShowImage']);
    mockScoreService = jasmine.createSpyObj('ScoreService', ['increaseScore', 'increaseIncorrectCount', 'increaseSkippedCount']);
    mockTimerService = jasmine.createSpyObj('TimerService', ['startTimer', 'resetTimer']);

    await TestBed.configureTestingModule({
      declarations: [OptionsPanelComponent],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: ScoreService, useValue: mockScoreService },
        { provide: TimerService, useValue: mockTimerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsPanelComponent);
    component = fixture.componentInstance;

    // Set up Observables for mock services
    mockPokemonService.pokemonState$ = of({
      name: 'pikachu',
      options: ['pikachu', 'bulbasaur', 'charmander', 'squirtle'],
    });
    mockPokemonService.showImage$ = of(false);
    mockTimerService.timer$ = of(60);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize options and correct answer on ngOnInit', () => {
    expect(component.options).toEqual(['pikachu', 'bulbasaur', 'charmander', 'squirtle']);
    expect(component.correctAnswer).toBe('pikachu');
  });

  it('should call setShowImage and increaseScore when handleAnswer is called with the correct answer', () => {
    component.handleAnswer('pikachu');
    expect(mockPokemonService.setShowImage).toHaveBeenCalledWith(true);
    expect(mockScoreService.increaseScore).toHaveBeenCalled();
  });

  it('should call increaseIncorrectCount and getRandomPokemon when handleAnswer is called with an incorrect answer', () => {
    component.handleAnswer('bulbasaur');
    expect(mockScoreService.increaseIncorrectCount).toHaveBeenCalled();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(mockTimerService.resetTimer).toHaveBeenCalled();
  });

  it('should call increaseSkippedCount, getRandomPokemon, and resetTimer on handleSkip', () => {
    component.handleSkip();
    expect(mockScoreService.increaseSkippedCount).toHaveBeenCalled();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(mockTimerService.resetTimer).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    spyOn(component['pokemonSubscription'], 'unsubscribe');
    spyOn(component['showImageSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['pokemonSubscription'].unsubscribe).toHaveBeenCalled();
    expect(component['showImageSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
