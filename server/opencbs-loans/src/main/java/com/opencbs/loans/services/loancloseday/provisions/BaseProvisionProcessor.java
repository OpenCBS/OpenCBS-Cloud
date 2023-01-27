package com.opencbs.loans.services.loancloseday.provisions;

import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanProductProvision;
import lombok.NonNull;

import java.math.BigDecimal;
import java.util.List;

public abstract class BaseProvisionProcessor {

    public BigDecimal calculate(List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo) {
        final BigDecimal provisionValue = this.getActualValueProvision(loanProductProvisions, loanInfo);
        if ( BigDecimal.ZERO.compareTo(provisionValue)==0) {
            return BigDecimal.ZERO;
        }

        return this.getBasis(loanInfo).multiply(provisionValue).divide(BigDecimal.valueOf(100));
    }

    protected abstract BigDecimal getBasis(LoanInfo loanInfo);

    public abstract BigDecimal getActualValueProvision(@NonNull List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo);
}
