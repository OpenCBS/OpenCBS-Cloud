package com.opencbs.core.accounting.repositories.customs;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.till.Operation;
import com.opencbs.core.domain.till.Till;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface TillRepositoryCustom {

    Page<Operation> getOperationsByCurrency(Pageable pageable, Till till, Currency currency, LocalDateTime fromDate, LocalDateTime toDate);

    Page<Operation> getOperations(Pageable pageable, Till till, LocalDateTime fromDate, LocalDateTime toDate);

    Page<Till> search(Pageable pageable, String searchString);

    Page<User> findAllTeller(Pageable pageable, String searchString);
}
