package com.opencbs.core.dto.profiles;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.UserInfoDto;
import lombok.Data;

import java.util.Set;

@Data
public class ProfileDto extends BaseDto {

    private String name;

    private String type;

    private String createdAt;

    private UserInfoDto createdBy;

    private EntityStatus status;

    private Set<AccountDto> currentAccounts;

    private BranchDto branch;
}
