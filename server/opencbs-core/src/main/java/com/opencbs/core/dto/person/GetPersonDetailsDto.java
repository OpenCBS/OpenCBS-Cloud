package com.opencbs.core.dto.person;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import lombok.Data;

import java.util.List;

@Data
public class GetPersonDetailsDto extends BaseDto {

    private String name;
    private List<AttachmentDto> attachments;
    private List<ProfileCustomFieldSectionDto> customFieldSections;
    private EntityStatus status;
    private Boolean isReadOnly;
}
