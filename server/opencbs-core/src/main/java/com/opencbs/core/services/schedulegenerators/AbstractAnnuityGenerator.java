package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.services.HolidayService;

import java.math.BigDecimal;
import java.util.List;

public abstract class AbstractAnnuityGenerator extends BaseScheduleGenerator {

    private final int period;
    private final int days;

    protected AbstractAnnuityGenerator(HolidayService holidayService, int period) {
        this(holidayService, period, 0);
    }

    protected AbstractAnnuityGenerator(HolidayService holidayService, int period, int days) {
        super(holidayService);
        this.period = period;
        this.days = days;
    }

    protected abstract int getDaysInYear();

    @Override
    public List<Installment> getSchedule(ScheduleParams params) {
        List<Installment> installments;
        if (params.getScheduleBasedType().equals(ScheduleBasedType.BY_MATURITY)) {
            installments = this.buildSchedule(params, period, days);
        }
        else {
            installments = this.initRowSchedule(params, period, days, false);
        }

        //This is fast fix for last accrual date in installments. This approach might be incorrect.
        installments.forEach(installment -> installment.setLastAccrualDate(installment.getMaturityDate()));

        //Use to make right count of installment days
        boolean biweekly = (days == 14 && period == 0);
        //Calculate annuity
        int counter = 0;
        int number = installments.size();

        long days = period * 30 + this.days;
        BigDecimal interestRate = this.getInterestRate(params.getInterestRate())
                .multiply(BigDecimal.valueOf(days))
                .divide(BigDecimal.valueOf(this.getDaysInYear()), ROUNDING_MODE); //TODO

        BigDecimal numerator = interestRate.multiply(params.getAmount());
        double denominator = 1 - 1 / Math.pow(1 + interestRate.doubleValue(), number);
        BigDecimal annuity = numerator.divide(BigDecimal.valueOf(denominator), ROUNDING_MODE);
        annuity = annuity.setScale(DECIMAL_PLACE, ROUNDING_MODE);

        // Iteratively, build the schedule
        while (counter < 20) {
            BigDecimal olb = params.getAmount();
            olb = olb.setScale(DECIMAL_PLACE, ROUNDING_MODE);

            for (int i = 0; i < installments.size(); i++) {
                Installment installment = installments.get(i);
                installment.setOlb(olb);
                long installmentDays = getDays(installment.getNumber() == 1
                        ? params.getDisbursementDate()
                        : installments.get(i - 1).getLastAccrualDate(), installment.getLastAccrualDate(), biweekly);
                BigDecimal interest = olb.multiply(this.getInterestRate(params.getInterestRate()))
                        .multiply(BigDecimal.valueOf(installmentDays))
                        .divide(BigDecimal.valueOf(this.getDaysInYear()), ROUNDING_MODE);
                interest = interest.setScale(DECIMAL_PLACE, ROUNDING_MODE);
                //Comment for next time research commit by OK-3183
                //Assert.isTrue(annuity.compareTo(interest) > 0, "Amount of days between disbursement date and first repayment date is excessive");
                installment.setInterest(interest);

                if (params.isUseCustomInstallmentPrincipals()) {
                    installment.setPrincipal(params.getInstallmentPrincipals().get(installment.getNumber()));
                }
                else {
                    if (params.getGracePeriod() != null && installment.getNumber() <= params.getGracePeriod()) {
                        installment.setPrincipal(BigDecimal.ZERO);
                    } else {
                        BigDecimal principal = annuity.subtract(installment.getInterest());
                        principal = principal.setScale(DECIMAL_PLACE, ROUNDING_MODE);
                        installment.setPrincipal(principal);
                    }
                }

                olb = olb.subtract(installment.getPrincipal());
            }

            double remainder = olb.doubleValue() / number;
            counter++;

            if (Math.abs(remainder) > 0.01) {
                annuity = annuity.add(BigDecimal.valueOf(remainder));
                continue;
            }

            break;
        }

        if (!params.isUseCustomInstallmentPrincipals()) {
            Installment installment = installments.get(number - 1);
            BigDecimal diff = installments
                    .stream()
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

    @Override
    public Boolean getIfFact() {
        return getDaysInYear()!=360;
    }
}
