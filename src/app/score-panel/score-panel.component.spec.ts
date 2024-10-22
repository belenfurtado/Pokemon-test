import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScorePanelComponent } from './score-panel.component';
import { ScoreService } from '../services/score/score.service';
import { of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';

describe('ScorePanelComponent', () => {
  let component: ScorePanelComponent;
  let fixture: ComponentFixture<ScorePanelComponent>;
  let mockScoreService: any;
  let scoreStateSubject: Subject<any>;

  beforeEach(async () => {
    scoreStateSubject = new Subject();

    mockScoreService = {
      scoreState$: scoreStateSubject.asObservable(),
      increaseSkippedCount: jasmine.createSpy('increaseSkippedCount'),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ScorePanelComponent, TimerComponent],
      providers: [
        { provide: ScoreService, useValue: mockScoreService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to score state and update score details', fakeAsync(() => {
    const mockState = { currentScore: 10, maxScore: 20, skippedCount: 3, incorrectCount: 2 };
    scoreStateSubject.next(mockState);
    tick();
    fixture.detectChanges();
    expect(component.currentScore).toBe(mockState.currentScore);
    expect(component.maxScore).toBe(mockState.maxScore);
    expect(component.skippedCount).toBe(mockState.skippedCount);
    expect(component.incorrectCount).toBe(mockState.incorrectCount);
  }));

  it('should handle skip and call increaseSkippedCount', () => {
    component.handleSkip();
    expect(mockScoreService.increaseSkippedCount).toHaveBeenCalled();
  });

  it('should unsubscribe from scoreSubscription on destroy', () => {
    spyOn(component['scoreSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['scoreSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
