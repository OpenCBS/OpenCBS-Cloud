package com.opencbs.loans.domain;

import com.opencbs.core.domain.RepaymentSplit;
import lombok.Data;

@Data
public class BatchRepaymentSplit extends RepaymentSplit {

    private Long loanId;
}
