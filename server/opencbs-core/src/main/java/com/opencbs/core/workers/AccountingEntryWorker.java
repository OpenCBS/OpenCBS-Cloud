package com.opencbs.core.workers;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.MultipleTransactionDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AccountingEntryWorker {
    List<AccountingEntry> makeMultipleTransaction(MultipleTransactionDto multipleTransactionDto);

    ResponseEntity printReceipt(MultipleTransactionDto multipleTransactionDto);
}
