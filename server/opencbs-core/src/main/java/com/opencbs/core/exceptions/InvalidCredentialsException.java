package com.opencbs.core.exceptions;

public class InvalidCredentialsException extends UnauthorizedException {

    public InvalidCredentialsException() {
        super("invalid_credentials", "Invalid username or password.");
    }

}
