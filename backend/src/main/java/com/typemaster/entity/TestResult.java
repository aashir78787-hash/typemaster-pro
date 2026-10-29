package com.typemaster.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
public class TestResult {
    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private int wpm;

    @Column(name = "gross_wpm")
    private int grossWpm;

    private double accuracy;
    private int cpm;

    @Column(name = "time_sec")
    private int timeSec;

    private String mode;

    @Column(name = "text_title")
    private String textTitle;

    private int errors;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public TestResult() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }
    public int getGrossWpm() { return grossWpm; }
    public void setGrossWpm(int grossWpm) { this.grossWpm = grossWpm; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
    public int getCpm() { return cpm; }
    public void setCpm(int cpm) { this.cpm = cpm; }
    public int getTimeSec() { return timeSec; }
    public void setTimeSec(int timeSec) { this.timeSec = timeSec; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getTextTitle() { return textTitle; }
    public void setTextTitle(String textTitle) { this.textTitle = textTitle; }
    public int getErrors() { return errors; }
    public void setErrors(int errors) { this.errors = errors; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
