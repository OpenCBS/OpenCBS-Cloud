package com.opencbs.core.validators;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public abstract class BaseValidator {

    protected void stringIsNotEmpty(String s, String message) {
        Assert.isTrue(!StringUtils.isEmpty(s), message);
        Assert.isTrue(!StringUtils.isEmpty(s.trim()), message);
    }
}
