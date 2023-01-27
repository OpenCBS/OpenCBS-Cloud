package com.opencbs.core.dto;

import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import lombok.Data;

import java.util.List;

@Data
public class BranchDto extends BaseDto {

    private String name;
    private List<ProfileCustomFieldSectionDto> customFieldSections;
}
