package com.opencbs.core.domain;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import lombok.Data;

@Data
public class ChangesInfo {
    private CustomFieldValue liveCustomFieldValue;
    private CustomFieldValue pendingCustomFieldValue;
    private CustomField customField;
}
