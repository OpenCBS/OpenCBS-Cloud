package com.opencbs.loans.services.loancloseday.provisions;

import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.domain.enums.ProvisionType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor

@Service
public class ProvisionOlb extends BaseProvisionProcessor implements ProvisionProcessor {

    @Override
    protected BigDecimal getBasis(LoanInfo loanInfo) {
        return loanInfo.getPrincipal().subtract(loanInfo.getPaidPrincipal());
    }

    @Override
    public BigDecimal getActualValueProvision(@NonNull List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo) {
        Optional<LoanProductProvision> loanProductProvision = loanProductProvisions.stream()
                .filter(p -> p.getLateOfDays().compareTo(loanInfo.getLateDaysOfPrincipal()) <= 0 && p.getProvisionByPrincipal().compareTo(BigDecimal.ZERO) != 0)
                .max(Comparator.comparing(LoanProductProvision::getLateOfDays));

        if(loanProductProvision.isPresent()){
            return loanProductProvision.get().getProvisionByPrincipal();
        }

        return BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateRateByAmount(@NonNull LoanInfo loanInfo, @NonNull BigDecimal amount) {
        Assert.isTrue(BigDecimal.ZERO.compareTo(amount)!=0, "Value can't be zero");
        return amount.multiply(BigDecimal.valueOf(100)).divide(loanInfo.getOlb(), 2, BigDecimal.ROUND_HALF_EVEN);
    }

    @Override
    public ProvisionType getType() {
        return ProvisionType.PRINCIPAL;
    }

    @Override
    public AccountRuleType getReserveAccountType() {
        return AccountRuleType.LOAN_LOSS_RESERVE;
    }

    @Override
    public AccountRuleType getProvisionAccountType() {
        return AccountRuleType.PROVISION_ON_PRINCIPAL;
    }

    @Override
    public AccountRuleType getReversalProvisionAccountType() {
        return AccountRuleType.PROVISION_REVERSAL_ON_PRINCIPAL;
    }

    @Override
    public String getIncreaseComment() {
        return "Provisioning principal";
    }

    @Override
    public String getDecreaseComment() {
        return "Provisioning reversal principal";
    }
}
