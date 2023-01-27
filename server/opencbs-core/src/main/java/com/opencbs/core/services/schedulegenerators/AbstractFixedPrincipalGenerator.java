package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.services.HolidayService;
import lombok.NonNull;

import java.math.BigDecimal;
import java.util.List;

public abstract class AbstractFixedPrincipalGenerator extends BaseScheduleGenerator {

    private final int period;
    private final int days;

    protected AbstractFixedPrincipalGenerator(@NonNull HolidayService holidayService, int period) {
        this(holidayService, period, 0);
    }

    protected AbstractFixedPrincipalGenerator(@NonNull HolidayService holidayService, int period, int days) {
        super(holidayService);
        this.period = period;
        this.days = days;
    }

    protected abstract int getDaysInYear(int year);

    @Override
    public List<Installment> getSchedule(@NonNull ScheduleParams params) {
        List<Installment> installments =
                params.getScheduleBasedType() == ScheduleBasedType.BY_MATURITY
                        ? buildSchedule(params, period, days)
                        : initRowSchedule(params, period, days, getIfFact());

        //Fast fix last accurual date. It's maybe wrong way? but this fast and work
        installments.forEach(installment -> installment.setLastAccrualDate(installment.getMaturityDate()));

        int maturityWithoutGracePeriod = installments.size() - params.getGracePeriod();
        BigDecimal olb = params.getAmount();
        BigDecimal installmentPrincipal = params.getAmount()
                .setScale(DECIMAL_PLACE)
                .divide(BigDecimal.valueOf(maturityWithoutGracePeriod), ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);


        for (int i = 0; i < installments.size(); i++) {
            Installment installment = installments.get(i);
            installment.setOlb(olb);

            long installmentDays = getDays(installment.getNumber() == 1
                    ? params.getDisbursementDate()
                    : installments.get(i - 1).getLastAccrualDate(), installment.getLastAccrualDate(), getIfFact());

            BigDecimal interest = olb
                    .multiply(getInterestRate(params.getInterestRate()))
                    .multiply(BigDecimal.valueOf(installmentDays))
                    .divide(BigDecimal.valueOf(getDaysInYear(installment.getMaturityDate().getYear())), ROUNDING_MODE)
                    .setScale(DECIMAL_PLACE, ROUNDING_MODE);

            installment.setInterest(interest);
            if (installment.getNumber() <= params.getGracePeriod()) {
                continue;
            }


            if (params.isUseCustomInstallmentPrincipals()) {
                installment.setPrincipal(params.getInstallmentPrincipals().get(installment.getNumber()));
            }
            else {
                installment.setPrincipal(installment.getNumber() == installments.size() ? olb : installmentPrincipal);
            }

            olb = olb.subtract(installment.getPrincipal());
        }

        return installments;
    }
}
