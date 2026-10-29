package com.typemaster.controller;

import com.typemaster.entity.TestResult;
import com.typemaster.entity.User;
import com.typemaster.service.TypingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TypingController {

    private final TypingService typingService;

    public TypingController(TypingService typingService) {
        this.typingService = typingService;
    }

    @PostMapping("/results")
    public ResponseEntity<?> submitTestResult(@RequestBody Map<String, Object> payload) {
        int wpm = ((Number) payload.getOrDefault("wpm", 0)).intValue();
        double accuracy = ((Number) payload.getOrDefault("accuracy", 100.0)).doubleValue();

        if (!typingService.isValidResult(wpm, accuracy)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Anti-cheat: Result rejected"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("wpm", wpm);
        response.put("accuracy", accuracy);
        response.put("xpEarned", (int) (wpm * (accuracy / 100.0) * 1.5));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<?> getStatsSummary() {
        return ResponseEntity.ok(Map.of(
            "averageWpm", 58,
            "topWpm", 94,
            "accuracy", 98.4,
            "testsCompleted", 34,
            "level", 4
        ));
    }
}
