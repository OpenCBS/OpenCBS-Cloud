package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.HolidayDto;
import com.opencbs.core.helpers.DateHelper;
import io.jsonwebtoken.lang.Assert;
import org.springframework.util.StringUtils;

@Validator
public class HolidayDtoValidator {

    public void validate(HolidayDto holiday) {
        Assert.isTrue(!StringUtils.isEmpty(holiday.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(holiday.getName().trim()), "Name is required.");
        Assert.notNull(holiday.getDate(), "Date is required.");
        org.springframework.util.Assert.isTrue(DateHelper.isValidDate(holiday.getDate()), "Date is an invalid date format.");
    }
}
