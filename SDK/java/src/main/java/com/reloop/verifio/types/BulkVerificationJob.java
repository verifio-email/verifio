package com.reloop.verifio.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BulkVerificationJob {
    private String id;
    private String status;
    private int totalEmails;
    private int processedEmails;
    private BulkVerificationStats stats;
    private String createdAt;
    private String completedAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getTotalEmails() { return totalEmails; }
    public void setTotalEmails(int totalEmails) { this.totalEmails = totalEmails; }
    public int getProcessedEmails() { return processedEmails; }
    public void setProcessedEmails(int processedEmails) { this.processedEmails = processedEmails; }
    public BulkVerificationStats getStats() { return stats; }
    public void setStats(BulkVerificationStats stats) { this.stats = stats; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BulkVerificationStats {
        private int total;
        private int processed;
        private int deliverable;
        private int undeliverable;
        private int risky;
        private int unknown;
        private VerificationBreakdown breakdown;
        private double averageScore;
        private ScoreDistribution scoreDistribution;
        private String startedAt;
        private String completedAt;
        private int totalDuration;
        private int averageDuration;

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        public int getProcessed() { return processed; }
        public void setProcessed(int processed) { this.processed = processed; }
        public int getDeliverable() { return deliverable; }
        public void setDeliverable(int deliverable) { this.deliverable = deliverable; }
        public int getUndeliverable() { return undeliverable; }
        public void setUndeliverable(int undeliverable) { this.undeliverable = undeliverable; }
        public int getRisky() { return risky; }
        public void setRisky(int risky) { this.risky = risky; }
        public int getUnknown() { return unknown; }
        public void setUnknown(int unknown) { this.unknown = unknown; }
        public VerificationBreakdown getBreakdown() { return breakdown; }
        public void setBreakdown(VerificationBreakdown breakdown) { this.breakdown = breakdown; }
        public double getAverageScore() { return averageScore; }
        public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
        public ScoreDistribution getScoreDistribution() { return scoreDistribution; }
        public void setScoreDistribution(ScoreDistribution scoreDistribution) { this.scoreDistribution = scoreDistribution; }
        public String getStartedAt() { return startedAt; }
        public void setStartedAt(String startedAt) { this.startedAt = startedAt; }
        public String getCompletedAt() { return completedAt; }
        public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
        public int getTotalDuration() { return totalDuration; }
        public void setTotalDuration(int totalDuration) { this.totalDuration = totalDuration; }
        public int getAverageDuration() { return averageDuration; }
        public void setAverageDuration(int averageDuration) { this.averageDuration = averageDuration; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VerificationBreakdown {
        private int disposable;
        private int roleBased;
        private int freeProvider;
        private int catchAll;
        private int syntaxErrors;
        private int dnsErrors;
        private int typosDetected;

        public int getDisposable() { return disposable; }
        public void setDisposable(int disposable) { this.disposable = disposable; }
        public int getRoleBased() { return roleBased; }
        public void setRoleBased(int roleBased) { this.roleBased = roleBased; }
        public int getFreeProvider() { return freeProvider; }
        public void setFreeProvider(int freeProvider) { this.freeProvider = freeProvider; }
        public int getCatchAll() { return catchAll; }
        public void setCatchAll(int catchAll) { this.catchAll = catchAll; }
        public int getSyntaxErrors() { return syntaxErrors; }
        public void setSyntaxErrors(int syntaxErrors) { this.syntaxErrors = syntaxErrors; }
        public int getDnsErrors() { return dnsErrors; }
        public void setDnsErrors(int dnsErrors) { this.dnsErrors = dnsErrors; }
        public int getTyposDetected() { return typosDetected; }
        public void setTyposDetected(int typosDetected) { this.typosDetected = typosDetected; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ScoreDistribution {
        private int excellent;
        private int good;
        private int fair;
        private int poor;

        public int getExcellent() { return excellent; }
        public void setExcellent(int excellent) { this.excellent = excellent; }
        public int getGood() { return good; }
        public void setGood(int good) { this.good = good; }
        public int getFair() { return fair; }
        public void setFair(int fair) { this.fair = fair; }
        public int getPoor() { return poor; }
        public void setPoor(int poor) { this.poor = poor; }
    }
}
