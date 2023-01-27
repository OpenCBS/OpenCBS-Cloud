package com.opencbs.core.helpers;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExceptionHelper {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void plannedException(int rowNumber) throws Exception {
        if (rowNumber % 100 == 0 && rowNumber != 0) {
            throw new RuntimeException("Planned");
        }
    }

}
