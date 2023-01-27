package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.enums.PasswordExpirePeriod;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;

@Mapper
public class SystemSettingsMapper {

    public CustomFieldValueDto mapToDto(SystemSettings systemSettings) {
        CustomFieldValueDto customFieldValueDto = new CustomFieldValueDto();
        CustomFieldDto customFieldDto = new CustomFieldDto();

        customFieldDto.setId(systemSettings.getId());
        customFieldDto.setSectionId(systemSettings.getSection().getId());
        customFieldDto.setName(systemSettings.getName().toString());
        customFieldDto.setCaption(systemSettings.getName().toString().toLowerCase());
        customFieldDto.setFieldType(systemSettings.getType());
        customFieldDto.setUnique(true);
        customFieldDto.setRequired(true);
        customFieldDto.setOrder(1);
        if (systemSettings.getName().equals(SystemSettingsName.EXPIRE_PERIOD)) {
            CustomFieldExtra customFieldExtra = new CustomFieldExtra();
            customFieldExtra.put("items", PasswordExpirePeriod.values());
            customFieldDto.setExtra(customFieldExtra);
        }

        customFieldValueDto.setCustomField(customFieldDto);
        customFieldValueDto.setStatus(EntityStatus.LIVE);
        customFieldValueDto.setValue(systemSettings.getValue());

        return customFieldValueDto;
    }

}
