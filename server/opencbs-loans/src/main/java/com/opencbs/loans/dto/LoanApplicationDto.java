package com.opencbs.loans.dto;

import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.dto.group.FullGroupMemberAmountsDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.loans.credit.lines.dto.CreditLineInfoDto;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationEntryFeeUpdateDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesUpdateDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPenaltyDto;
import com.opencbs.loans.dto.products.LoanProductDetailsDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoanApplicationDto extends LoanBaseDto {

    private List<FullGroupMemberAmountsDto> amounts;
    private UserInfoDto loanOfficer;
    private LoanProductDetailsDto loanProduct;
    private ProfileDto profile;
    private String code;
    private String loanProductName;
    private String disbursementDate;
    private List<AttachmentDto> attachments;
    private List<LoanApplicationPayeesUpdateDto> payees;
    private List<LoanApplicationEntryFeeUpdateDto> entryFees;
    private List<GuarantorDetailDto> guarantors;
    private List<CreditCommitteeVoteDto> creditCommitteeVotes;
    private LoanDto loan;
    private Long activePayeesCount;
    private Long currencyId;
    private String currencyName;
    private String scheduleType;
    private BranchDto branch;
    private boolean isReadOnly;
    private List<LoanApplicationPenaltyDto> penaltyDtos;
    private Boolean scheduleManualEdited;
    private LocalDateTime scheduleManualEditedAt;
    private UserInfoDto scheduleManualEditedBy;
    private CreditLineInfoDto creditLineInfoDto;
}
