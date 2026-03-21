package com.reloop.verifio.types;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VerificationAnalytics {
    private String didYouMean;
    private Integer domainAge;
    private String smtpProvider;
    private String riskLevel;
    private List<String> qualityIndicators;
    private List<String> warnings;

    // Getters and setters
    public String getDidYouMean() { return didYouMean; }
    public void setDidYouMean(String didYouMean) { this.didYouMean = didYouMean; }
    public Integer getDomainAge() { return domainAge; }
    public void setDomainAge(Integer domainAge) { this.domainAge = domainAge; }
    public String getSmtpProvider() { return smtpProvider; }
    public void setSmtpProvider(String smtpProvider) { this.smtpProvider = smtpProvider; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public List<String> getQualityIndicators() { return qualityIndicators; }
    public void setQualityIndicators(List<String> qualityIndicators) { this.qualityIndicators = qualityIndicators; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }
}
