package com.reloop.verifio.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VerifyOptions {
    private Boolean skipDisposable;
    private Boolean skipRole;
    private Boolean skipTypo;

    public Boolean getSkipDisposable() { return skipDisposable; }
    public void setSkipDisposable(Boolean skipDisposable) { this.skipDisposable = skipDisposable; }
    public Boolean getSkipRole() { return skipRole; }
    public void setSkipRole(Boolean skipRole) { this.skipRole = skipRole; }
    public Boolean getSkipTypo() { return skipTypo; }
    public void setSkipTypo(Boolean skipTypo) { this.skipTypo = skipTypo; }
}
