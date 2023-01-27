package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class LocationDtoValidator extends TreeEntityDtoValidator<LocationService> {
   @Autowired
    public LocationDtoValidator(LocationService service) {
        super(service);
    }
}
