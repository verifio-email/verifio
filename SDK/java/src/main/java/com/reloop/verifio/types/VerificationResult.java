package com.reloop.verifio.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VerificationResult {
    private String id;
    private String email;
    private String user;
    private String domain;
    private String tag;
    private String state;
    private String reason;
    private int score;
    private VerificationChecks checks;
    private VerificationAnalytics analytics;
    private int duration;
    private String verifiedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public VerificationChecks getChecks() { return checks; }
    public void setChecks(VerificationChecks checks) { this.checks = checks; }
    public VerificationAnalytics getAnalytics() { return analytics; }
    public void setAnalytics(VerificationAnalytics analytics) { this.analytics = analytics; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public String getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }
}
