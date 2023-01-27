package com.opencbs.loans.dto;

import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.dto.group.FullGroupMemberAmountsDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.loans.domain.LoanAdditionalInfo;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class LoanDto extends LoanBaseDto {

    private BigDecimal amount;
    private Long loanApplicationId;
    private String code;
    private ProfileDto profile;
    private LoanAdditionalInfo loanAdditionalInfoEntity;
    private UserInfoDto loanOfficer;
    private String loanProductName;
    private List<FullGroupMemberAmountsDto> members;
    private boolean isReadOnly;
}
