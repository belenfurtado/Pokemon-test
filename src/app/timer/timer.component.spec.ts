import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { TimerService } from '../services/timer/timer.service';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { ScoreService } from '../services/score/score.service';
import { of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let mockTimerService: any;
  let mockPokemonService: any;
  let mockScoreService: any;
  let timerSubject: Subject<number>;

  beforeEach(async () => {
    timerSubject = new Subject();

    mockTimerService = {
      timer$: timerSubject.asObservable(),
      startTimer: jasmine.createSpy('startTimer'),
    };

    mockPokemonService = {};
    mockScoreService = {};

    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [TimerComponent],
      providers: [
        { provide: TimerService, useValue: mockTimerService },
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: ScoreService, useValue: mockScoreService },
      ],
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

  it('should subscribe to timer and update timer value', fakeAsync(() => {
    timerSubject.next(45);
    tick();
    fixture.detectChanges();
    expect(component.timer).toBe(45);
  }));

  it('should start the timer on init', () => {
    expect(mockTimerService.startTimer).toHaveBeenCalled();
  });

  it('should unsubscribe from timerSubscription on destroy', () => {
    spyOn(component['timerSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['timerSubscription'].unsubscribe).toHaveBeenCalled();
  });
});

