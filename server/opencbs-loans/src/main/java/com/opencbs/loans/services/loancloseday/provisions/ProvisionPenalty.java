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
public class ProvisionPenalty extends BaseProvisionProcessor implements ProvisionProcessor {

    @Override
    protected BigDecimal getBasis(LoanInfo loanInfo) {
        return loanInfo.getPenalty();
    }

    @Override
    public BigDecimal getActualValueProvision(@NonNull List<LoanProductProvision> loanProductProvisions, LoanInfo loanInfo) {
        final Optional<LoanProductProvision> provision = loanProductProvisions.stream()
                .filter(p -> p.getLateOfDays().compareTo(loanInfo.getLateDaysOfPenalty()) <= 0 && p.getProvisionByPenalty().compareTo(BigDecimal.ZERO) != 0)
                .max(Comparator.comparing(LoanProductProvision::getLateOfDays));

        if (provision.isPresent()) {
            return provision.get().getProvisionByInterest();
        }

        return BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateRateByAmount(@NonNull LoanInfo loanInfo, @NonNull BigDecimal amount) {
        Assert.isTrue(BigDecimal.ZERO.compareTo(amount)!=0, "Value can't be zero");
        return amount.multiply(BigDecimal.valueOf(100)).divide(loanInfo.getPenalty(), 2, BigDecimal.ROUND_HALF_EVEN);
    }

    @Override
    public ProvisionType getType() {
        return ProvisionType.PENALTIES;
    }

    @Override
    public AccountRuleType getReserveAccountType() {
        return AccountRuleType.LOAN_LOSS_RESERVE_PENALTIES;
    }

    @Override
    public AccountRuleType getProvisionAccountType() {
        return AccountRuleType.PROVISION_ON_LATE_FEES;
    }

    @Override
    public AccountRuleType getReversalProvisionAccountType() {
        return AccountRuleType.PROVISION_REVERSAL_ON_LATE_FEES;
    }

    @Override
    public String getIncreaseComment() {
        return "Provisioning late fees";
    }

    @Override
    public String getDecreaseComment() {
        return "Provisioning decrease late fees";
    }
}
