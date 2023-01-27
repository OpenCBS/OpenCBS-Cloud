package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

import java.util.List;

@Data
public class PersonDetailDto extends BaseDto implements BaseRequestDto {

    private String name;
    private UserInfoDto createdBy;
    private String createdAt;
    private List<AttachmentDto> attachments;
    private List<ProfileCustomFieldSectionDto> customFieldSections;
    private EntityStatus status;
    private List<AccountDto> currentAccounts;
    private BranchDto branch;

}
