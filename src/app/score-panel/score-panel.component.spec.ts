import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScorePanelComponent } from './score-panel.component';
import { ScoreService } from '../services/score/score.service';
import { of } from 'rxjs';

describe('ScorePanelComponent', () => {
  let component: ScorePanelComponent;
  let fixture: ComponentFixture<ScorePanelComponent>;
  let mockScoreService: jasmine.SpyObj<ScoreService>;

  beforeEach(async () => {
    mockScoreService = jasmine.createSpyObj('ScoreService', ['increaseSkippedCount']);
    mockScoreService.scoreState$ = of({
      currentScore: 5,
      maxScore: 10,
      skippedCount: 2,
      incorrectCount: 1
    });

    await TestBed.configureTestingModule({
      declarations: [ScorePanelComponent],
      providers: [
        { provide: ScoreService, useValue: mockScoreService }
      ]
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

  it('should initialize score values from the service on ngOnInit', () => {
    expect(component.currentScore).toBe(5);
    expect(component.maxScore).toBe(10);
    expect(component.skippedCount).toBe(2);
    expect(component.incorrectCount).toBe(1);
  });

  it('should call increaseSkippedCount when handleSkip is called', () => {
    component.handleSkip();
    expect(mockScoreService.increaseSkippedCount).toHaveBeenCalled();
  });

  it('should unsubscribe from scoreSubscription on ngOnDestroy', () => {
    spyOn(component['scoreSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['scoreSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
