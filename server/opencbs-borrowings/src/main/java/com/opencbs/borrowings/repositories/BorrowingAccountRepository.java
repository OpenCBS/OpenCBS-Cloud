package com.opencbs.borrowings.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.borrowings.domain.BorrowingAccount;

import java.util.List;

public interface BorrowingAccountRepository extends Repository<BorrowingAccount> {
    List<BorrowingAccount> getAllByBorrowingId(Long borrowingId);
}