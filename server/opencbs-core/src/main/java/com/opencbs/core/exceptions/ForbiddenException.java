package com.opencbs.core.exceptions;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException{
    public ForbiddenException(){
        this("Access denied.");
    }

    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, "forbidden", message);
    }
}
