package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.services.HolidayService;

import java.math.BigDecimal;
import java.util.List;


public abstract class AbstractDifferentialGenerator extends BaseScheduleGenerator {

    private final int season;
    private final int period;

    protected AbstractDifferentialGenerator(HolidayService holidayService, int season, int period) {
        super(holidayService);
        this.season = season;
        this.period = period;
    }

    @Override
    public List<Installment> getSchedule(ScheduleParams params) {
        List<Installment> installments = this.initRowSchedule(params, period, false);
        BigDecimal amount = params.getAmount();
        amount = amount.setScale(DECIMAL_PLACE, ROUNDING_MODE);
        int quarter = params.getMaturity() / this.season;

        BigDecimal interest = params.getInterestRate()
                .divide(BigDecimal.valueOf(100))
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);

        BigDecimal principal = amount.divide(BigDecimal.valueOf(quarter), DECIMAL_PLACE, ROUNDING_MODE);
        BigDecimal secInterest;

        for (Installment installment : installments) {

            secInterest = amount.multiply(interest).divide(BigDecimal.valueOf(12), 2, BigDecimal.ROUND_HALF_UP);
            secInterest = secInterest.setScale(DECIMAL_PLACE, ROUNDING_MODE);
            BigDecimal oldAmount = amount;

            if (params.isUseCustomInstallmentPrincipals()) {
                installment.setPrincipal(params.getInstallmentPrincipals().get(installment.getNumber()));

                amount = amount.subtract(installment.getPrincipal());
                installment.setOlb(oldAmount);
            }
            else {
                if (installment.getNumber() % this.season == 0) {
                    amount = amount.subtract(principal);
                    installment.setPrincipal(principal);
                }

                installment.setInterest(secInterest);
                installment.setOlb(oldAmount);
            }

            installment.setInterest(secInterest);
        }

        if (params.isUseCustomInstallmentPrincipals()) {
            calculatedDiff(params, installments);
        }

        return installments;
    }

    private void calculatedDiff(ScheduleParams params, List<Installment> installments) {
        Installment installment = installments.get(params.getMaturity() - 1);
        BigDecimal diff = installments.stream()
                .map(Installment::getPrincipal)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
        diff = params.getAmount().subtract(diff);

        BigDecimal adjustedPrincipal = installment.getPrincipal().add(diff);
        installment.setPrincipal(adjustedPrincipal);
    }

    ///TODO Check for all children classes
    @Override
    public Boolean getIfFact() {
        return true;
    }
}