package com.reloop.verifio.types;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VerificationChecks {
    private SyntaxCheckResult syntax;
    private DnsCheckResult dns;
    private DisposableCheckResult disposable;
    private RoleCheckResult role;
    private FreeProviderCheckResult freeProvider;
    private TypoCheckResult typo;
    private SmtpCheckResult smtp;

    // Getters and setters
    public SyntaxCheckResult getSyntax() { return syntax; }
    public void setSyntax(SyntaxCheckResult syntax) { this.syntax = syntax; }
    public DnsCheckResult getDns() { return dns; }
    public void setDns(DnsCheckResult dns) { this.dns = dns; }
    public DisposableCheckResult getDisposable() { return disposable; }
    public void setDisposable(DisposableCheckResult disposable) { this.disposable = disposable; }
    public RoleCheckResult getRole() { return role; }
    public void setRole(RoleCheckResult role) { this.role = role; }
    public FreeProviderCheckResult getFreeProvider() { return freeProvider; }
    public void setFreeProvider(FreeProviderCheckResult freeProvider) { this.freeProvider = freeProvider; }
    public TypoCheckResult getTypo() { return typo; }
    public void setTypo(TypoCheckResult typo) { this.typo = typo; }
    public SmtpCheckResult getSmtp() { return smtp; }
    public void setSmtp(SmtpCheckResult smtp) { this.smtp = smtp; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SyntaxCheckResult {
        private boolean valid;
        private String error;
        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DnsCheckResult {
        private boolean valid;
        private boolean domainExists;
        private boolean hasMx;
        private List<String> mxRecords;
        private String preferredMx;
        private String error;
        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }
        public boolean isDomainExists() { return domainExists; }
        public void setDomainExists(boolean domainExists) { this.domainExists = domainExists; }
        public boolean isHasMx() { return hasMx; }
        public void setHasMx(boolean hasMx) { this.hasMx = hasMx; }
        public List<String> getMxRecords() { return mxRecords; }
        public void setMxRecords(List<String> mxRecords) { this.mxRecords = mxRecords; }
        public String getPreferredMx() { return preferredMx; }
        public void setPreferredMx(String preferredMx) { this.preferredMx = preferredMx; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DisposableCheckResult {
        private boolean isDisposable;
        private String provider;
        public boolean isDisposable() { return isDisposable; }
        public void setDisposable(boolean isDisposable) { this.isDisposable = isDisposable; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RoleCheckResult {
        private boolean isRole;
        private String role;
        public boolean isRole() { return isRole; }
        public void setRole(boolean isRole) { this.isRole = isRole; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FreeProviderCheckResult {
        private boolean isFree;
        private String provider;
        public boolean isFree() { return isFree; }
        public void setFree(boolean isFree) { this.isFree = isFree; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TypoCheckResult {
        private boolean hasTypo;
        private String suggestion;
        private String originalDomain;
        private String suggestedDomain;
        public boolean isHasTypo() { return hasTypo; }
        public void setHasTypo(boolean hasTypo) { this.hasTypo = hasTypo; }
        public String getSuggestion() { return suggestion; }
        public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
        public String getOriginalDomain() { return originalDomain; }
        public void setOriginalDomain(String originalDomain) { this.originalDomain = originalDomain; }
        public String getSuggestedDomain() { return suggestedDomain; }
        public void setSuggestedDomain(String suggestedDomain) { this.suggestedDomain = suggestedDomain; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SmtpCheckResult {
        private Boolean valid;
        private Boolean mailboxExists;
        private Boolean isCatchAll;
        private String response;
        private String error;
        public Boolean getValid() { return valid; }
        public void setValid(Boolean valid) { this.valid = valid; }
        public Boolean getMailboxExists() { return mailboxExists; }
        public void setMailboxExists(Boolean mailboxExists) { this.mailboxExists = mailboxExists; }
        public Boolean getIsCatchAll() { return isCatchAll; }
        public void setIsCatchAll(Boolean isCatchAll) { this.isCatchAll = isCatchAll; }
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}
