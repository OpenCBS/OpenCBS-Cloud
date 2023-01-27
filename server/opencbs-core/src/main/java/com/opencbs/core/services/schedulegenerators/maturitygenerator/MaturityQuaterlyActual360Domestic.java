package com.opencbs.core.services.schedulegenerators.maturitygenerator;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.ScheduleGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static com.opencbs.core.services.schedulegenerators.BaseScheduleGenerator.DECIMAL_PLACE;
import static com.opencbs.core.services.schedulegenerators.BaseScheduleGenerator.ROUNDING_MODE;

@Component
public class MaturityQuaterlyActual360Domestic extends ScheduleGeneratorHelper implements ScheduleGenerator{

    private static final int DAY_IN_YEAR = 360;


    @Autowired
    public MaturityQuaterlyActual360Domestic(@NonNull HolidayService holidayService) {
        super(holidayService);
    }

    @Override
    public List<Installment> getSchedule(ScheduleParams params) {
        if (params.getPreferredRepaymentDate() == null){
            LocalDate dayFirstPayment = DateHelper.getFirstDayOfQuarter(params.getDisbursementDate()).plus(2, ChronoUnit.MONTHS);
            params.setPreferredRepaymentDate(dayFirstPayment);
        }

        return buildScheduler(params);
    }

    @Override
    public int getDaysInPeriod() {
        throw new UnsupportedOperationException();
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.MATURITY_QUARTERLY_ACTUAL_360_DOMESTIC;
    }

    private List<Installment> buildScheduler(ScheduleParams params) {
        List<Installment> installments = new ArrayList<>();

        LocalDate date = params.getDisbursementDate();
        Integer number = 0;
        BigDecimal olb = params.getAmount();

        int maturityWithoutGracePeriod = installments.size() - params.getGracePeriod();
        BigDecimal installmentPrincipal = params.getAmount()
                .setScale(DECIMAL_PLACE)
                .divide(BigDecimal.valueOf(maturityWithoutGracePeriod), ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);

        BigDecimal interestPerDay = olb.multiply(this.getInterestRate(params.getInterestRate()))
                .divide(BigDecimal.valueOf(DAY_IN_YEAR), ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);

        LocalDate preferDate = params.getDisbursementDate();
        BigDecimal deltaOfInterest = BigDecimal.ZERO;

        while (DateHelper.lessOrEqual(date, params.getMaturityDate())) {
            Installment installment = this.buildsBaseInstallment(number);
            LocalDate expectedDate = (number == 0) ? params.getPreferredRepaymentDate() : date;
            LocalDate maturityDate = this.getShiftedDate(expectedDate);

            BigDecimal interest = interestPerDay.multiply( BigDecimal.valueOf(DateHelper.daysBetween(preferDate, expectedDate)));
            installment.setInterest(interest.add(deltaOfInterest));
            deltaOfInterest = interestPerDay.multiply( BigDecimal.valueOf(DateHelper.daysBetween(expectedDate, maturityDate)));

            installment.setMaturityDate(maturityDate);
            installments.add(installment);

            date = expectedDate.plus(3, ChronoUnit.MONTHS);

            if (params.isUseCustomInstallmentPrincipals()) {
                installment.setPrincipal(params.getInstallmentPrincipals().get(installment.getNumber()));
                olb = olb.subtract(installment.getPrincipal());
            }
            else {
                if (installment.getNumber() > params.getGracePeriod()) {
                    installment.setPrincipal(installmentPrincipal);
                    olb = olb.subtract(installment.getPrincipal());
                }
            }

            installment.setOlb(olb);
            number++;
        }

        if (DateHelper.daysBetween(params.getMaturityDate(), date) != 0) {
            Installment installment = this.buildsBaseInstallment(number);
            installment.setMaturityDate(params.getMaturityDate());
            installments.add(installment);
        }

        return installments;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}
