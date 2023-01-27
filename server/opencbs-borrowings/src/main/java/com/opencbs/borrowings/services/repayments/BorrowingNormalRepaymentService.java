package com.opencbs.borrowings.services.repayments;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.services.BorrowingAccountingService;
import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("unused")
public class BorrowingNormalRepaymentService extends BorrowingRepaymentBaseService implements BorrowingRepaymentService {

    @Autowired
    public BorrowingNormalRepaymentService(
            BorrowingRepaymentStoreService borrowingRepaymentStoreService,
            BorrowingAccountingService borrowingAccountingService,
            BorrowingService borrowingService) {
        super(borrowingRepaymentStoreService,
                borrowingAccountingService,
                borrowingService);
    }

    @Override
    public RepaymentSplit split(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser) {
        if (repaymentSplit.getTotal() == null) {
            return this.getParts(borrowing, repaymentSplit.getTimestamp());
        } else {
            return this.splitTotal(borrowing, repaymentSplit.getTimestamp(), repaymentSplit.getTotal());
        }
    }

    @Override
    protected RepaymentResult repayImpl(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser, boolean persist) {
        LocalDateTime timestamp = repaymentSplit.getTimestamp();
        List<BorrowingInstallment> installments = this
                .borrowingService.getInstallmentsByBorrowing(borrowing, LocalDateTime.now()).stream()
                .sorted(Comparator.comparing(BorrowingInstallment::getNumber))
                .collect(Collectors.toList());

        List<BorrowingInstallment> unpaidInstallments = installments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());

        Set<Integer> affectedNumbers = new HashSet<>();
        List<BorrowingEvent> events = new ArrayList<>();
        List<AccountingEntry> accountingEntries = new ArrayList<>();

        BigDecimal total = repaymentSplit.getTotal();

        BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> interestHandler = (i, amount) -> {

            BigDecimal interest = i.getInterestDue().compareTo(amount) > 0 ? amount : i.getInterestDue();
            if (interest.compareTo(BigDecimal.ZERO) == 0) return amount;
            i.setPaidInterest(i.getPaidInterest().add(interest));

            if (persist) {
                BorrowingEvent event = this.getRepaymentOfInterestEvent(i.getNumber(), interest);
                affectedNumbers.add(i.getNumber());
                event.setBorrowingId(borrowing.getId());
                event.setCreatedById(currentUser.getId());
                event.setEffectiveAt(repaymentSplit.getTimestamp());
                List<AccountingEntry> repaymentOfInterestAccountingEntry;
                repaymentOfInterestAccountingEntry = this.getRepaymentOfInterestAccountingEntry(event);
                event.setAccountingEntry(repaymentOfInterestAccountingEntry);
                events.add(event);
                accountingEntries.addAll(repaymentOfInterestAccountingEntry);
            }

            return amount.subtract(interest);
        };

        BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> principalHandler = (i, amount) -> {

            BigDecimal principal = i.getPrincipalDue().compareTo(amount) > 0 ? amount : i.getPrincipalDue();
            if (principal.compareTo(BigDecimal.ZERO) == 0) return amount;
            i.setPaidPrincipal(i.getPaidPrincipal().add(principal));

            if (persist) {
                BorrowingEvent event = this.getRepaymentOfPrincipalEvent(i.getNumber(), principal);
                affectedNumbers.add(i.getNumber());
                event.setBorrowingId(borrowing.getId());
                event.setCreatedById(currentUser.getId());
                event.setEffectiveAt(repaymentSplit.getTimestamp());
                List<AccountingEntry> repaymentOfPrincipalAccountingEntry;
                repaymentOfPrincipalAccountingEntry = this.getRepaymentOfPrincipalAccountingEntry(event);
                event.setAccountingEntry(repaymentOfPrincipalAccountingEntry);
                events.add(event);
                accountingEntries.addAll(repaymentOfPrincipalAccountingEntry);
            }

            return amount.subtract(principal);
        };

        this.traverse(
                unpaidInstallments,
                timestamp,
                repaymentSplit.getTotal(),
                interestHandler,
                principalHandler
        );

