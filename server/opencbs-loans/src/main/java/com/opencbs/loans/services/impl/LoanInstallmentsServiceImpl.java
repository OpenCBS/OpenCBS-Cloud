package com.opencbs.loans.services.impl;

import com.google.common.collect.ImmutableList;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.LoanScheduleInstallment;
import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.dto.UpdateScheduleDto;
import com.opencbs.loans.dto.UpdateScheduleStatus;
import com.opencbs.loans.mappers.LoanInstallmentMapper;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.repositories.LoanRepository;
import com.opencbs.loans.services.LoanInstallmentsService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loanreschedule.LoanRescheduleService;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static java.lang.Boolean.TRUE;


@Service
@RequiredArgsConstructor
public class LoanInstallmentsServiceImpl implements LoanInstallmentsService {

    private final static int DAYS_IN_YEAR = 360;

    private final LoanRepository loanRepository;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final LoanInstallmentMapper installmentMapper;
    private final LoanService loanService;
    private final ScheduleService scheduleService;
    private final LoanScheduleMapper loanScheduleMapper;
    private final LoanRescheduleService loanRescheduleService;


    @Override
    @Transactional
    public ScheduleDto preview(@NonNull Long loanId, @NonNull ManualEditRescheduleDto manualEditRescheduleDto) {
        Loan loan = loanService.findOne(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found: " + loanId));

        final RescheduleDto rescheduleDto = manualEditRescheduleDto.getRescheduleDto();
        final List<LoanScheduleInstallment> loanScheduleInstallments =
                loanScheduleMapper.mapScheduleDtoToLoanScheduleInstallments(manualEditRescheduleDto.getScheduleDto());
        if (isScheduleNotChanged(loan, loanScheduleInstallments)) {
            return installmentMapper.loanSchedulerInstallmentToDto(loanScheduleInstallments, loan.getAmount(), UpdateScheduleStatus.VALID);
        }

        List<LoanInstallment> loanInstallments = rebuildSchedule(loan, loanScheduleInstallments, rescheduleDto);

        UpdateScheduleDto updateScheduleDto =
                UpdateScheduleDto.of(loanScheduleMapper.mapToScheduleDto(loanInstallments, rescheduleDto.getRescheduleDate()));
        updateScheduleDto.setTotalAmount(loan.getAmount());

        UpdateScheduleStatus status = UpdateScheduleStatus.VALID;
        if (getTotalPrincipal(loanScheduleInstallments).compareTo(loan.getAmount()) != 0) {
            status = UpdateScheduleStatus.WRONG_TOTAL_AMOUNT;
        }
        if ( !isValidMaturityDates(loanScheduleInstallments)) {
            status = UpdateScheduleStatus.WRONG_MATURITY_DATA;
        }
        updateScheduleDto.setStatus(status);

        updateScheduleDto.setTotalPrincipal(loanScheduleInstallments.stream()
                .map(i->i.getPrincipal())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        return updateScheduleDto;
    }

    private boolean isValidMaturityDates(List<LoanScheduleInstallment> loanScheduleInstallments) {
        LocalDate prevMaturityData = LocalDate.MIN;
        for (LoanScheduleInstallment lsi: loanScheduleInstallments) {
            if (DateHelper.greaterOrEqual(prevMaturityData, lsi.getMaturityDate())) {
                return false;
            }
            prevMaturityData = lsi.getMaturityDate();
        };

        return true;
    }

    public void validate(@NonNull Loan loan, @NonNull ManualEditRescheduleDto manualEditRescheduleDto) {
        final List<LoanScheduleInstallment> installments =
                loanScheduleMapper.mapScheduleDtoToLoanScheduleInstallments(manualEditRescheduleDto.getScheduleDto());

        if (installments.stream().anyMatch(x -> BigDecimal.ZERO.compareTo(x.getPrincipal()) > 0)) {
            throw new RuntimeException("Negative principal was specified");
        }

        if (installments.stream().anyMatch(x -> BigDecimal.ZERO.compareTo(x.getInterest()) > 0)) {
            throw new RuntimeException("Zero interest was specified");
        }

        final List<LoanInstallment> loanInstallments = this.loanRescheduleService.preview(loan, manualEditRescheduleDto.getRescheduleDto());
        Assert.isTrue(installments.size() == loanInstallments.size(),
                "Incorrect count of installments");

        BigDecimal installmentsAmount = installments.stream()
                .map(i->i.getPrincipal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Assert.isTrue(installmentsAmount.compareTo(loan.getAmount()) == 0, "Loan amount not equal installments principal");
    }

    private boolean isScheduleNotChanged(@NonNull Loan loan, @NonNull List<LoanScheduleInstallment> installments)  {
        final ImmutableList<LoanInstallment> loanInstallments = loanInstallmentRepository.findByLoanId(loan.getId());
        for (LoanInstallment loanInstallment : loanInstallments) {
            Installment installment = installments.stream().filter(x -> x.getNumber() == loanInstallment.getNumber())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Installment not found: " + loanInstallment.getNumber()));

            if (installment.getPrincipal().compareTo(loanInstallment.getPrincipal()) != 0) {
                return false;
            }
        }

        return true;
    }

    private void markScheduleManuallyEdited(@NonNull Loan loan) {
        loan.setScheduleManualEdited(TRUE);
        loan.setScheduleManualEditedAt(LocalDateTime.now());
        loan.setScheduleManualEditedBy(UserHelper.getCurrentUser());

        loanRepository.save(loan);
    }

    private void updateLoanInstallments(@NonNull List<LoanScheduleInstallment> installments, @NonNull Loan loan) {
        final ImmutableList<LoanInstallment> loanInstallments = loanInstallmentRepository.findByLoanId(loan.getId());
        for (LoanInstallment loanInstallment : loanInstallments) {
            Installment installment = installments.stream().filter(x -> x.getNumber() == loanInstallment.getNumber())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Installment not found: " + loanInstallment.getNumber()));

            loanInstallment.setInterest(installment.getInterest());
            loanInstallment.setPrincipal(installment.getPrincipal());
            loanInstallment.setOlb(installment.getOlb());

            loanInstallmentRepository.save(loanInstallment);
        }
    }

    private List<LoanInstallment> rebuildSchedule(@NonNull Loan loan, @NonNull List<LoanScheduleInstallment> installments, RescheduleDto rescheduleDto) {
        final ScheduleGenerator schedule = scheduleService.getScheduleByType(loan.getScheduleType());

        final List<LoanInstallment> loanInstallments = this.loanRescheduleService.preview(loan, rescheduleDto);

        LocalDate localDate = rescheduleDto.getRescheduleDate();
        BigDecimal principal = BigDecimal.ZERO;

        BigDecimal currentOlb = InstallmentsHelper.getUnpaidInstallments(loanInstallments).stream()
                .map(LoanInstallment::getOlb)
                .max(BigDecimal::compareTo)
                .get();
        LocalDate accrualStartDate = rescheduleDto.getRescheduleDate();
        LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), accrualStartDate);
        Boolean firstInstallment = true;
        for (LoanScheduleInstallment installment : installments){
            final LoanInstallment loanInstallment = loanInstallments.stream()
                    .filter(li -> li.getNumber() == installment.getNumber()).findFirst().get();
            if (loanInstallment.isBeforeOrEqualToDate(localDate)) {
                continue;
            }

            loanInstallment.setPrincipal(installment.getPrincipal());
            loanInstallment.setMaturityDate(installment.getMaturityDate());
            loanInstallment.setLastAccrualDate(installment.getMaturityDate());

            LocalDate lastAccrualDate = loanInstallment.getLastAccrualDate();
            Long days = schedule.getIfFact() ? DateHelper.daysBetween(accrualStartDate, lastAccrualDate)
                    : DateHelper.daysBetweenAs_30_360(accrualStartDate, lastAccrualDate);

            BigDecimal interest = calculateInterest(rescheduleDto.getInterestRate(), currentOlb, days, schedule);
            if (firstInstallment){
                interest = interest.add(loanInfo.getInterest());
                firstInstallment = false;
            }
            loanInstallment.setInterest(interest);
            loanInstallment.setOlb(currentOlb);

            principal = principal.add(installment.getPrincipal());
            accrualStartDate = lastAccrualDate;
            currentOlb = currentOlb.subtract(installment.getPrincipal());
        }

        return loanInstallments;
    }

    private void recalculateInterest(List<Installment> schedule, List<LoanInstallment> installments, RescheduleDto rescheduleDto) {
        final ScheduleGenerator scheduleGenerator = scheduleService.getScheduleByType(rescheduleDto.getScheduleType());
        LocalDate prevData = rescheduleDto.getRescheduleDate();
        final BigDecimal interestRate = rescheduleDto.getInterestRate();

        for (LoanInstallment row: installments) {
            final Installment installment = InstallmentsHelper.getInstallment(schedule, row.getNumber().longValue());

            Long installmentDays = DateHelper.daysBetweenAs_30_360(prevData, row.getMaturityDate());
            row.setInterest(calculateInterest(interestRate, row.getOlb(), installmentDays, scheduleGenerator ));
            row.setMaturityDate(installment.getMaturityDate());
            row.setLastAccrualDate(installment.getMaturityDate());

            prevData = row.getMaturityDate();
        }
    }

    // old*days/(dayInYear*100)
    private BigDecimal calculateInterest(BigDecimal interestRate, BigDecimal olb, Long installmentDays, ScheduleGenerator scheduleGenerator) {
        Integer daysInYear = scheduleGenerator.getIfFact()?DateHelper.getDaysCountInYear(DateHelper.getLocalDateNow().getYear()):360;
        BigDecimal koef = BigDecimal.valueOf(daysInYear).multiply(BigDecimal.valueOf(100L));
        return olb.multiply(interestRate)
                .multiply(BigDecimal.valueOf(installmentDays))
                .divide(koef, ScheduleGenerator.ROUNDING_MODE)
                .setScale(ScheduleGenerator.DECIMAL_PLACE, ScheduleGenerator.ROUNDING_MODE);
    }

    private BigDecimal getTotalPrincipal(@NonNull List<LoanScheduleInstallment> installments) {
        return installments.stream()
                .map(Installment::getPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
