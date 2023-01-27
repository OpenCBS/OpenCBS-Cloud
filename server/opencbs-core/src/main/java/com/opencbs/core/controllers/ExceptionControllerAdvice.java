package com.opencbs.core.controllers;

import com.opencbs.core.dto.responses.ErrorResponse;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ValidationException;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionControllerAdvice {
    private static Logger log = Logger.getLogger(ExceptionControllerAdvice.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(ApiException ex){
        ErrorResponse error = new ErrorResponse(ex.getHttpStatus().value(), ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, ex.getHttpStatus());
    }

   @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(IllegalArgumentException ex){
       ValidationException validationException = new ValidationException(ex.getMessage());
        return exceptionHandler(validationException);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(Exception ex){
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "internal_error", ex.getMessage());
        logError(ex);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void logError(Exception e){
        log.error("-------------- ERROR --------------");
        log.error(" MESSAGE: " + e.getMessage());
        log.error("Stacktrace: ", e);
        log.error("-----------------------------------");
    }
}