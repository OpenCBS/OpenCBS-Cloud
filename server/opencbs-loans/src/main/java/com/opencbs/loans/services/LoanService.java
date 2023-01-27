package com.opencbs.loans.services;

import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.repositories.LoanRepository;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.script.ScriptException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Lazy
@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanEventService loanEventService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final LoanCodeGenerator loanCodeGenerator;
    private final LoanAccountService loanAccountService;
    private final LoanPenaltyAccountService loanPenaltyAccountService;
    private final LoanPenaltyEventService loanPenaltyEventService;


    public Page<Loan> findAll(Pageable pageable) {
        return this.loanRepository.findAll(pageable);
    }

    public Page<SimplifiedLoan> findAllLoans(String searchString, Pageable pageable) {
        return this.loanRepository.findAllLoans(searchString, pageable);
    }

    public Loan getLoanById(Long loanId) throws ResourceNotFoundException {
        return this.findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found (ID=%d).", loanId)));
    }

    public Optional<Loan> findOne(Long id) {
        return Optional.ofNullable(this.loanRepository.findOne(id));
    }

    public void save(Loan loan) {
        this.loanRepository.save(loan);
    }

    public Loan getByLoanApplication (LoanApplication loanApplication) {
        return this.loanRepository.findByLoanApplication(loanApplication)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan with loan application id not found (ID=%d).", loanApplication.getId())));
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public Loan create(Loan loan) throws ScriptException, ResourceNotFoundException {
        loan.setId(null);
        this.createLoanPenaltyAccounts(loan);
        Loan savedLoan = this.saveLoan(loan);

        this.loanAccountService.createLoanAccounts(savedLoan);
        return savedLoan;
    }

    private Loan saveLoan(Loan loan) throws ScriptException, ResourceNotFoundException {
        loan.setCode("");
        loan = this.loanRepository.save(loan);
        loan.setCode(this.loanCodeGenerator.generateCode(loan));
        return this.loanRepository.save(loan);
    }

    public List<LoanInstallment> getInstallmentsByLoanAndEventGroupKeys(Long loanId, Collection<Long> eventGroupKeys) {
        Loan loan = this.loanRepository.findOne(loanId);
        if (loan == null) {
            throw new NullPointerException(String.format("The loan is not found (ID = %d)", loanId));
        }

        return this.loanInstallmentRepository.findByLoanIdAndEventGroupKeyInAndDeletedFalse(loanId, eventGroupKeys);
    }

    public List<LoanInstallment> getInstallmentsByLoan(Long loanId, LocalDateTime effectiveAt, boolean reschedule, boolean rollback) {
        Loan loan = this.loanRepository.findOne(loanId);
        if (loan == null) {
            throw new NullPointerException(String.format("The loan is not found (ID = %d)", loanId));
        }

        List<LoanInstallment> allByLoan = this.loanInstallmentRepository.findAllByLoanIdAndEffectiveAtAndDeleted(loanId, effectiveAt, false);
        Map<Integer, List<LoanInstallment>> collect = allByLoan
                .stream()
                .collect(Collectors.groupingBy(LoanInstallment::getNumber));

        List<LoanInstallment> loanInstallments = new ArrayList<>();
        if (rollback) {
            loanInstallments.addAll(allByLoan);
        }
        else {
            for (Map.Entry<Integer, List<LoanInstallment>> numberOfInstallment : collect.entrySet()) {
                loanInstallments.add(
                        numberOfInstallment
                                .getValue()
                                .stream()
                                .max(Comparator
                                        .comparing(LoanInstallment::getId)
                                        .thenComparing(LoanInstallment::getEventGroupKey))
                                .get());
            }
        }

        if (!reschedule) {
            loanInstallments = loanInstallments
                    .stream()
                    .filter(installment -> installment.getRescheduled().equals(false))
                    .collect(Collectors.toList());
        }
        loanInstallments.sort(Comparator.comparing(LoanInstallment::getNumber));
        this.setStartAndAccrualStartDate(loanInstallments, loan);
        this.setAccrualInterest(loanInstallments, loanId, effectiveAt);
        return loanInstallments;
    }

    public List<Loan> findAllByProfile(Profile profile) {
        return this.loanRepository.findAllByProfile(profile);
    }

    public Loan update(Loan loan) throws ScriptException, ResourceNotFoundException {
        this.createLoanPenaltyAccounts(loan);
        return this.saveLoan(loan);
    }

    public List<LoanInstallment> findSchedule(Long loanId) {
        return this.getInstallmentsByLoan(loanId, null, false, false);
    }

    private void setStartAndAccrualStartDate(List<LoanInstallment> loanInstallments, Loan loan) {
        if (loanInstallments != null) {
            for (int i = 0; i < loanInstallments.size(); i++) {
                if (i == 0) {
                    LoanInstallment loanInstallment = loanInstallments.get(i);
                    loanInstallment.setStartDate(loan.getDisbursementDate());
                    loanInstallment.setAccrualStartDate(loan.getDisbursementDate());
                } else {
                    LoanInstallment loanInstallment = loanInstallments.get(i);
                    LoanInstallment lastLoanInstallment = loanInstallments.get(i - 1);
                    loanInstallment.setStartDate(lastLoanInstallment.getMaturityDate());
                    loanInstallment.setAccrualStartDate(lastLoanInstallment.getLastAccrualDate());
                }
            }
        }
    }

    private void setAccrualInterest(List<LoanInstallment> loanInstallments, Long loanId, LocalDateTime effectiveAt) {
        Function<List<LoanEvent>, Map<Integer, BigDecimal>> getAccruals = listOfEvents -> {
            Map<Integer, List<LoanEvent>> groupedLoanEvents = listOfEvents.stream().collect(Collectors.groupingBy(LoanEvent::getInstallmentNumber));
            Map<Integer, BigDecimal> groupedAmount = new HashMap<>();
            for (Map.Entry<Integer, List<LoanEvent>> number : groupedLoanEvents.entrySet()) {
                groupedAmount.put(number.getKey(), number.getValue().stream().map(LoanEvent::getAmount).reduce(BigDecimal::add).orElse(BigDecimal.ZERO));
            }
            return groupedAmount;
        };

        Function<List<LoanEvent>, Map<Integer, BigDecimal>> getWriteOff = listOfEvents -> {
            Map<Integer, List<LoanEvent>> groupedLoanEvents = listOfEvents.stream().collect(Collectors.groupingBy(LoanEvent::getInstallmentNumber));
            Map<Integer, BigDecimal> groupedAmount = new HashMap<>();
            for (Map.Entry<Integer, List<LoanEvent>> number : groupedLoanEvents.entrySet()) {
                groupedAmount.put(number.getKey(), number.getValue().stream().map(LoanEvent::getAmount).reduce(BigDecimal::add).orElse(BigDecimal.ZERO));
            }
            return groupedAmount;
        };

        //Get all accrued interest events
        List<LoanEvent> accrualInterestEvents = this.loanEventService.findAllByLoanIdAndDeletedAndEventTypeAndDate(loanId, false, EventType.ACCRUAL_OF_INTEREST, effectiveAt);
        List<LoanEvent> writeOffEvents = this.loanEventService.findAllByLoanIdAndDeletedAndEventTypeAndDate(loanId, false, EventType.WRITE_OFF_INTEREST, effectiveAt);
        if (accrualInterestEvents.isEmpty()) {
            loanInstallments.forEach(installment -> installment.setAccruedInterest(BigDecimal.ZERO));
        } else {
            Map<Integer, BigDecimal> accrualInterestAmounts = getAccruals.apply(accrualInterestEvents);
            Map<Integer, BigDecimal> writeOffInterestAmounts = getWriteOff.apply(writeOffEvents);
            if (writeOffEvents.isEmpty()) {
                loanInstallments.forEach(installment -> {
                    if (accrualInterestAmounts.containsKey(installment.getNumber())) {
                        installment.setAccruedInterest(accrualInterestAmounts.get(installment.getNumber()));
                    } else {
                        installment.setAccruedInterest(BigDecimal.ZERO);
                    }
                });
            }
            else {
                loanInstallments.forEach(installment -> {
                    if (accrualInterestAmounts.containsKey(installment.getNumber()) && writeOffInterestAmounts.containsKey(installment.getNumber())) {
                        installment.setAccruedInterest(accrualInterestAmounts.get(installment.getNumber()).subtract(writeOffInterestAmounts.get(installment.getNumber())));
                    }
                    else if (accrualInterestAmounts.containsKey(installment.getNumber())) {
                        installment.setAccruedInterest(accrualInterestAmounts.get(installment.getNumber()));
                    }
                    else {
                        installment.setAccruedInterest(BigDecimal.ZERO);
                    }
                });
            }
        }
    }

    public Loan findByLoanApplicationIdAndProfileId(Long loanApplicationId, Long profileId) {
        return this.loanRepository.findByLoanApplicationIdAndProfileId(loanApplicationId, profileId);
    }

    public List<Loan> findAllByLoanApplication(LoanApplication loanApplication) {
        return this.loanRepository.findAllByLoanApplication(loanApplication);
    }

    public List<Loan> findAllActiveByProfile(Profile profile){
        List<Loan> allProfilesLoans = this.loanRepository.findAllByProfile(profile)
                .stream()
                .filter(x -> !LoanStatus.PENDING.equals(x.getStatus()))
                .sorted(Comparator.comparing(Loan::getCreatedAt))
                .collect(Collectors.toList());
        return allProfilesLoans;
    }

    public LoanAdditionalInfo getAdditionalInfo(Long loanId) throws Exception {
        LoanAdditionalInfo additionalInfo = this.loanRepository.getAdditionalInfo(loanId);
        additionalInfo.setLastActualizeDate(ActualizeHelper.getLastActualizeDate(loanId, ModuleType.LOANS));
        additionalInfo.setPenalty(this.loanPenaltyEventService.getPenaltyAmounts(loanId, DateHelper.getLocalDateNow()).stream()
                .map(LoanPenaltyAmount::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return additionalInfo;
    }

    public List<Long> getActiveLoanIds(Branch branch) {
        return this.loanRepository.findIdsWhenLoanHasStatus(LoanStatus.ACTIVE, branch);
    }

    private void createLoanPenaltyAccounts(Loan loan) {
        List<LoanApplicationPenalty> loanApplicationPenalties = loan.getLoanApplication().getLoanApplicationPenalties();
        if (CollectionUtils.isEmpty(loanApplicationPenalties)) {
            return;
        }

        for (LoanApplicationPenalty loanApplicationPenalty: loanApplicationPenalties){
            LoanPenaltyAccount loanPenaltyAccount = this.loanPenaltyAccountService.createLoanPenaltyAccount(loanApplicationPenalty);
            loanPenaltyAccount.setLoan(loan);
            loan.getLoanPenaltyAccountList().add(loanPenaltyAccount);
        }
    }

    public BigDecimal getDuePenalty(Loan loan, LoanApplicationPenalty loanApplicationPenalty) {
        BigDecimal accrualPenalty = this.loanEventService.findAllByLoanIdAndDeletedAndEventType(loan.getId(), false, EventType.ACCRUAL_OF_PENALTY).stream()
                .filter(loanEvent->loanApplicationPenalty.getName().compareToIgnoreCase(loanEvent.getExtra().get(LoanPenaltyAccountService.PENALTY_NAME_KEY).toString())==0)
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);

        BigDecimal paidPenalty = this.loanEventService.findAllByLoanIdAndDeletedAndEventType(loan.getId(), false, EventType.REPAYMENT_OF_PRINCIPAL).stream()
                .filter(loanEvent->loanApplicationPenalty.getName().compareToIgnoreCase(loanEvent.getExtra().get(LoanPenaltyAccountService.PENALTY_NAME_KEY).toString())==0)
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);

        return accrualPenalty.subtract(paidPenalty);
    }

    public LoanInfo getLoanInfo(@NonNull Long loanId, LocalDate date) {
        final List<LoanInstallment> installments = this.getInstallmentsByLoan(loanId, LocalDateTime.of(date, LocalTime.MAX), false, false);

        return LoanInfo.builder()
                .principal(this.sum(installments,LoanInstallment::getPrincipal))
                .paidPrincipal(this.sum(installments,LoanInstallment::getPaidPrincipal))
                .interest(this.sum(installments, LoanInstallment::getAccruedInterest))
                .paidInterest(this.sum(installments, LoanInstallment::getPaidInterest))
                .penalty(this.loanPenaltyEventService.getPenaltyAmount(loanId, date))
                .lateDaysOfPrincipal(this.lastDayOfPrincipal(installments, date))
                .lateDaysOfInterest(this.lastDayOfInterest(installments, date))
                .lateDaysOfPenalty(this.lastDayOfPenalty(installments, date))
                .plannedOlb(installments.stream()
                        .filter(x -> DateHelper.greater(x.getMaturityDate(), date) && !x.isPaid())
                        .min(Comparator.comparing(BaseInstallment::getNumber))
                        .map(LoanInstallment::getOlb)
                        .orElse(BigDecimal.ZERO))
                .nextPlanedPaymentDate(InstallmentsHelper.getNextPaymentDate(installments, date).orElse(LocalDate.now()))
                .build();
    }

    private Long lastDayOfPrincipal(List<LoanInstallment> installments, LocalDate date) {
        LocalDate lateMaturityDate = installments.stream()
                .filter(i -> i.getPrincipalDue().compareTo(BigDecimal.ZERO) != 0)
                .map(LoanInstallment::getMaturityDate)
                .min(Comparator.comparing(LocalDate::toEpochDay)).orElse(date);

        Long diff = DateHelper.daysBetween(lateMaturityDate, date);
        return (diff>0L)? diff: 0;
    }

    private Long lastDayOfInterest(List<LoanInstallment> installments, LocalDate date) {
        LocalDate lateMaturityDate = installments.stream()
                .filter(i -> i.getInterestDue().compareTo(BigDecimal.ZERO) != 0)
                .map(LoanInstallment::getMaturityDate)
                .min(Comparator.comparing(LocalDate::toEpochDay)).orElse(date);

        Long diff = DateHelper.daysBetween(lateMaturityDate, date);
        return (diff>0L)? diff: 0;
    }

    private Long lastDayOfPenalty(List<LoanInstallment> installments, LocalDate date) {
        LocalDate lateMaturityDate = installments.stream()
                .filter(i -> i.getPenaltyDue().compareTo(BigDecimal.ZERO) != 0)
                .map(LoanInstallment::getMaturityDate)
                .min(Comparator.comparing(LocalDate::toEpochDay)).orElse(date);

        Long diff = DateHelper.daysBetween(lateMaturityDate, date);
        return (diff>0L)? diff: 0;
    }

    private BigDecimal sum(List<LoanInstallment> schedule, Function<LoanInstallment, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }

    public List<Loan> getAllLoansByCodeIn(List<String> codes){
        return loanRepository.findAllByCodeIn(codes);
    }

    public Loan getLoanByCode(String code){
        return loanRepository.findByCode(code);
    }

    public Optional<LoanInstallment> getActiveLoanInstallmentByLoan(Long loanId, LocalDate requiredDate){
        List<LoanInstallment> loanInstallments = getInstallmentsByLoan(loanId, null, false, false);
        return loanInstallments.stream().filter(x -> x.getMaturityDate().equals(requiredDate)).findAny();
    }
}
