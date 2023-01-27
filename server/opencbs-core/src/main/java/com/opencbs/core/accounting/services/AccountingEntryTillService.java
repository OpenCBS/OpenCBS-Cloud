package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.domain.AccountingEntryTill;
import com.opencbs.core.accounting.repositories.AccountingEntryTillsRepository;
import com.opencbs.core.domain.enums.TillOperation;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.till.Till;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AccountingEntryTillService {

    private final AccountingEntryTillsRepository accountingEntryTillsRepository;

    @Autowired
    public AccountingEntryTillService(AccountingEntryTillsRepository accountingEntryTillsRepository) {
        this.accountingEntryTillsRepository = accountingEntryTillsRepository;
    }

    public AccountingEntryTill create(AccountingEntryTill accountEntryTills) {
        return this.accountingEntryTillsRepository.save(accountEntryTills);
    }

    public AccountingEntryTill createAccountingEntryTills(AccountingEntry accountingEntry, TillOperation operationType,
                                                          Profile profile, Till till, String docNo, String initiator) {
        AccountingEntryTill accountEntryTills = new AccountingEntryTill();
        accountEntryTills.setAccountingEntries(accountingEntry);
        accountEntryTills.setOperationType(operationType);
        accountEntryTills.setInitiatedBy(profile);
        accountEntryTills.setTill(till);
        accountEntryTills.setDocumentNumber(docNo);
        accountEntryTills.setInitiator(initiator);
        return accountEntryTills;
    }

    public List<AccountingEntryTill> getListAccountingEntryTill(List<AccountingEntry> accountingEntries, TillOperation operationType, Till till) {
        List<AccountingEntryTill> accountingEntryTills = new ArrayList<>();
        for (AccountingEntry accountingEntry : accountingEntries) {
            accountingEntryTills.add(this.createAccountingEntryTills(accountingEntry, operationType, null, till, null, null));
        }
        return accountingEntryTills;
    }

    public List<AccountingEntryTill> create(List<AccountingEntryTill> accountingEntryTills) {
        return this.accountingEntryTillsRepository.save(accountingEntryTills);
    }

    public String generateDocNumber() {
        Integer docNumber;
        AccountingEntryTill accountingEntryTill = this.accountingEntryTillsRepository.findFirstByOperationTypeOrderByIdDesc(TillOperation.DEPOSIT);
        if (accountingEntryTill == null || accountingEntryTill.getDocumentNumber() == null) {
            docNumber = 1;
        } else {
            docNumber = Integer.parseInt(accountingEntryTill.getDocumentNumber()) + 1;
        }
        return docNumber.toString();
    }

    public List<AccountingEntryTill> getByTillAndDate(Till till, LocalDateTime startDate, LocalDateTime endDate) {
        return this.accountingEntryTillsRepository.findAllByTillAndAccountingEntries_EffectiveAtGreaterThanEqualAndAccountingEntries_EffectiveAtLessThanEqual(till, startDate, endDate);
    }
}
