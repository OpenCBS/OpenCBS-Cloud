package com.opencbs.loans.services.impl;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;
import com.opencbs.loans.dto.UpdateScheduleStatus;
import com.opencbs.loans.mappers.LoanInstallmentMapper;
import com.opencbs.loans.repositories.LoanApplicationInstallmentRepository;
import com.opencbs.loans.repositories.LoanApplicationRepository;
import com.opencbs.loans.services.LoanApplicationInstallmentsService;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanProductService;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanApplicationInstallmentsServiceImpl implements LoanApplicationInstallmentsService {

    private final static int DAYS_IN_YEAR = 360;

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanApplicationInstallmentRepository loanApplicationInstallmentRepository;
    private final LoanInstallmentMapper installmentMapper;
    private final LoanApplicationService loanApplicationService;
    private final ScheduleService scheduleService;
    private final LoanProductService loanProductService;


    @Override
    @Transactional
    public ScheduleDto preview(@NonNull Long loanApplicationId, @NonNull List<Installment> installments) {
        LoanApplication loanApplication = loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new RuntimeException("Loan application not found: " + loanApplicationId));

        if (isScheduleNotChanged(loanApplication, installments)) {
            return installmentMapper.toDto(installments, loanApplication.getAmount(), UpdateScheduleStatus.VALID);
        }

        installments = rebuildSchedule(loanApplication, installments);
        return installmentMapper.toDto(
                installments,
                loanApplication.getAmount(),
                getUpdatedStatus(installments, loanApplication.getAmount())
        );
    }

    private UpdateScheduleStatus getUpdatedStatus(List<Installment> installments, BigDecimal loanAmount) {
        if (getTotalPrincipal(installments).compareTo(loanAmount) != 0 ) {
            return UpdateScheduleStatus.WRONG_TOTAL_AMOUNT;
        }

        if (!isValidMaturityDates(installments)) {
            return UpdateScheduleStatus.WRONG_MATURITY_DATA;
        }

        return UpdateScheduleStatus.VALID;
    }

    private boolean isValidMaturityDates(List<Installment> installments) {
        LocalDate prevMaturityData = LocalDate.MIN;
        for (Installment installment: installments) {
            if (DateHelper.greaterOrEqual(prevMaturityData, installment.getMaturityDate())) {
                return false;
            }
            prevMaturityData = installment.getMaturityDate();
        };

        return true;
    }

    @Override
    @Transactional
    public ScheduleDto update(@NonNull Long loanApplicationId, @NonNull List<Installment> installments) {
        LoanApplication loanApplication = loanApplicationRepository.findById(loanApplicationId)
                .orElseThrow(() -> new RuntimeException("Loan application not found: " + loanApplicationId));

        if (isScheduleNotChanged(loanApplication, installments)) {
            return installmentMapper.toDto(installments, loanApplication.getAmount(), UpdateScheduleStatus.VALID);
        }


        validate(loanApplication, installments);
        installments = rebuildSchedule(loanApplication, installments);

        updateLoanInstallments(installments, loanApplication);
        markScheduleManuallyEdited(loanApplication);

        return installmentMapper.toDto(installments, loanApplication.getAmount(), UpdateScheduleStatus.VALID);
    }

    private void validate(@NonNull LoanApplication loanApplication, @NonNull List<Installment> installments) {
        if (installments.stream().anyMatch(x -> BigDecimal.ZERO.compareTo(x.getPrincipal()) > 0)) {
            throw new RuntimeException("Negative principal was specified");
        }

        if (installments.stream().anyMatch(x -> BigDecimal.ZERO.compareTo(x.getInterest()) > 0)) {
            throw new RuntimeException("Zero interest was specified");
        }


        Assert.isTrue(installments.size() == loanApplication.getInstallments().size(),
                "Incorrect count of installments");

        BigDecimal installmentsAmount = installments.stream()
                .map(Installment::getPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Assert.isTrue(installmentsAmount.compareTo(loanApplication.getAmount()) == 0, "Loan amount not equal installments principal");
    }

    private boolean isScheduleNotChanged(@NonNull LoanApplication loanApplication, @NonNull List<Installment> installments)  {
        for (LoanApplicationInstallment loanInstallment : loanApplication.getInstallments()) {
            Installment installment = installments.stream().filter(x -> x.getNumber() == loanInstallment.getNumber())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Installment not found: " + loanInstallment.getNumber()));

            if (installment.getPrincipal().compareTo(loanInstallment.getPrincipal()) != 0 ||
                    !DateHelper.equal(installment.getMaturityDate(),loanInstallment.getMaturityDate())) {
                return false;
            }
        }

        return true;
    }

    private void markScheduleManuallyEdited(@NonNull LoanApplication application) {
        application.setScheduleManualEdited(Boolean.TRUE);
        application.setScheduleManualEditedAt(LocalDateTime.now());
        application.setScheduleManualEditedBy(UserHelper.getCurrentUser());

        loanApplicationRepository.save(application);
    }

    private void updateLoanInstallments(@NonNull List<Installment> installments, @NonNull LoanApplication loanApplication) {
        for (LoanApplicationInstallment loanInstallment : loanApplication.getInstallments()) {
            Installment installment = installments.stream().filter(x -> x.getNumber() == loanInstallment.getNumber())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Installment not found: " + loanInstallment.getNumber()));

            loanInstallment.setInterest(installment.getInterest());
            loanInstallment.setPrincipal(installment.getPrincipal());
            loanInstallment.setOlb(installment.getOlb());
            loanInstallment.setMaturityDate(installment.getMaturityDate());
            loanInstallment.setLastAccrualDate(installment.getMaturityDate());
            loanApplicationInstallmentRepository.save(loanInstallment);
        }
    }

    private List<Installment> rebuildSchedule(@NonNull LoanApplication loanApplication, @NonNull List<Installment> installments) {
        ScheduleParams params = createScheduleParams(loanApplication, installments);
        final List<Installment> schedule = scheduleService.getSchedule(params);


        recalculateInterest(schedule, installments, params);

        return schedule;
    }

    private void recalculateInterest(List<Installment> schedule, List<Installment> installments, ScheduleParams params) {
        LocalDate prevData = params.getDisbursementDate();
        final BigDecimal interestRate = params.getInterestRate();

        for (Installment row: schedule) {
            final Installment installment = InstallmentsHelper.getInstallment(installments, row.getNumber());
            row.setInterest(calculateInterest(prevData, installment.getMaturityDate(), row.getOlb(), interestRate));
            row.setMaturityDate(installment.getMaturityDate());
            row.setLastAccrualDate(installment.getMaturityDate());

            prevData = installment.getMaturityDate();
        }
    }

    private BigDecimal calculateInterest(LocalDate from, LocalDate to, BigDecimal amount, BigDecimal interestRate ) {
        final BigDecimal days = BigDecimal.valueOf(DateHelper.daysBetweenAs_30_360(from, to));
        final BigDecimal interest = amount.multiply(interestRate).multiply(days).divide(BigDecimal.valueOf(360*100L), 2, RoundingMode.HALF_EVEN);

        return interest;
    }

    private BigDecimal getTotalPrincipal(@NonNull List<Installment> installments) {
        return installments.stream()
                .map(Installment::getPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private ScheduleParams createScheduleParams(@NonNull LoanApplication application, @NonNull List<Installment> installments) {
        LoanProduct product = loanProductService
                .getOne(application.getLoanProduct().getId())
                .orElseThrow(() -> new RuntimeException("Loan product not found for application: " + application.getId()));

        return ScheduleParams.builder()
                .amount(application.getAmount())
                .maturity(application.getMaturity())
                .gracePeriod(application.getGracePeriod())
                .disbursementDate(application.getDisbursementDate())
                .preferredRepaymentDate(application.getPreferredRepaymentDate())
                .scheduleType(application.getScheduleType())
                .scheduleBasedType(product.getScheduleBasedType())
                .interestRate(application.getInterestRate())
                .maturityDate(application.getMaturityDate())
                .installmentPrincipals(
                        installments.stream()
                                .collect(Collectors.toMap(Installment::getNumber,
                                        Installment::getPrincipal))
                )
                .build();
    }
}
