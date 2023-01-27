package com.opencbs.loans.services;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.OtherFeeDto;
import com.opencbs.core.dto.OtherFeeParamsDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.mappers.OtherFeeMapper;
import com.opencbs.core.repositories.OtherFeeRepository;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.OtherFeeService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import lombok.NonNull;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.opencbs.core.domain.enums.EventType.OTHER_FEE_CHARGE;
import static com.opencbs.core.domain.enums.EventType.OTHER_FEE_REPAY;
import static com.opencbs.core.domain.enums.EventType.OTHER_FEE_WAIVE_OFF;

@Service
public class LoanOtherFeeService extends OtherFeeService {
    private final LoanEventService loanEventService;
    private final LoanService loanService;
    private final LoanAccountingService loanAccountingService;

    public LoanOtherFeeService(OtherFeeRepository otherFeeRepository,
                               EventGroupKeyService eventGroupKeyService,
                               OtherFeeMapper otherFeeMapper,
                               LoanService loanService,
                               LoanEventService loanEventService,
                               LoanAccountingService loanAccountingService) {

        super(otherFeeRepository, eventGroupKeyService, otherFeeMapper);
        this.loanService = loanService;
        this.loanEventService = loanEventService;
        this.loanAccountingService = loanAccountingService;

    }

    public PageImpl<OtherFeeDto> getAll(Pageable pageable, long id) {
        List<OtherFeeDto> otherFeeList = this.otherFeeRepository.findAll()
                .stream()
                .map(x -> {
                    OtherFeeDto otherFeeDto = this.otherFeeMapper.mapToOtherFeeDetailDto(x);
                    BigDecimal balance = this.getOtherFeeLoanBalance(id, x.getId());
                    boolean isCharged = this.isCharged(id, x.getId());
                    otherFeeDto.setBalance(balance);
                    otherFeeDto.setCharged(isCharged);
                    return otherFeeDto;
                })
                .collect(Collectors.toList());
        return new PageImpl<>(otherFeeList, pageable, otherFeeList.size());
    }


    private boolean isCharged(long loanId, long otherFeeId) {
        return this.loanEventService.findAllByLoanId(loanId)
                .stream()
                .filter(x -> x.getOtherFee() != null)
                .anyMatch(x -> x.getEventType().equals(OTHER_FEE_CHARGE)
                        && x.getOtherFee().getId() == otherFeeId
                        && !x.getDeleted());
    }

    @Transactional
    public LoanEvent charge(Long loanId, Long otherFeeId, OtherFeeParamsDto dto, User currentUser) {
        LoanEvent loanEvent = this.createLoanEvent(loanId, otherFeeId, dto.getAmount(), currentUser, dto.getDate(), dto.getComment(), OTHER_FEE_CHARGE);
        this.loanAccountingService.chargeOtherFee(loanEvent, currentUser);
        return loanEvent;
    }

    @Transactional
    public LoanEvent repay(Long loanId, Long otherFeeId, OtherFeeParamsDto dto, User currentUser) {
        Loan loan = this.loanService.findOne(loanId).get();
        LoanEvent loanEvent = this.createLoanEvent(loanId, otherFeeId, dto.getAmount(), currentUser, dto.getDate(), dto.getComment(), OTHER_FEE_REPAY);
        this.loanAccountingService.repayOtherFee(loanEvent, currentUser, loan);
        return loanEvent;
    }

    @Transactional
    public LoanEvent waiveOff(Long loanId, Long otherFeeId, OtherFeeParamsDto dto, User currentUser) {
        LoanEvent loanEvent = this.createLoanEvent(loanId, otherFeeId, dto.getAmount(), currentUser, dto.getDate(), dto.getComment(), OTHER_FEE_WAIVE_OFF);
        this.loanAccountingService.waiveOffOtherFee(loanEvent, currentUser);
        return loanEvent;
    }

    public BigDecimal getOtherFeeLoanBalance(Long loanId, Long otherFeeId) {
        BigDecimal charged = this.getAmountByEventType(loanId, otherFeeId, OTHER_FEE_CHARGE);
        BigDecimal paid = this.getAmountByEventType(loanId, otherFeeId, OTHER_FEE_REPAY);
        BigDecimal waivedOff = this.getAmountByEventType(loanId, otherFeeId, OTHER_FEE_WAIVE_OFF);

        return charged.subtract(paid).subtract(waivedOff);
    }

    private BigDecimal getAmountByEventType(@NonNull Long loanId, @NonNull Long otherFeeId, @NonNull EventType otherFeeEventType) {
        return this.loanEventService.findAllByLoanIdAndDeletedAndEventType(loanId, false, otherFeeEventType)
                .stream()
                .filter(x -> x.getOtherFee() != null && otherFeeId.equals(x.getOtherFee().getId()))
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private LoanEvent createLoanEvent(Long loanId, Long otherFeeId, BigDecimal amount, User currentUser, LocalDateTime date, String comment, EventType eventType) {
        LoanEvent loanEvent = new LoanEvent();
        loanEvent.setComment(comment);
        loanEvent.setLoanId(loanId);
        loanEvent.setAmount(amount);
        loanEvent.setEffectiveAt(date);
        loanEvent.setDeleted(false);
        loanEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        loanEvent.setCreatedById(currentUser.getId());
        loanEvent.setOtherFee(this.getById(otherFeeId).get());
        loanEvent.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        loanEvent.setEventType(eventType);
        this.loanEventService.save(loanEvent);
        return loanEvent;
    }
}
