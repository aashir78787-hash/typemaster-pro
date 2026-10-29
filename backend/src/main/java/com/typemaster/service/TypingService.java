package com.typemaster.service;

import com.typemaster.entity.TestResult;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TypingService {

    public static final int ANTI_CHEAT_MAX_WPM = 300;

    /**
     * Net WPM = (Correct Characters / 5) / (Time in Minutes)
     */
    public int calculateNetWpm(int correctChars, int timeInSeconds) {
        if (timeInSeconds <= 0) return 0;
        double minutes = timeInSeconds / 60.0;
        double words = correctChars / 5.0;
        return (int) Math.round(words / minutes);
    }

    /**
     * Accuracy percentage = (Correct Characters / Total Typed Characters) * 100
     */
    public double calculateAccuracy(int correctChars, int totalChars) {
        if (totalChars <= 0) return 100.0;
        double acc = (correctChars / (double) totalChars) * 100.0;
        return Math.round(acc * 10.0) / 10.0;
    }

    /**
     * Validates results against anti-cheat bounds
     */
    public boolean isValidResult(int wpm, double accuracy) {
        if (wpm < 0 || wpm > ANTI_CHEAT_MAX_WPM) return false;
        if (accuracy < 0.0 || accuracy > 100.0) return false;
        return true;
    }

    /**
     * Calculates star ratings: 0 (fail), 1 (pass), 2 (target), 3 (distinction)
     */
    public int calculateStars(int wpm, double accuracy, int targetWpm, double targetAcc) {
        if (accuracy < targetAcc || wpm < targetWpm * 0.7) {
            return 0;
        }
        if (wpm >= targetWpm * 1.25 && accuracy >= targetAcc + 2.0) {
            return 3;
        }
        if (wpm >= targetWpm && accuracy >= targetAcc) {
            return 2;
        }
        return 1;
    }
}
