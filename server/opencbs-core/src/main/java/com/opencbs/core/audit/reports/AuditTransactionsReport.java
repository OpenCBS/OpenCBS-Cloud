package com.opencbs.core.audit.reports;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.SortedAccountingEntryDto;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.audit.AuditReport;
import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.audit.dto.AuditTransactionDto;
import com.opencbs.core.domain.User;
import com.opencbs.core.services.ContractAccountingEntryService;
import com.opencbs.core.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AuditTransactionsReport implements AuditReport {

    private final AccountingEntryService accountingEntryService;
    private final List<ContractAccountingEntryService> contractEntryServices;
    private final UserService userService;


    @Override
    public AuditReportType getType() {
        return AuditReportType.TRANSACTIONS;
    }

    @Override
    public Page getRecords(AuditReportDto filter, Pageable pageable) {
        SortedAccountingEntryDto sortedAccountingEntryDto = new SortedAccountingEntryDto();
        sortedAccountingEntryDto.setFromDate(filter.getFromDate());
        sortedAccountingEntryDto.setToDate(filter.getToDate());

        User user = this.userService.findByUsername(filter.getUsername()).orElse(null);
        Set<Long> accountEntryWithEventIds = new HashSet<>();
        contractEntryServices.forEach(contractEntryService->{
            accountEntryWithEventIds.addAll(contractEntryService.getIdsAccountEntriesWithEvent(filter.getFromDate(), filter.getToDate(), user));
        });

        Pageable pages = new PageRequest(0, Integer.MAX_VALUE, Sort.Direction.DESC, "effective_at");
        List<AccountingEntry> accountingEntries = this.accountingEntryService.getAll(sortedAccountingEntryDto, pages).getContent()
                .stream()
                .filter(accountingEntry -> !accountEntryWithEventIds.contains(accountingEntry.getId()))
                .collect(Collectors.toList());

        if (accountingEntries.isEmpty()) {
            return new PageImpl(Collections.EMPTY_LIST, pageable, accountingEntries.size());
        }

        int fromPosition = (accountingEntries.size() < pageable.getOffset()) ? accountingEntries.size() : pageable.getOffset();
        int toPosition = (accountingEntries.size() > pageable.getOffset() + pageable.getPageSize()) ? pageable.getOffset() + pageable.getPageSize() : accountingEntries.size();
        List<AccountingEntry> accountingEntryPart = accountingEntries.subList(fromPosition, toPosition);

        return new PageImpl(accountingEntryPart, pageable, accountingEntries.size())
                .map(source -> this.createAuditTransactionDto((AccountingEntry) source));
    }

    private AuditTransactionDto createAuditTransactionDto(AccountingEntry source) {
        AuditTransactionDto auditTransactionDto = AuditTransactionDto.builder()
                .amount(source.getAmount())
                .creditAccount(source.getCreditAccount().getNumber())
                .debitAccount(source.getDebitAccount().getNumber())
                .description(source.getDescription())
                .build();

        auditTransactionDto.setUsername(source.getCreatedBy().getFullName());
        auditTransactionDto.setDateTime(source.getCreatedAt());

        return auditTransactionDto;
    }
}
