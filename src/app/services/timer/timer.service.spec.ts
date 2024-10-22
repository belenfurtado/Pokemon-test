import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
    service = TestBed.inject(TimerService);
  });

  afterEach(() => {
    service.stopTimer();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start the timer and count down from 60 to 0', fakeAsync(() => {
    service.startTimer();
    tick();

    let time: number;
    service.timer$.subscribe((t) => (time = t));

    tick(1000);
    expect(time!).toBe(59);

    tick(59000);
    expect(time!).toBe(0);
  }));

  it('should stop the timer', fakeAsync(() => {
    service.startTimer();
    tick(30000);
    service.stopTimer();
    const currentTimerValue = service['timer'];
    tick(10000);
    expect(service['timer']).toBe(currentTimerValue);
  }));

  it('should reset the timer', fakeAsync(() => {
    service.startTimer();
    tick(30000);
    service.resetTimer();
    tick();

    let time: number;
    service.timer$.subscribe((t) => (time = t));
    tick(1000);
    expect(time!).toBe(59);

    service.stopTimer();
  }));
});
