package com.opencbs.bonds.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.User;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class BondRepaymentResult {
    private List<BondInstallment> installments;
    private Set<Integer> affectedNumbers;
    private List<BondEvent> events;
    private Bond bond;
    private LocalDateTime timestamp;
    private User currentUser;
    private List<AccountingEntry> accountingEntries;

    public BondRepaymentResult(
            List<BondInstallment> installments,
            Set<Integer> affectedNumbers,
            List<BondEvent> events,
            List<AccountingEntry> accountingEntries
    ) {
        this.installments = installments;
        this.affectedNumbers = affectedNumbers;
        this.events = events;
        this.accountingEntries = accountingEntries;
    }
}
