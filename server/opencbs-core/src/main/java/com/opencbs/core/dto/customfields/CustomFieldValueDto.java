package com.opencbs.core.dto.customfields;

import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;

@Data
public class CustomFieldValueDto {

    private Object value;
    private EntityStatus status;
    private CustomFieldDto customField;
}
