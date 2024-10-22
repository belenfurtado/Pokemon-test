import { TestBed } from '@angular/core/testing';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
    let service: ScoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ScoreService]
        });
        service = TestBed.inject(ScoreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should increase the score and update max score if needed', () => {
        let currentScore: number;
        let maxScore: number;

        service.scoreState$.subscribe((state) => {
            currentScore = state.currentScore;
            maxScore = state.maxScore;
        });

        service.increaseScore();
        expect(currentScore!).toBe(1);
        expect(maxScore!).toBe(1);

        service.increaseScore();
        expect(currentScore!).toBe(2);
        expect(maxScore!).toBe(2);
    });

    it('should increase the skipped count', () => {
        let skippedCount: number;

        service.scoreState$.subscribe((state) => {
            skippedCount = state.skippedCount;
        });

        service.increaseSkippedCount();
        expect(skippedCount!).toBe(1);
    });

    it('should increase the incorrect count', () => {
        let incorrectCount: number;

        service.scoreState$.subscribe((state) => {
            incorrectCount = state.incorrectCount;
        });

        service.increaseIncorrectCount();
        expect(incorrectCount!).toBe(1);
    });

    it('should reset the current score', () => {
        let currentScore: number;

        service.scoreState$.subscribe((state) => {
            currentScore = state.currentScore;
        });

        service.increaseScore();
        service.resetCurrentScore();
        expect(currentScore!).toBe(0);
    });
});