        return new RepaymentResult(installments, affectedNumbers, events, accountingEntries);
    }

    private RepaymentSplit getParts(Borrowing borrowing, LocalDateTime timestamp) {
        // Find all installments due as of date
        List<BorrowingInstallment> allInstallments = this
                .borrowingService
                .getInstallmentsByBorrowing(borrowing, DateHelper.getLocalDateTimeNow());
        List<BorrowingInstallment> installments = allInstallments
                .stream()
                .filter(x -> !x.isPaid() && x.isBeforeOrEqualToDate(timestamp.toLocalDate()))
                .collect(Collectors.toList());

        BigDecimal principal = installments.stream()
                .map(BorrowingInstallment::getPrincipalDue).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interest = installments.stream()
                .map(BorrowingInstallment::getInterestDue).reduce(BigDecimal.ZERO, BigDecimal::add);

        RepaymentSplit result = new RepaymentSplit();
        result.setTimestamp(timestamp);
        result.setRepaymentType(RepaymentTypes.NORMAL_REPAYMENT);
        result.setPrincipal(principal);
        result.setInterest(interest);
        result.setTotal(principal.add(interest));
        result.setMax(this.getMax(allInstallments));
        return result;
    }

    private BigDecimal getMax(List<BorrowingInstallment> installments) {
        BigDecimal allPrincipal = installments.stream().map(BorrowingInstallment::getPrincipal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal paidPrincipal = installments.stream().map(BorrowingInstallment::getPaidPrincipal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal allInterest = installments.stream().map(BorrowingInstallment::getInterest).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal paidInterest = installments.stream().map(BorrowingInstallment::getPaidInterest).reduce(BigDecimal.ZERO, BigDecimal::add);

        return allPrincipal.subtract(paidPrincipal).add(allInterest).subtract(paidInterest);
    }

    private RepaymentSplit splitTotal(Borrowing borrowing, LocalDateTime timestamp, BigDecimal total) {
        List<BorrowingInstallment> allInstallments = this
                .borrowingService
                .getInstallmentsByBorrowing(borrowing, DateHelper.getLocalDateTimeNow());
        List<BorrowingInstallment> installments = allInstallments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());

        RepaymentSplit result = new RepaymentSplit();
        result.setTotal(total);
        result.setTimestamp(timestamp);
        result.setRepaymentType(RepaymentTypes.NORMAL_REPAYMENT);
        result.setMax(this.getMax(allInstallments));

        BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> interestHandler = (i, amount) -> {
            BigDecimal interest = i.getInterestDue().compareTo(amount) > 0 ? amount : i.getInterestDue();
            result.addInterest(interest);
            return amount.subtract(interest);
        };

        BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> principalHandler = (i, amount) -> {
            BigDecimal principal = i.getPrincipalDue().compareTo(amount) > 0 ? amount : i.getPrincipalDue();
            result.addPrincipal(principal);
            return amount.subtract(principal);
        };

        this.traverse(
                installments,
                timestamp,
                total,
                interestHandler,
                principalHandler);

        return result;
    }

    private void traverse(
            List<BorrowingInstallment> installments,
            LocalDateTime timestamp,
            BigDecimal amount,
            BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> interestHandler,
            BiFunction<BorrowingInstallment, BigDecimal, BigDecimal> principalHandler) {

        // HANDLE LATE INSTALLMENTS
        List<BorrowingInstallment> lateInstallments = installments
                .stream()
                .filter(x -> x.isBeforeDate(timestamp))
                .collect(Collectors.toList());

        // Handle interest
        for (BorrowingInstallment i : lateInstallments) {
            amount = interestHandler.apply(i, amount);
            if (amount.compareTo(BigDecimal.ZERO) == 0) return;
        }

        // Handle principal
        for (BorrowingInstallment i : lateInstallments) {
            amount = principalHandler.apply(i, amount);
            if (amount.compareTo(BigDecimal.ZERO) == 0) return;
        }

        // HANDLE THE REST OF THE SCHEDULE
        installments = installments
                .stream()
                .filter(x -> !x.isBeforeDate(timestamp))
                .collect(Collectors.toList());
        for (BorrowingInstallment i : installments) {

            // Handle interest
            amount = interestHandler.apply(i, amount);
            if (amount.compareTo(BigDecimal.ZERO) == 0) return;

            // Handle principal
            amount = principalHandler.apply(i, amount);
            if (amount.compareTo(BigDecimal.ZERO) == 0) return;
        }
    }
}
