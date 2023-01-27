package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.domain.AccountingEntryLog;
import com.opencbs.core.accounting.repositories.AccountingEntryLogRepository;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.messenger.MessageDto;
import com.opencbs.core.dto.messenger.MessageType;
import com.opencbs.core.helpers.AmqMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AccountingEntryLogService {
    private final AccountingEntryLogRepository accountingEntryLogRepository;
    private final AmqMessageHelper amqMessageHelper;

    @Autowired
    public AccountingEntryLogService(AccountingEntryLogRepository accountingEntryLogRepository,
                                     AmqMessageHelper amqMessageHelper) {
        this.accountingEntryLogRepository = accountingEntryLogRepository;
        this.amqMessageHelper = amqMessageHelper;
    }

    @Transactional
    public void saveAccountingEntryLog(AccountingEntry accountingEntry) {
        AccountingEntryLog accountingEntryLog = new AccountingEntryLog();
        accountingEntryLog.setAccountingEntry(accountingEntry);
        accountingEntryLog.setEffectiveDate(accountingEntry.getEffectiveAt());
        accountingEntryLog.setUser(accountingEntry.getCreatedBy());
        accountingEntryLog.setHandled(false);
        this.accountingEntryLogRepository.save(accountingEntryLog);
    }

    public void checkActualBalance(User user) {
        Optional<AccountingEntryLog> accountingEntryLog = this.accountingEntryLogRepository.findFirstByHandledFalse();
        if (accountingEntryLog.isPresent()) {
            Map payload = new HashMap();
            payload.put("type", "error");
            payload.put("message", "Trial Balances are incorrect! Please launch balance recalculation.");
            this.amqMessageHelper.sendMessageToUser(user, MessageDto.builder()
                    .messageType(MessageType.NOTIFICATION)
                    .payload(payload)
                    .build());
        }
    }
}
