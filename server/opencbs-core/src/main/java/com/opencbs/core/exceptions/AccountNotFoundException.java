package com.opencbs.core.exceptions;

import javax.persistence.EntityNotFoundException;

public class AccountNotFoundException extends EntityNotFoundException {
    public AccountNotFoundException(Long id) {
        super(String.format("There is no Account with id %s", id));
    }
}
