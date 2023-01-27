package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

import java.util.List;

@Data
public class CompanyDetailDto extends BaseDto implements BaseRequestDto {

    private String name;
    private List<AttachmentDto> attachments;
    private EntityStatus status;
    private List<ProfileCustomFieldSectionDto> customFieldSections;
    private List<AccountDto> currentAccounts;
    private List<CompanyMembersDto> companyMembers;
    private Boolean isReadOnly;

}
