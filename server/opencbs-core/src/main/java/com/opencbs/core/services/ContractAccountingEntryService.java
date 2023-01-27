package com.opencbs.core.services;

import com.opencbs.core.domain.User;

import java.time.LocalDate;
import java.util.List;

public interface ContractAccountingEntryService {

    List<Long> getIdsAccountEntriesWithEvent(LocalDate from, LocalDate to, User user);
}
