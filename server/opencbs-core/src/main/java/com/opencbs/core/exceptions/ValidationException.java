package com.opencbs.core.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Created by Makhsut Islamov on 24.10.2016.
 */
public class ValidationException extends ApiException{
    public ValidationException(String message) {
        this("invalid", message);
    }

    public ValidationException(String code, String message) {
        super(HttpStatus.BAD_REQUEST, code, message);
    }
}
