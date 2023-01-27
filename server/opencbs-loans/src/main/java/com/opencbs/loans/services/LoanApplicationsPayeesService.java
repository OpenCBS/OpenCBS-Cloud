package com.opencbs.loans.services;

import com.opencbs.core.domain.Payee;
import com.opencbs.core.domain.PayeeEvent;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.repositories.implementations.PayeeEventGroupKeyRepository;
import com.opencbs.core.services.PayeeEventService;
import com.opencbs.core.services.PayeeService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanApplicationEntryFee;
import com.opencbs.loans.domain.LoanApplicationPayees;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesDto;
import com.opencbs.loans.mappers.LoanApplicationPayeeMapper;
import com.opencbs.loans.repositories.LoanApplicationPayeeRepository;
import com.opencbs.loans.repositories.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class LoanApplicationsPayeesService {

    private final LoanApplicationPayeeRepository loanApplicationPayeeRepository;
    private final LoanApplicationPayeeMapper loanApplicationPayeeMapper;
    private final LoanApplicationRepository loanApplicationRepository;
    private final PayeeService payeeService;
    private final PayeeEventGroupKeyRepository payeeEventGroupKeyRepository;
    private final PayeeEventService payeeEventService;

    public LoanApplicationsPayeesService(LoanApplicationPayeeRepository loanApplicationPayeeRepository,
                                         LoanApplicationPayeeMapper loanApplicationPayeeMapper,
                                         LoanApplicationRepository loanApplicationRepository,
                                         PayeeService payeeService,
                                         PayeeEventGroupKeyRepository payeeEventGroupKeyRepository,
                                         PayeeEventService payeeEventService) {
        this.loanApplicationPayeeRepository = loanApplicationPayeeRepository;
        this.loanApplicationPayeeMapper = loanApplicationPayeeMapper;
        this.loanApplicationRepository = loanApplicationRepository;
        this.payeeService = payeeService;
        this.payeeEventGroupKeyRepository = payeeEventGroupKeyRepository;
        this.payeeEventService = payeeEventService;
    }

    @Transactional
    public LoanApplicationPayees update(LoanApplicationPayees loanApplicationPayees) {
        return this.loanApplicationPayeeRepository.save(loanApplicationPayees);
    }

    public Optional<LoanApplicationPayees> getById(long id) {
        return Optional.ofNullable(this.loanApplicationPayeeRepository.findOne(id));
    }

    @Transactional
    public void createLoanApplicationPayee(Long loanApplicationId, LoanApplicationPayeesDto loanApplicationPayeesDto, Long payeeId) throws Exception {
        Payee payee = this.payeeService.findOne(payeeId).orElseThrow(() -> new Exception("Payee not found"));
        LoanApplication loanApplication = this.loanApplicationRepository.findOne(loanApplicationId);

        LoanApplicationPayees loanApplicationPayee = this.loanApplicationPayeeMapper.mapToEntity(loanApplicationPayeesDto);
        loanApplicationPayee.setLoanApplication(loanApplication);
        loanApplicationPayee.setPayee(payee);
        loanApplicationPayee.setStatus(LoanApplicationPayeeStatus.PENDING);

        BigDecimal sumOfPayees = loanApplication.getLoanApplicationPayees().stream()
                .filter(x -> x.getClosedAt() == null)
                .map(LoanApplicationPayees::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal sumOfEntryFee = loanApplication.getLoanApplicationEntryFees().stream()
                .map(LoanApplicationEntryFee::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal limitAmount = loanApplication.getAmount().subtract(sumOfEntryFee).subtract(sumOfPayees);
        limitAmount = limitAmount.setScale(2, RoundingMode.CEILING);

        if(limitAmount.compareTo(BigDecimal.ZERO) < 0)
            throw new Exception("You can't add more payee. Sum of payees > loan application amount.");
        if(limitAmount.compareTo(BigDecimal.ZERO) == 0)
            throw new Exception("You can't add more payee. Sum of payees and loan application amount already equal.");

        if(loanApplication.getAmount().compareTo(sumOfPayees.add(loanApplicationPayee.getAmount())) < 0)
            throw new Exception("You can add only " + limitAmount + " for new payee.");

        this.update(loanApplicationPayee);
        this.loanApplicationRepository.save(loanApplication);
    }

    @Transactional
    public void deleteLoanApplicationPayee(Long loanApplicationPayeesId, User currentUser) {
        LoanApplicationPayees loanApplicationPayee = this.getById(loanApplicationPayeesId).orElseThrow(() -> new RuntimeException("Loan application payee not found"));
        if(loanApplicationPayee.getStatus() == LoanApplicationPayeeStatus.DISBURSED)
            throw new RuntimeException("Loan application payee already disbursed.");
        loanApplicationPayee.setClosedAt(DateHelper.getLocalDateTimeNow());
        loanApplicationPayee.setClosedBy(currentUser);
        loanApplicationPayee.setStatus(LoanApplicationPayeeStatus.DELETED);

        this.update(loanApplicationPayee);
    }

    @Transactional
    public void createLoanApplicationPayeeDisbursementEvent(LoanApplicationPayees payee, User currentUser, String check) {
        PayeeEvent payeeEvent = new PayeeEvent();
        payeeEvent.setEventType(EventType.DISBURSEMENT);
        payeeEvent.setEffectiveAt(payee.getDisbursementDate().atTime(DateHelper.getLocalTimeNow()));
        payeeEvent.setCheckNumber(check);
        this.createLoanApplicationPayeeBaseEvent(payee, payeeEvent, currentUser);
    }

    @Transactional
    public void createLoanApplicationPayeeRefundEvent(LoanApplicationPayees payee, User currentUser, LoanApplicationPayeesDto dto) {
        PayeeEvent payeeEvent = new PayeeEvent();
        payeeEvent.setEventType(EventType.REFUND);
        payeeEvent.setEffectiveAt(dto.getDisbursementDate().atTime(DateHelper.getLocalTimeNow()));
        payeeEvent.setDescription(dto.getDescription());
        this.createLoanApplicationPayeeBaseEvent(payee, payeeEvent, currentUser);
    }

    private void createLoanApplicationPayeeBaseEvent(LoanApplicationPayees payee, PayeeEvent payeeEvent, User currentUser) {
        payeeEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        payeeEvent.setCreatedBy(currentUser);
        payeeEvent.setGroupKey(this.payeeEventGroupKeyRepository.getNextEventGroupKey());
        payeeEvent.setLoanApplicationPayeeId(payee.getId());
        payeeEvent.setAmount(payee.getAmount());
        this.payeeEventService.save(payeeEvent);
    }
}
