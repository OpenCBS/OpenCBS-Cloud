package com.opencbs.loans.dto.loanapplications;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class LoanApplicationCreateDto extends LoanApplicationBaseDto {

    private List<Long> penaltyIds;
}
