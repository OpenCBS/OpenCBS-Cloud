package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.services.HolidayService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public abstract class AbstractAnnuityFactGenerator extends BaseScheduleGenerator {

    private final int period;
    private final int days;

    protected AbstractAnnuityFactGenerator(HolidayService holidayService, int period) {
        this(holidayService, period, 0);
    }

    protected AbstractAnnuityFactGenerator(HolidayService holidayService, int period, int days) {
        super(holidayService);
        this.period = period;
        this.days = days;
    }

    protected abstract int getDaysInYear(LocalDate date);

    @Override
    public List<Installment> getSchedule(ScheduleParams params) {
        List<Installment> installments;
        if (params.getScheduleBasedType().equals(ScheduleBasedType.BY_MATURITY)) {
            installments = this.buildSchedule(params, period, days);
        }
        else {
            installments = this.initRowSchedule(params, period, days, true);
        }
        int count = 0;
        int number = installments.size();
        BigDecimal totalAll = BigDecimal.ZERO;
        BigDecimal remainder = BigDecimal.ZERO;

        while (count < 20) {
            BigDecimal olb = params.getAmount();
            olb = olb.setScale(DECIMAL_PLACE, ROUNDING_MODE);
            BigDecimal installmentTotal = totalAll.divide(BigDecimal.valueOf(number), ROUNDING_MODE).add(remainder);

            for (int i = 0; i < installments.size(); i++) {
                Installment installment = installments.get(i);
                installment.setOlb(olb);
                int daysInYear = this.getDaysInYear(installment.getLastAccrualDate());
                long installmentDays = this.getDays(installment.getNumber() == 1
                        ? params.getDisbursementDate()
                        : installments.get(i - 1).getLastAccrualDate(), installment.getLastAccrualDate(), true);
                BigDecimal interest = olb.multiply(this.getInterestRate(params.getInterestRate()))
                        .multiply(BigDecimal.valueOf(installmentDays))
                        .divide(BigDecimal.valueOf(daysInYear), ROUNDING_MODE);
                interest = interest.setScale(DECIMAL_PLACE, ROUNDING_MODE);

                installment.setInterest(interest);
                if (count == 0) {
                    totalAll = totalAll.add(interest);
                }

                if (params.isUseCustomInstallmentPrincipals()) {
                    installment.setPrincipal(params.getInstallmentPrincipals().get(installment.getNumber()));
                }
                else {
                    if (params.getGracePeriod() != null && installment.getNumber() <= params.getGracePeriod()) {
                        installment.setPrincipal(BigDecimal.ZERO);
                    } else {
                        BigDecimal principal = count == 0
                                ? getAnnuityCalculate(number, params, daysInYear, installmentDays).subtract(installment.getInterest())
                                : installmentTotal.subtract(interest);
                        principal = principal.setScale(DECIMAL_PLACE, ROUNDING_MODE);
                        installment.setPrincipal(principal);
                        if (count == 0) {
                            totalAll = totalAll.add(principal);
                        }
                    }
                }

                olb = olb.subtract(installment.getPrincipal());
            }

            count++;

            olb = olb.divide(BigDecimal.valueOf(number), ROUNDING_MODE);

            if (Math.abs(olb.doubleValue()) > 0.01) {
                remainder = remainder.add(olb);
                continue;
            }
            break;
        }

        if (!params.isUseCustomInstallmentPrincipals()) {
            Installment installment = installments.get(number - 1);
            BigDecimal diff = installments.stream()
                    .map(Installment::getPrincipal)
                    .reduce(BigDecimal::add)
                    .orElse(BigDecimal.ZERO);
            diff = params.getAmount().subtract(diff);

            BigDecimal adjustedPrincipal = installment.getPrincipal().add(diff);
            installment.setPrincipal(adjustedPrincipal);
            installment.setOlb(installment.getPrincipal());
        }

        return installments;
    }

    private BigDecimal getAnnuityCalculate(int installmentSize, ScheduleParams params, int daysInYear, long installmentDays) {
        BigDecimal interestRate = this.getInterestRate(params.getInterestRate())
                .multiply(BigDecimal.valueOf(installmentDays))
                .divide(BigDecimal.valueOf(daysInYear), ROUNDING_MODE);
        BigDecimal numerator = interestRate.multiply(params.getAmount());
        double denominator = 1 - 1 / Math.pow(1 + interestRate.doubleValue(), installmentSize);
        BigDecimal annuity = numerator.divide(BigDecimal.valueOf(denominator), ROUNDING_MODE);
        annuity = annuity.setScale(DECIMAL_PLACE, ROUNDING_MODE);
        return annuity;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}
