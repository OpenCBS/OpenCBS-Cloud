package com.opencbs.core.exceptions;

public class SessionExpiredException extends UnauthorizedException {

    public SessionExpiredException() {
        super("session_expired", "Session expired.");
    }

}
