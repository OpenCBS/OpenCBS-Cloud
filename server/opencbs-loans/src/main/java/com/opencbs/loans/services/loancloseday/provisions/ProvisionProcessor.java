package com.opencbs.loans.services.loancloseday.provisions;

import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.domain.enums.ProvisionType;
import lombok.NonNull;

import java.math.BigDecimal;
import java.util.List;

public interface ProvisionProcessor {

    BigDecimal calculate(@NonNull List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo);

    BigDecimal calculateRateByAmount(LoanInfo loanInfo, BigDecimal amount);

    BigDecimal getActualValueProvision(@NonNull List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo);

    ProvisionType getType();

    AccountRuleType getReserveAccountType();

    AccountRuleType getProvisionAccountType();

    AccountRuleType getReversalProvisionAccountType();

    String getIncreaseComment();

    String getDecreaseComment();
}
