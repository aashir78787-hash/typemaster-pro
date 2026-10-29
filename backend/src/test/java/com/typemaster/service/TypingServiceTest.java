package com.typemaster.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TypingServiceTest {

    private TypingService typingService;

    @BeforeEach
    void setUp() {
        typingService = new TypingService();
    }

    @Test
    void testCalculateNetWpm() {
        // 300 correct characters in 60 seconds = 60 WPM
        assertEquals(60, typingService.calculateNetWpm(300, 60));
        // 150 correct characters in 30 seconds = 60 WPM
        assertEquals(60, typingService.calculateNetWpm(150, 30));
        // Edge: 0 seconds returns 0
        assertEquals(0, typingService.calculateNetWpm(300, 0));
    }

    @Test
    void testCalculateAccuracy() {
        assertEquals(95.0, typingService.calculateAccuracy(95, 100));
        assertEquals(100.0, typingService.calculateAccuracy(0, 0));
        assertEquals(96.0, typingService.calculateAccuracy(48, 50));
    }

    @Test
    void testAntiCheatValidation() {
        assertTrue(typingService.isValidResult(85, 98.5));
        assertTrue(typingService.isValidResult(150, 99.0));
        // Reject impossible speed
        assertFalse(typingService.isValidResult(350, 95.0));
        // Reject negative
        assertFalse(typingService.isValidResult(-5, 95.0));
        // Reject invalid accuracy
        assertFalse(typingService.isValidResult(60, 105.0));
    }

    @Test
    void testStarRatingCalculation() {
        // Target: 40 WPM, 95%
        assertEquals(0, typingService.calculateStars(20, 90.0, 40, 95.0)); // Failed
        assertEquals(1, typingService.calculateStars(35, 95.0, 40, 95.0)); // Passed minimum
        assertEquals(2, typingService.calculateStars(42, 96.0, 40, 95.0)); // Passed target
        assertEquals(3, typingService.calculateStars(55, 98.0, 40, 95.0)); // Distinction
    }
}
