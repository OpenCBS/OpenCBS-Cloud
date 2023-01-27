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

@Component
public class MaturityQuarterlyActual360Generator extends ScheduleGeneratorHelper implements ScheduleGenerator {

    private static final int DAY_IN_YEAR = 360;


    @Autowired
    public MaturityQuarterlyActual360Generator(@NonNull HolidayService holidayService) {
        super(holidayService);
    }

    @Override
    public List<Installment> getSchedule(ScheduleParams params) {
        if (params.getPreferredRepaymentDate() == null){
            LocalDate dayFirstPayment = DateHelper.getFirstDayOfQuarter(params.getDisbursementDate()).plus(2, ChronoUnit.MONTHS);
            params.setPreferredRepaymentDate(dayFirstPayment);
        }

        List<Installment> instalments = initRowsByMaturity(params);
        calculatePayments(params, instalments);
        return instalments;
    }

    @Override
    public int getDaysInPeriod() {
        throw new UnsupportedOperationException("getDaysInPeriod");
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.MATURITY_QUARTERLY_ACTUAL_360;
    }

    private List<Installment> initRowsByMaturity(ScheduleParams params) {
        List<Installment> installments = new ArrayList<>();

        LocalDate date = params.getDisbursementDate();
        Integer number = 0;
        while (DateHelper.lessOrEqual(date, params.getMaturityDate())) {
            Installment installment = this.buildsBaseInstallment(number);
            LocalDate maturityDate = number == 0 ? this.getShiftedDate(params.getPreferredRepaymentDate()) :  this.getShiftedDate(date);
            installment.setMaturityDate(maturityDate);
            installments.add(installment);
            date = maturityDate.plus(3, ChronoUnit.MONTHS);
            number++;
        }

        if (DateHelper.daysBetween(params.getMaturityDate(), date)!=0) {
            Installment installment = this.buildsBaseInstallment(number);
            installment.setMaturityDate(params.getMaturityDate());
            installments.add(installment);
        }

        return installments;
    }

    protected void calculatePayments(ScheduleParams params, List<Installment> installments ) {
        if (installments.isEmpty()) {
            return;
        }

        BigDecimal olb = params.getAmount();

        int maturityWithoutGracePeriod = installments.size() - params.getGracePeriod();
        BigDecimal installmentPrincipal = params.getAmount()
                .setScale(ScheduleGenerator.DECIMAL_PLACE)
                .divide(BigDecimal.valueOf(maturityWithoutGracePeriod), ScheduleGenerator.ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);

        BigDecimal interestRate = this.getInterestRate(params.getInterestRate());
        LocalDate startDate = params.getDisbursementDate();

        for (Installment installment : installments) {
            BigDecimal interestPerDay = olb.multiply(interestRate)
                            .divide(BigDecimal.valueOf(DAY_IN_YEAR), ROUNDING_MODE)
                            .setScale(DECIMAL_PLACE, ROUNDING_MODE);

            BigDecimal interest = interestPerDay.multiply( BigDecimal.valueOf(DateHelper.daysBetween(startDate, installment.getMaturityDate())));
            installment.setInterest(interest);
            startDate = installment.getMaturityDate();

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
        }
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}
