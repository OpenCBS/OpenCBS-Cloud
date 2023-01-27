package com.opencbs.bonds.dayclosure;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondEventInstallmentAccrual;
import com.opencbs.bonds.domain.BondInstallmentInterestAccrual;
import com.opencbs.bonds.domain.BondInterestAccrual;
import com.opencbs.bonds.domain.enums.BondAccountRuleType;
import com.opencbs.bonds.repositories.BondInstallmentInterestAccrualRepository;
import com.opencbs.bonds.repositories.BondInterestAccrualRepository;
import com.opencbs.bonds.services.BondAccountService;
import com.opencbs.bonds.services.BondEventGroupKeyService;
import com.opencbs.bonds.services.BondEventInstallmentAccrualService;
import com.opencbs.bonds.services.BondEventService;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.chrono.ChronoLocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BondInterestAccrualProcessor implements BondDayClosureProcessor {

    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
    private static final int DECIMAL_PLACE = 2;

    private final BondAccountService bondAccountService;
    private final BondEventGroupKeyService bondEventGroupKeyService;
    private final AccountingEntryService accountingEntryService;
    private final BondInterestAccrualRepository bondRepository;
    private final BondInstallmentInterestAccrualRepository bondInstallmentRepository;
    private final BondEventInstallmentAccrualService bondEventInstallmentAccrualService;
    private final BondEventService bondEventService;


    @Override
    public void processContract(@NonNull Long bondId, @NonNull LocalDate closureDate, @NonNull User user) {
        BondInterestAccrual bond = bondRepository.findOne(bondId);
        List<BondInstallmentInterestAccrual> installments = bondInstallmentRepository.findByBondId(bond.getId());

        AccountingEntry accountingEntry = createAccrualAccountingEntry(bond, closureDate, user, installments);
        createEvent(bond, closureDate, user, accountingEntry, installments);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.BOND_INTEREST_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "bond.interest-accrual";
    }

    private AccountingEntry createAccrualAccountingEntry(@NonNull BondInterestAccrual bond,
                                                         @NonNull LocalDate dayClosureDate,
                                                         @NonNull User user,
                                                         @NonNull List<BondInstallmentInterestAccrual> installments) {
        AccountingEntry entry = getAccountingEntry(bond, dayClosureDate, user, installments);
        return entry.getAmount().compareTo(BigDecimal.ZERO) > 0
                ? accountingEntryService.create(entry)
                : null;
    }

    private void createEvent(@NonNull BondInterestAccrual bond,
                             @NonNull LocalDate closureDate,
                             @NonNull User user,
                             @NonNull AccountingEntry accountingEntry,
                             @NonNull List<BondInstallmentInterestAccrual> installments) {
        LocalDateTime closureDateTime = closureDate.atTime(getProcessType().getOperationTime());

        Integer installmentNumber = getBondInstallmentNumber(installments, closureDate);
        if (installmentNumber == null) {
            return;
        }

        BondEvent event = new BondEvent();
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        if (closureDate.compareTo(getSellDate(bond).toLocalDate()) > 0) {
            event.setEffectiveAt(closureDateTime);
        } else {
            event.setEffectiveAt(closureDateTime.plusMinutes(1));
        }

        event.setSystem(true);
        event.setEventType(EventType.ACCRUAL_OF_INTEREST);
        event.setBondId(bond.getId());
        event.setCreatedById(user.getId());
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(getInterest(closureDate, bond, installments,true));
        event.setGroupKey(bondEventGroupKeyService.getNextBondEventGroupKey());

        if (accountingEntry != null) {
            event.setAccountingEntry(Collections.singletonList(accountingEntry));
        }

        bondEventService.save(event);
    }

    private AccountingEntry getAccountingEntry(@NonNull BondInterestAccrual bond,
                                               @NonNull LocalDate date,
                                               @NonNull User user,
                                               @NonNull List<BondInstallmentInterestAccrual> installments) {
        BigDecimal interest = getInterest(date, bond, installments, false);

        Account debitAccount = bondAccountService.getAccount(bond.getBondAccounts(), BondAccountRuleType.INTEREST_EXPENSE);
        Account creditAccount = bondAccountService.getAccount(bond.getBondAccounts(), BondAccountRuleType.INTEREST_ACCRUAL);

        return  AccountingEntry.builder()
                .amount(interest)
                .debitAccount(debitAccount)
                .creditAccount(creditAccount)
                .deleted(false)
                .branch(bond.getProfile().getBranch())
                .createdBy(user)
                .description(String.format("Interest accrual for bond %s", bond.getIsin()))
                .createdAt(DateHelper.getLocalDateTimeNow())
                .effectiveAt(date.atTime(getProcessType().getOperationTime()))
                .build();
    }

    private BigDecimal getInterest(@NonNull LocalDate date,
                                   @NonNull BondInterestAccrual bond,
                                   @NonNull List<BondInstallmentInterestAccrual> installments,
                                   boolean getEquivalent) {
        LocalDate lastAccrualDate = installments
                .stream()
                .sorted(Comparator.comparing(BondInstallmentInterestAccrual::getLastAccrualDate))
                .filter(x -> x.getLastAccrualDate().compareTo(ChronoLocalDate.from(date.minusDays(1))) > 0)
                .map(BondInstallmentInterestAccrual::getLastAccrualDate)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No installments found"));       ;

        Integer installmentNumber = getBondInstallmentNumber(installments, date);
        if (date.equals(lastAccrualDate)) {
            return completeInstallment(bond, installments, installmentNumber);
        }

        BigDecimal amount = getEquivalent
                ? bond.getEquivalentAmount()
                : bond.getAmount();

        BigDecimal interestAmount = amount
                .multiply(bond.getInterestRate()
                        .divide(BigDecimal.valueOf(100)))
                .divide(BigDecimal.valueOf(Year.of(date.getYear()).length()), RoundingMode.HALF_DOWN);
        return interestAmount.setScale(DECIMAL_PLACE, ROUNDING_MODE);
    }

    private BigDecimal completeInstallment(@NonNull BondInterestAccrual bond,
                                           @NonNull List<BondInstallmentInterestAccrual> installments,
                                           @NonNull Integer installmentNumber) {
        BigDecimal sumOfTotalAmount = bondEventInstallmentAccrualService.getBondEvents(bond.getId(), EventType.ACCRUAL_OF_INTEREST)
                .stream()
                .filter(x -> x.getInstallmentNumber().equals(installmentNumber))
                .map(BondEventInstallmentAccrual::getAmount)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);

        BigDecimal interest = installments.stream()
                .filter(x -> x.getNumber().equals(installmentNumber))
                .map(BondInstallmentInterestAccrual::getInterest)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No installments found with number"));

        return interest.subtract(sumOfTotalAmount);
    }

    private LocalDateTime getSellDate(@NonNull BondInterestAccrual bond) {
        return bondEventInstallmentAccrualService.getBondEvents(bond.getId(), EventType.SELL)
                .stream()
                .map(BondEventInstallmentAccrual::getEffectiveAt)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No bond events found for type:" + EventType.SELL));
    }

    private Integer getBondInstallmentNumber(@NonNull List<BondInstallmentInterestAccrual> installmens, @NonNull LocalDate closureDate) {
        return installmens
                .stream()
                .filter(x -> x.getLastAccrualDate().compareTo(ChronoLocalDate.from(closureDate.minusDays(1))) > 0)
                .map(BondInstallmentInterestAccrual::getNumber)
                .findFirst()
                .orElse(null);
    }


}
