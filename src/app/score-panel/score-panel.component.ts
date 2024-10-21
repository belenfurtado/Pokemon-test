import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoreService } from '../services/score/score.service';
import { TimerService } from '../services/timer/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-score-panel',
  templateUrl: './score-panel.component.html',
  styleUrls: ['./score-panel.component.css']
})
export class ScorePanelComponent implements OnInit, OnDestroy {
  currentScore: number = 0;
  maxScore: number = 0;
  skippedCount: number = 0;
  incorrectCount: number = 0;
  private scoreSubscription!: Subscription;

  constructor(private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.scoreSubscription = this.scoreService.scoreState$.subscribe((state: any) => {
      this.currentScore = state.currentScore;
      this.maxScore = state.maxScore;
      this.skippedCount = state.skippedCount;
      this.incorrectCount = state.incorrectCount;
    });
  }

  handleSkip(): void {
    this.scoreService.increaseSkippedCount();
  }

  ngOnDestroy(): void {
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }
  }
}