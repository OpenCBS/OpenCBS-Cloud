package com.opencbs.core.dto.group;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GroupDetailDto extends BaseDto implements BaseRequestDto {

    private String name;
    private EntityStatus status;
    private List<ProfileCustomFieldSectionDto> customFieldSections;
    private List<GroupsMembersDto> groupsMembers;
    private BranchDto branch;
    private List<AttachmentDto> attachments = new ArrayList<>();
    private Boolean isReadOnly;

}
