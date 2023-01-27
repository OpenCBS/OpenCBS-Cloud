package com.opencbs.core.exceptions;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private HttpStatus httpStatus;
    private String errorCode;

    public ApiException(HttpStatus httpStatus, String errorCode, String message) {
        super(message);

        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

}
