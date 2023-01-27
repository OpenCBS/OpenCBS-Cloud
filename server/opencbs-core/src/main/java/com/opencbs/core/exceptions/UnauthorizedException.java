package com.opencbs.core.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Created by Makhsut Islamov on 21.10.2016.
 */
public class UnauthorizedException extends ApiException {

    public UnauthorizedException() {
        this("Unauthorized access.");
    }

    public UnauthorizedException(String message) {
        this("unauthorized_access", message);
    }

    public UnauthorizedException(String code, String message) {
        super(HttpStatus.UNAUTHORIZED, code, message);
    }

}
