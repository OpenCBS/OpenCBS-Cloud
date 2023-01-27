package com.opencbs.loans.dto.creditcommittee;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.RoleDto;
import com.opencbs.core.dto.UserInfoDto;
import lombok.Data;

@Data
public class CreditCommitteeVoteDto extends BaseDto {
    private RoleDto role;

    private UserInfoDto changedBy;

    private String notes;

    private String createdAt;

    private String status;
}
