import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { TimerService } from '../services/timer/timer.service';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';
import { of } from 'rxjs';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let mockTimerService: jasmine.SpyObj<TimerService>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockScoreService: jasmine.SpyObj<ScoreService>;

  beforeEach(async () => {
    mockTimerService = jasmine.createSpyObj('TimerService', ['startTimer', 'resetTimer']);
    mockTimerService.timer$ = of(60);

    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getRandomPokemon']);
    mockScoreService = jasmine.createSpyObj('ScoreService', ['increaseScore', 'increaseIncorrectCount', 'increaseSkippedCount']);

    await TestBed.configureTestingModule({
      declarations: [TimerComponent],
      providers: [
        { provide: TimerService, useValue: mockTimerService },
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: ScoreService, useValue: mockScoreService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the timer value from the service on ngOnInit', () => {
    expect(component.timer).toBe(60);
  });

  it('should start the timer on ngOnInit', () => {
    expect(mockTimerService.startTimer).toHaveBeenCalled();
  });

  it('should unsubscribe from timerSubscription on ngOnDestroy', () => {
    spyOn(component['timerSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['timerSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
