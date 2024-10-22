import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OptionsPanelComponent } from './options-panel.component';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';
import { TimerService } from '../services/timer/timer.service';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;
  let mockPokemonService: any;
  let mockScoreService: any;
  let mockTimerService: any;
  let pokemonStateSubject: Subject<any>;
  let showImageSubject: Subject<boolean>;
  let timerSubject: Subject<number>;

  beforeEach(async () => {
    pokemonStateSubject = new Subject();
    showImageSubject = new Subject();
    timerSubject = new Subject();

    mockPokemonService = {
      pokemonState$: pokemonStateSubject.asObservable(),
      showImage$: showImageSubject.asObservable(),
      getRandomPokemon: jasmine.createSpy('getRandomPokemon'),
      setShowImage: jasmine.createSpy('setShowImage'),
    };

    mockScoreService = {
      increaseScore: jasmine.createSpy('increaseScore'),
      increaseIncorrectCount: jasmine.createSpy('increaseIncorrectCount'),
      increaseSkippedCount: jasmine.createSpy('increaseSkippedCount'),
    };

    mockTimerService = {
      timer$: timerSubject.asObservable(),
      startTimer: jasmine.createSpy('startTimer'),
      resetTimer: jasmine.createSpy('resetTimer'),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to pokemon state and update options and correct answer', fakeAsync(() => {
    const mockPokemon = { name: 'Pikachu', options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'] };
    pokemonStateSubject.next(mockPokemon);
    tick();
    fixture.detectChanges();
    expect(component.options).toEqual(mockPokemon.options);
    expect(component.correctAnswer).toBe(mockPokemon.name);
  }));

  it('should subscribe to showImage and update showImage', fakeAsync(() => {
    showImageSubject.next(true);
    tick();
    fixture.detectChanges();
    expect(component.showImage).toBeTrue();
  }));

  it('should handle timer reaching zero by starting timer, increasing incorrect count, and getting a new pokemon', fakeAsync(() => {
    timerSubject.next(0);
    tick();
    expect(mockTimerService.startTimer).toHaveBeenCalled();
    expect(mockScoreService.increaseIncorrectCount).toHaveBeenCalled();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
  }));

  it('should handle correct answer selection', fakeAsync(() => {
    component.correctAnswer = 'Pikachu';
    component.handleAnswer('Pikachu');
    expect(mockPokemonService.setShowImage).toHaveBeenCalledWith(true);
    expect(mockScoreService.increaseScore).toHaveBeenCalled();
    tick(3000);
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(mockPokemonService.setShowImage).toHaveBeenCalledWith(false);
    expect(mockTimerService.resetTimer).toHaveBeenCalled();
  }));

  it('should handle incorrect answer selection', () => {
    component.correctAnswer = 'Pikachu';
    component.handleAnswer('Bulbasaur');
    expect(mockScoreService.increaseIncorrectCount).toHaveBeenCalled();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(mockTimerService.resetTimer).toHaveBeenCalled();
  });

  it('should handle skip', () => {
    component.handleSkip();
    expect(mockScoreService.increaseSkippedCount).toHaveBeenCalled();
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(mockTimerService.resetTimer).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    spyOn(component['pokemonSubscription'], 'unsubscribe');
    spyOn(component['showImageSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['pokemonSubscription'].unsubscribe).toHaveBeenCalled();
    expect(component['showImageSubscription'].unsubscribe).toHaveBeenCalled();
  });
});