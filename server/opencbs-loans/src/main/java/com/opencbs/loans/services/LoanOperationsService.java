package com.opencbs.loans.services;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.WriteOffCalculateDto;
import com.opencbs.core.dto.WriteOffDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.UserService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.notificators.LoanNotificatorSender;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.repositories.LoanPenaltyEventRepository;
import com.opencbs.loans.repositories.LoanRepository;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import com.opencbs.loans.validators.LoanValidator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class LoanOperationsService {

    private final EventGroupKeyService eventGroupKeyService;
    private final LoanService loanService;
    private final LoanEventService loanEventService;
    private final LoanPenaltyEventRepository loanPenaltyEventRepository;
    private final LoanRepository loanRepository;
    private final LoanValidator loanValidator;
    private final LoanAccountingService loanAccountingService;
    private final LoanPenaltyAccountService loanPenaltyAccountService;
    private final ProvisionService provisionService;
    private final UserService userService;
    private final LoanNotificatorSender loanNotificatorSender;
    private final LoanInstallmentRepository loanInstallmentRepository;


    @Transactional
    public void writeOff(long loanId, WriteOffDto dto, long userId) {
        Loan loan = this.loanService.findOne(loanId).get();
        LoanEvent lastEvent = this.loanEventService.findAllByLoanId(loanId)
                .stream()
                .filter(x -> x.getDeleted().equals(false))
                .max(Comparator.comparing(LoanEvent::getEffectiveAt))
                .get();
        this.loanValidator.writeOffValidation(loan, lastEvent.getEffectiveAt(), dto);
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, dto.getDate().toLocalDate());
        Long groupKey = this.eventGroupKeyService.getNextEventGroupKey();

        if (loanInfo.getOlb().compareTo(dto.getPrincipal()) == 0) {
            loan.setStatus(LoanStatus.WRITTEN_OFF);
            this.loanRepository.save(loan);
        }

        BigDecimal penaltyAmount = dto.getPenalty();
        List<LoanApplicationPenalty> loanApplicationPenalties = loan.getLoanApplication().getLoanApplicationPenalties();
        if (!CollectionUtils.isEmpty(loanApplicationPenalties)) {
            LoanEvent penaltyWriteOffEvent = this.createWriteOffEvent(penaltyAmount, dto, loanId, userId, EventType.WRITE_OFF_PENALTY, groupKey);
            {
                LoanPenaltyEvent loanPenaltyEvent = new LoanPenaltyEvent();
                loanPenaltyEvent.setGroupKey(groupKey);
                loanPenaltyEvent.setComment(dto.getComment());
                loanPenaltyEvent.setAmount(penaltyAmount);
                loanPenaltyEvent.setLoanId(loanId);
                loanPenaltyEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
                loanPenaltyEvent.setEffectiveAt(dto.getDate());
                loanPenaltyEvent.setCreatedById(userId);
                loanPenaltyEvent.setDeleted(false);
                loanPenaltyEvent.setInstallmentNumber(null);
                loanPenaltyEvent.setEventType(EventType.WRITE_OFF_PENALTY);
                loanPenaltyEvent.setLoanApplicationPenaltyId(loanApplicationPenalties.get(0).getId());
                this.loanPenaltyEventRepository.save(loanPenaltyEvent);
            }
            this.loanPenaltyAccountService.createWriteOffPenaltyAccountingEntry(loanApplicationPenalties.get(0), penaltyWriteOffEvent);
            ///TODO Commetn this code becouse need URGENTLY RELEASE IMPACT FINANCE
//            for (LoanApplicationPenalty loanApplicationPenalty: loanApplicationPenalties) {
//                if (penaltyAmount.compareTo(BigDecimal.ZERO) > 0) {
//                    BigDecimal penaltyDue = this.loanService.getDuePenalty(loan, loanApplicationPenalty);
//                    BigDecimal amount = penaltyAmount.compareTo(penaltyDue) < 0 ? penaltyAmount : penaltyDue;
//                    penaltyAmount = penaltyAmount.subtract(amount);
//                    LoanEvent penaltyWriteOffEvent = this.createWriteOffEvent(amount, dto, loanId, userId, EventType.WRITE_OFF_PENALTY, groupKey);
//                    penaltyWriteOffEvent.setComment(String.format("Write Off %s penalty", loanApplicationPenalty.getName()));
//                    if (BigDecimal.ZERO.compareTo(amount)!=0) {
//                        this.loanPenaltyAccountService.createWriteOffPenaltyAccountingEntry(loanApplicationPenalty, penaltyWriteOffEvent);
//                    }
//                }
//            }
        }

        if (BigDecimal.ZERO.compareTo(dto.getInterest())!=0) {
            BigDecimal writeOffAmount = dto.getInterest();
            List<LoanInstallment> installments = this.detachedCopyInstallments(this.loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null));
            List<LoanInstallment> unpaidInstallments = InstallmentsHelper.getUnpaidInstallments(installments);
            for (LoanInstallment installment : unpaidInstallments) {
                BigDecimal interest = installment.getAccruedInterest().subtract(installment.getPaidInterest());
                BigDecimal eventAmount = writeOffAmount.compareTo(interest) <= 0 ? writeOffAmount : interest;

                //alter planned interest
                installment.setInterest(installment.getInterest().subtract(eventAmount));
                installment.setEventGroupKey(groupKey);
                installment.setEffectiveAt(dto.getDate());
                installment.setRescheduled(false);
                this.loanInstallmentRepository.save(installment);

                if (writeOffAmount.compareTo(interest) <= 0) {
                    LoanEvent interestWriteOffEvent = this.createWriteOffInterestEVent(eventAmount, dto, loanId, userId, EventType.WRITE_OFF_INTEREST, groupKey, installment.getNumber());
                    this.loanAccountingService.createWriteOffInterestAccountingEntry(interestWriteOffEvent);
                    break;
                }
                else {
                    LoanEvent interestWriteOffEvent = this.createWriteOffInterestEVent(eventAmount, dto, loanId, userId, EventType.WRITE_OFF_INTEREST, groupKey, installment.getNumber());
                    this.loanAccountingService.createWriteOffInterestAccountingEntry(interestWriteOffEvent);
                    writeOffAmount = writeOffAmount.subtract(interest);
                }
            }
        }

        if (BigDecimal.ZERO.compareTo(dto.getPrincipal())!=0) {
            LoanEvent olbWriteOffEvent = this.createWriteOffEvent(dto.getPrincipal(), dto, loanId, userId, EventType.WRITE_OFF_OLB, groupKey);
            this.loanAccountingService.createWriteOffPrincipalAccountingEntry(olbWriteOffEvent);
        }

        this.provisionService.createReserveByLoanId(loanId, dto.getDate());
    }

    private List<LoanInstallment> detachedCopyInstallments(List<LoanInstallment> installments) {
        return installments.stream()
                .map(LoanInstallment::new)
                .collect(Collectors.toList());
    }

    private LoanEvent createWriteOffEvent(BigDecimal amount, WriteOffDto dto, long loanId, long userId, EventType eventType, Long groupKey) {
        LoanEvent writeOffEvent = this.createLoanEvent(amount, dto.getComment(), loanId, userId, groupKey, dto.getDate());
        writeOffEvent.setEventType(eventType);
        this.loanEventService.save(writeOffEvent);
        return writeOffEvent;
    }

    private LoanEvent createLoanEvent(BigDecimal amount, String comment, long loanId, long userId, Long groupKey, LocalDateTime dateTime) {
        LoanEvent writeOffEvent = new LoanEvent();
        writeOffEvent.setGroupKey(groupKey);
        writeOffEvent.setComment(comment);
        writeOffEvent.setAmount(amount);
        writeOffEvent.setLoanId(loanId);
        writeOffEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        writeOffEvent.setEffectiveAt(dateTime);
        writeOffEvent.setCreatedById(userId);
        writeOffEvent.setDeleted(false);
        writeOffEvent.setInstallmentNumber(null);
        return writeOffEvent;
    }

    private LoanEvent createWriteOffInterestEVent(BigDecimal amount, WriteOffDto dto, long loanId, long userId, EventType eventType, Long groupKey, int installmentNumber) {
        LoanEvent writeOffEvent = this.createWriteOffLoanEvent(amount, dto.getComment(), loanId, userId, groupKey, dto.getDate(), installmentNumber);
        writeOffEvent.setEventType(eventType);
        this.loanEventService.save(writeOffEvent);
        return writeOffEvent;
    }

    private LoanEvent createWriteOffLoanEvent(BigDecimal amount, String comment, long loanId, long userId, Long groupKey, LocalDateTime dateTime, int installmentNumber) {
        LoanEvent writeOffEvent = new LoanEvent();
        writeOffEvent.setGroupKey(groupKey);
        writeOffEvent.setComment(comment);
        writeOffEvent.setAmount(amount);
        writeOffEvent.setLoanId(loanId);
        writeOffEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        writeOffEvent.setEffectiveAt(dateTime);
        writeOffEvent.setCreatedById(userId);
        writeOffEvent.setDeleted(false);
        writeOffEvent.setInstallmentNumber(installmentNumber);
        return writeOffEvent;
    }

    @Transactional
    public void reassignLoanOfficer(@NonNull Collection<Long> listOfLoanIds, @NonNull Long loanOfficerId) {
        if (CollectionUtils.isEmpty(listOfLoanIds)) {
            return;
        }
        final User loanOfficer = this.userService.findById(loanOfficerId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User is not found (ID=%d).", loanOfficerId)));

        listOfLoanIds.forEach( loanId->
            this.loanService.getLoanById(loanId).setLoanOfficer(loanOfficer)
        );
    }

    public WriteOffCalculateDto calculateDto(Long loanId, WriteOffDto dto) {
        WriteOffCalculateDto writeOffCalculateDto = new WriteOffCalculateDto();
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, dto.getDate().toLocalDate());
        writeOffCalculateDto.setPrincipal(loanInfo.getOlb());
        writeOffCalculateDto.setInterest(loanInfo.getInterest());
        writeOffCalculateDto.setPenalty(loanInfo.getPenalty());
        return writeOffCalculateDto;
    }

    public void closing(Loan loan, LocalDateTime effectiveDateTime, Long groupKey) {
        LoanEvent closingEvent = new LoanEvent();
        closingEvent.setEventType(EventType.CLOSED);
        closingEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        closingEvent.setCreatedById(UserHelper.getCurrentUser().getId());
        closingEvent.setEffectiveAt(effectiveDateTime);
        closingEvent.setGroupKey(groupKey);
        closingEvent.setLoanId(loan.getId());
        closingEvent.setAmount(BigDecimal.ZERO);
        loan.setStatus(LoanStatus.CLOSED);

        loanEventService.save(closingEvent);

        this.loanNotificatorSender.senLoanClosedNotification(loan);
    }
}
