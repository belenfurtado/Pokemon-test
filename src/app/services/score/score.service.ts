import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ScoreState {
    currentScore: number;
    maxScore: number;
    skippedCount: number;
    incorrectCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    private scoreState: ScoreState = {
        currentScore: 0,
        maxScore: 0,
        skippedCount: 0,
        incorrectCount: 0
    };

    private scoreSubject = new BehaviorSubject<ScoreState>(this.scoreState);
    scoreState$ = this.scoreSubject.asObservable();

    increaseScore(): void {
        this.scoreState.currentScore++;
        if (this.scoreState.currentScore > this.scoreState.maxScore) {
            this.scoreState.maxScore = this.scoreState.currentScore;
        }
        this.updateScoreState();
    }

    increaseSkippedCount(): void {
        this.scoreState.skippedCount++;
        this.updateScoreState();
    }

    increaseIncorrectCount(): void {
        this.scoreState.incorrectCount++;
        this.updateScoreState();
    }

    resetCurrentScore(): void {
        this.scoreState.currentScore = 0;
        this.updateScoreState();
    }

    resetScore(): void {
        // Reiniciar el puntaje y los contadores
        this.scoreState = {
            currentScore: 0,
            maxScore: 0,
            incorrectCount: 0,
            skippedCount: 0
        };
        this.updateScoreState();
    }

    private updateScoreState(): void {
        this.scoreSubject.next({ ...this.scoreState });
    }
}