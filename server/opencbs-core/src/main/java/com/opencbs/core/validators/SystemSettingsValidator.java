package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.enums.PasswordExpirePeriod;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import io.jsonwebtoken.lang.Assert;
import org.springframework.util.CollectionUtils;

import java.util.Collections;

@Validator
public class SystemSettingsValidator {

    public void validateOnEdit(CustomFieldValueDto dto) {
        Assert.isTrue( CollectionUtils.containsAny(CollectionUtils.arrayToList(CustomFieldType.values()), Collections.singletonList(dto.getCustomField().getFieldType()) ),
                "Incorrect data type."
        );

        if (dto.getCustomField().getFieldType().equals(CustomFieldType.NUMERIC) &&
                dto.getCustomField().getName().equals(SystemSettingsName.PASSWORD_LENGTH.toString())) {
            int value = Integer.parseInt(dto.getValue().toString());
            if (!(value > 3 && value < 256)) {
                throw new RuntimeException("Password length must be greater than 3 and less than 256");
            }
        }

        if (dto.getCustomField().getFieldType().equals(CustomFieldType.CHECKBOX)) {
            String bool = dto.getValue().toString();
            if (!(bool.equals("FALSE") || bool.equals("TRUE"))) {
                throw new RuntimeException("Boolean type must be FALSE or TRUE");
            }
        }

        if (dto.getCustomField().getFieldType().equals(CustomFieldType.LIST)) {
            String text = dto.getValue().toString();
            if (!(text.equals(PasswordExpirePeriod.WEEK.toString()) || text.equals(PasswordExpirePeriod.TWO_WEEKS.toString()) ||
                    text.equals(PasswordExpirePeriod.MONTH.toString()) || text.equals(PasswordExpirePeriod.NEVER.toString()))) {
                throw new RuntimeException("Expire period has incorrect data type");
            }
        }

        if (dto.getCustomField().getFieldType().equals(CustomFieldType.NUMERIC) &&
                dto.getCustomField().getName().equals(SystemSettingsName.EXPIRATION_SESSION_TIME_IN_MINUTES.toString())) {
            int value = Integer.parseInt(dto.getValue().toString());
            if (value <= 0) {
                throw new RuntimeException("Expire session in minutes must be greater than 0");
            }
        }
    }

}
