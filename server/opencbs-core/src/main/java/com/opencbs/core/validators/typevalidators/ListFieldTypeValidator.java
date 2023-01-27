package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.domain.customfields.CustomField;
import org.springframework.util.Assert;

import java.util.List;

public class ListFieldTypeValidator implements FieldTypeValidator {

    @Override
    public void validate(CustomField customField, String value) {
        Object itemsObject = customField.getExtra().get("items");
        Assert.notNull(itemsObject, "The `items` property not found in extra.");
        Assert.isTrue(itemsObject instanceof List, "The `items` property is not an array.");
        List<String> items = (List<String>) itemsObject;

        Assert.isTrue(items.contains(value), String.format("`%s` is not a valid list entry.", value));
    }
}
